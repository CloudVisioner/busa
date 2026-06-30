import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from './prisma/prisma.service';

@ObjectType()
class HealthObject {
  @Field() status: string;
  @Field() database: string;
  @Field() timestamp: string;
}

@Resolver()
export class AppResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => HealthObject)
  async health(): Promise<HealthObject> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
