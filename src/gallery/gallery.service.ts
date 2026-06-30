import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGalleryPhotoInput } from './create-gallery-photo.input';
import { Errors } from '../common/errors';
import { PaginationInput } from '../common/pagination.input';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.galleryPhoto.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.galleryPhoto.count(),
    ]);
    return { items, total, hasMore: skip + limit < total, page, limit };
  }

  async findPaginated(pagination?: PaginationInput) {
    const limit = pagination?.limit ?? 12;
    const offset = pagination?.offset ?? 0;
    const where: Prisma.GalleryPhotoWhereInput = {};

    if (pagination?.search?.trim()) {
      const term = pagination.search.trim();
      where.OR = [
        { alt: { contains: term, mode: 'insensitive' } },
        { eventName: { contains: term, mode: 'insensitive' } },
      ];
    }

    if (pagination?.type?.trim()) {
      where.event = pagination.type.trim();
    }

    const [items, total] = await Promise.all([
      this.prisma.galleryPhoto.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.galleryPhoto.count({ where }),
    ]);

    return { items, total, hasMore: offset + limit < total, page: 1, limit };
  }

  async findByYear(year: number) {
    return this.prisma.galleryPhoto.findMany({
      where: { year },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEvent(event: string) {
    return this.prisma.galleryPhoto.findMany({
      where: { event },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(input: CreateGalleryPhotoInput) {
    return this.prisma.galleryPhoto.create({ data: input });
  }

  async delete(id: string) {
    const existing = await this.prisma.galleryPhoto.findUnique({
      where: { id },
    });
    if (!existing) throw Errors.NOT_FOUND('Gallery photo');
    return this.prisma.galleryPhoto.delete({ where: { id } });
  }
}
