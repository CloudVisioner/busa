import * as dotenv from 'dotenv';
dotenv.config();

import {
  BeforeApplicationShutdown,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizePostgresConnectionString(raw?: string): string {
  if (!raw?.trim()) {
    throw new Error('DATABASE_URL is missing');
  }

  const connectionString = raw.trim();

  try {
    new URL(connectionString);
    return connectionString;
  } catch {
    // Continue with fallback normalization for non-encoded credentials in legacy env values.
  }

  const protocolMatch = connectionString.match(/^(postgres(?:ql)?):\/\/(.*)$/i);
  if (!protocolMatch) {
    throw new Error(
      'DATABASE_URL must start with postgres:// or postgresql://',
    );
  }

  const protocol = protocolMatch[1];
  const remainder = protocolMatch[2];
  const atIndex = remainder.lastIndexOf('@');
  const credentialPart = atIndex >= 0 ? remainder.slice(0, atIndex) : '';
  const hostAndDbPart = atIndex >= 0 ? remainder.slice(atIndex + 1) : remainder;

  if (!credentialPart.includes(':')) {
    throw new Error('DATABASE_URL credentials must be in user:password format');
  }

  const separatorIndex = credentialPart.indexOf(':');
  const rawUser = credentialPart.slice(0, separatorIndex);
  const rawPassword = credentialPart.slice(separatorIndex + 1);
  const encodedUser = encodeURIComponent(safeDecodeURIComponent(rawUser));
  const encodedPassword = encodeURIComponent(
    safeDecodeURIComponent(rawPassword),
  );
  const normalized = `${protocol}://${encodedUser}:${encodedPassword}@${hostAndDbPart}`;

  try {
    new URL(normalized);
    return normalized;
  } catch {
    throw new Error(
      'DATABASE_URL is invalid. URL-encode special characters in username/password.',
    );
  }
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, BeforeApplicationShutdown
{
  private pool: Pool;

  constructor() {
    const connectionString = normalizePostgresConnectionString(
      process.env.DATABASE_URL,
    );

    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✓ Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }

  async beforeApplicationShutdown() {
    await this.$disconnect();
  }
}
