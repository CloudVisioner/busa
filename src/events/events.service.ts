import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventInput } from './create-event.input';
import { UpdateEventInput } from './update-event.input';
import { Errors } from '../common/errors';
import { sanitizeRichText } from '../common/sanitize';
import { PaginationInput } from '../common/pagination.input';
import { EventTimelineStatus, PrismaEventType } from '../common/enums';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 9) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          date: true,
          isFeatured: true,
          attendance: true,
          location: true,
          type: true,
          coverPhoto: true,
          photos: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.event.count(),
    ]);
    return {
      items: items.map((item) => this.withSafeDate(item)),
      total,
      hasMore: skip + limit < total,
      page,
      limit,
    };
  }

  async findPaginated(pagination?: PaginationInput) {
    const limit = pagination?.limit ?? 12;
    const offset = pagination?.offset ?? 0;
    const where: Prisma.EventWhereInput = {};
    const now = new Date();

    if (pagination?.search?.trim()) {
      const term = pagination.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ];
    }

    if (pagination?.type?.trim()) {
      where.type = pagination.type.trim() as PrismaEventType;
    }

    // Events are grouped by time window at query time.
    if (pagination?.status === EventTimelineStatus.UPCOMING) {
      where.date = { gte: now };
    } else if (pagination?.status === EventTimelineStatus.PAST) {
      where.date = { lt: now };
    }

    const [items, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          date: true,
          isFeatured: true,
          attendance: true,
          location: true,
          type: true,
          coverPhoto: true,
          photos: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      items: items.map((item) => this.withSafeDate(item)),
      total,
      hasMore: offset + limit < total,
      page: 1,
      limit,
    };
  }

  async findOne(args: { id?: string; slug?: string }) {
    if (!args.id && !args.slug) {
      throw new BadRequestException('Provide either id or slug');
    }
    const where = args.id ? { id: args.id } : { slug: args.slug };
    const event = await this.prisma.event.findUnique({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        date: true,
        isFeatured: true,
        attendance: true,
        location: true,
        type: true,
        coverPhoto: true,
        photos: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!event) throw Errors.NOT_FOUND('Event');
    return this.withSafeDate(event);
  }

  async findBySlug(slug: string) {
    return this.findOne({ slug });
  }

  async findFeatured() {
    const event = await this.prisma.event.findFirst({
      where: { isFeatured: true },
      select: {
        id: true,
        title: true,
        slug: true,
        date: true,
        isFeatured: true,
        attendance: true,
        location: true,
        type: true,
        coverPhoto: true,
        photos: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    if (!event) return null;
    return this.withSafeDate(event);
  }

  async create(input: CreateEventInput) {
    const slug = await this.generateUniqueSlug(input.title);
    const sanitizedDescription = sanitizeRichText(input.description);
    const eventDate = new Date(input.date);
    this.validatePhotosForEventDate(input.photos, eventDate);
    try {
      return await this.prisma.event.create({
        data: {
          title: input.title,
          slug,
          type: input.type,
          date: eventDate,
          attendance: input.attendance ?? null,
          location: input.location,
          description: sanitizedDescription ?? '',
          coverPhoto: input.coverPhoto ?? null,
          photos: input.photos ?? [],
        },
      });
    } catch (err: unknown) {
      if (isPrismaUniqueError(err))
        throw Errors.ALREADY_EXISTS('Event', 'slug');
      throw err;
    }
  }

  async update(id: string, input: UpdateEventInput) {
    const existing = await this.prisma.event.findUnique({ where: { id } });
    if (!existing) throw Errors.NOT_FOUND('Event');
    const nextSlug = input.title
      ? await this.generateUniqueSlug(input.title, id)
      : undefined;

    const sanitizedDescription =
      input.description !== undefined
        ? (sanitizeRichText(input.description) ?? '')
        : undefined;
    const effectiveDate = input.date ? new Date(input.date) : existing.date;
    this.validatePhotosForEventDate(input.photos, effectiveDate);

    return this.prisma.event.update({
      where: { id },
      data: {
        title: input.title,
        slug: nextSlug,
        type: input.type,
        date: input.date ? new Date(input.date) : undefined,
        isFeatured: input.isFeatured,
        attendance: input.attendance,
        location: input.location,
        description: sanitizedDescription,
        coverPhoto: input.coverPhoto,
        photos: input.photos,
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.event.findUnique({ where: { id } });
    if (!existing) throw Errors.NOT_FOUND('Event');
    return this.prisma.event.delete({ where: { id } });
  }

  async setFeaturedEvent(id: string) {
    const existing = await this.prisma.event.findUnique({ where: { id } });
    if (!existing) throw Errors.NOT_FOUND('Event');

    await this.prisma.event.updateMany({
      data: { isFeatured: false },
    });

    await this.prisma.event.update({
      where: { id },
      data: { isFeatured: true },
    });
  }

  private async generateUniqueSlug(title: string, skipId?: string) {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const normalizedBase = baseSlug || 'event';
    let candidate = normalizedBase;
    let suffix = 2;

    // Ensure slug uniqueness while preserving existing record on update.
    while (true) {
      const existing = await this.prisma.event.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      if (!existing || existing.id === skipId) return candidate;
      candidate = `${normalizedBase}-${suffix}`;
      suffix += 1;
    }
  }

  private withSafeDate<T extends { date: unknown }>(
    item: T,
  ): Omit<T, 'date'> & { date: string } {
    return {
      ...item,
      date: this.serializeDate(item.date),
    };
  }

  private serializeDate(value: unknown): string {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime())
        ? String(value)
        : value.toISOString();
    }

    const candidate = new Date(String(value));
    if (!Number.isNaN(candidate.getTime())) return candidate.toISOString();
    return String(value);
  }

  private validatePhotosForEventDate(
    photos: string[] | undefined,
    eventDate: Date,
  ) {
    if (!photos) return;

    if (photos.length > 5) {
      throw new BadRequestException('You can upload at most 5 photos per event');
    }

    if (eventDate >= new Date()) {
      throw new BadRequestException(
        'Photos can only be added to archived (past) events',
      );
    }
  }
}

function isPrismaUniqueError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === 'P2002'
  );
}
