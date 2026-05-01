import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimelineEntryInput } from './create-timeline-entry.input';
import { UpdateTimelineEntryInput } from './update-timeline-entry.input';
import { Errors } from '../common/errors';
import { sanitizeRichText } from '../common/sanitize';

const CACHE_KEY = 'timeline';
const CACHE_TTL = 60 * 60 * 1000;

@Injectable()
export class TimelineService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findAll(page = 1, limit = 10) {
    const all = await this.fetchAllCached();
    const start = (page - 1) * limit;
    const items = all.slice(start, start + limit);
    return { items, total: all.length, page, limit };
  }

  private async fetchAllCached() {
    const cached = await this.cache.get<unknown[]>(CACHE_KEY);
    if (cached) return cached;
    const entries = await this.prisma.timelineEntry.findMany({
      orderBy: { createdAt: 'asc' },
    });
    await this.cache.set(CACHE_KEY, entries, CACHE_TTL);
    return entries;
  }

  async create(input: CreateTimelineEntryInput) {
    const result = await this.prisma.timelineEntry.create({
      data: {
        ...input,
        description: sanitizeRichText(input.description) ?? '',
      },
    });
    await this.cache.del(CACHE_KEY);
    return result;
  }

  async update(id: string, input: UpdateTimelineEntryInput) {
    const existing = await this.prisma.timelineEntry.findUnique({
      where: { id },
    });
    if (!existing) throw Errors.NOT_FOUND('Timeline entry');
    const result = await this.prisma.timelineEntry.update({
      where: { id },
      data: {
        ...input,
        ...(input.description !== undefined
          ? { description: sanitizeRichText(input.description) ?? '' }
          : {}),
      },
    });
    await this.cache.del(CACHE_KEY);
    return result;
  }

  async delete(id: string) {
    const existing = await this.prisma.timelineEntry.findUnique({
      where: { id },
    });
    if (!existing) throw Errors.NOT_FOUND('Timeline entry');
    const result = await this.prisma.timelineEntry.delete({ where: { id } });
    await this.cache.del(CACHE_KEY);
    return result;
  }
}
