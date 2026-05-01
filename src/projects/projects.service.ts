import { Injectable } from '@nestjs/common';
import { ProjectStatus as PrismaProjectStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectInput } from './create-project.input';
import { UpdateProjectInput } from './update-project.input';
import { Errors } from '../common/errors';
import { sanitizeRichText } from '../common/sanitize';
import { PaginationInput } from '../common/pagination.input';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateProjectInput) {
    const slug = await this.generateUniqueSlug(input.title);
    const sanitizedDescription = sanitizeRichText(input.description) ?? '';

    return this.prisma.project.create({
      data: {
        title: input.title,
        slug,
        description: sanitizedDescription,
        coverPhoto: input.coverPhoto,
        photos: input.photos ?? [],
        icon: input.icon,
        status: (input.status as PrismaProjectStatus | undefined) ?? PrismaProjectStatus.ACTIVE,
        startDate: input.startDate,
        endDate: input.endDate,
        members: input.members ?? [],
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    return this.prisma.project.findFirst({ where: { id } });
  }

  async findFeatured() {
    return this.prisma.project.findFirst({ where: { isFeatured: true } });
  }

  async findBySlug(slug: string) {
    return this.prisma.project.findFirst({ where: { slug } });
  }

  async update(input: UpdateProjectInput) {
    const { id, ...data } = input;
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) throw Errors.NOT_FOUND('Project');

    if (data.description) {
      data.description = sanitizeRichText(data.description) ?? '';
    }

    const nextSlug = data.title
      ? await this.generateUniqueSlug(data.title, id)
      : undefined;

    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        ...(nextSlug ? { slug: nextSlug } : {}),
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) throw Errors.NOT_FOUND('Project');
    return this.prisma.project.delete({ where: { id } });
  }

  async setFeatured(id: string) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) throw Errors.NOT_FOUND('Project');

    await this.prisma.project.updateMany({ data: { isFeatured: false } });
    return this.prisma.project.update({
      where: { id },
      data: { isFeatured: true },
    });
  }

  async paginated(pagination?: PaginationInput) {
    const limit = pagination?.limit ?? 12;
    const offset = pagination?.offset ?? 0;
    const where: Prisma.ProjectWhereInput = {};

    if (pagination?.search?.trim()) {
      const term = pagination.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ];
    }

    if (pagination?.type?.trim()) {
      where.status = pagination.type.trim() as PrismaProjectStatus;
    }

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return { items, total, hasMore: offset + limit < total };
  }

  private async generateUniqueSlug(title: string, skipId?: string) {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const normalizedBase = baseSlug || 'project';
    let candidate = normalizedBase;
    let suffix = 2;

    while (true) {
      const existing = await this.prisma.project.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      if (!existing || existing.id === skipId) return candidate;
      candidate = `${normalizedBase}-${suffix}`;
      suffix += 1;
    }
  }
}
