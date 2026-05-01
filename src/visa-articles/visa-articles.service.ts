import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisaArticleInput } from './create-visa-article.input';
import { UpdateVisaArticleInput } from './update-visa-article.input';
import { PrismaVisaType } from '../common/enums';
import { Errors } from '../common/errors';
import { sanitizeRichText } from '../common/sanitize';
import { PaginationInput } from '../common/pagination.input';

const CACHE_KEY = 'visa_articles';
const CACHE_TTL = 5 * 60 * 1000;

@Injectable()
export class VisaArticlesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findAll(page = 1, limit = 10) {
    const all = await this.fetchAllCached();
    const start = (page - 1) * limit;
    const items = all.slice(start, start + limit);
    return {
      items,
      total: all.length,
      hasMore: start + limit < all.length,
      page,
      limit,
    };
  }

  async findPaginated(pagination?: PaginationInput) {
    const limit = pagination?.limit ?? 12;
    const offset = pagination?.offset ?? 0;
    const where: Prisma.VisaArticleWhereInput = {};

    if (pagination?.search?.trim()) {
      const term = pagination.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ];
    }

    if (pagination?.type?.trim()) {
      where.visaType = pagination.type.trim() as PrismaVisaType;
    }

    const [items, total] = await Promise.all([
      this.prisma.visaArticle.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.visaArticle.count({ where }),
    ]);

    return { items, total, hasMore: offset + limit < total, page: 1, limit };
  }

  private async fetchAllCached() {
    const cached = await this.cache.get<unknown[]>(CACHE_KEY);
    if (cached) return cached;
    const articles = await this.prisma.visaArticle.findMany({
      orderBy: { createdAt: 'desc' },
    });
    await this.cache.set(CACHE_KEY, articles, CACHE_TTL);
    return articles;
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.visaArticle.findUnique({
      where: { slug },
    });
    if (!article) throw Errors.NOT_FOUND('Visa article');
    return article;
  }

  async findByType(visaType: PrismaVisaType) {
    return this.prisma.visaArticle.findMany({
      where: { visaType },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(input: CreateVisaArticleInput) {
    try {
      const result = await this.prisma.visaArticle.create({
        data: {
          ...input,
          description: sanitizeRichText(input.description) ?? '',
          content: sanitizeRichText(input.content) ?? '',
        },
      });
      await this.cache.del(CACHE_KEY);
      return result;
    } catch (err: unknown) {
      if (isPrismaUniqueError(err))
        throw Errors.ALREADY_EXISTS('Visa article', 'slug');
      throw err;
    }
  }

  async update(id: string, input: UpdateVisaArticleInput) {
    const existing = await this.prisma.visaArticle.findUnique({
      where: { id },
    });
    if (!existing) throw Errors.NOT_FOUND('Visa article');
    const result = await this.prisma.visaArticle.update({
      where: { id },
      data: {
        ...input,
        ...(input.description !== undefined
          ? { description: sanitizeRichText(input.description) ?? '' }
          : {}),
        ...(input.content !== undefined
          ? { content: sanitizeRichText(input.content) ?? '' }
          : {}),
      },
    });
    await this.cache.del(CACHE_KEY);
    return result;
  }

  async delete(id: string) {
    const existing = await this.prisma.visaArticle.findUnique({
      where: { id },
    });
    if (!existing) throw Errors.NOT_FOUND('Visa article');
    const result = await this.prisma.visaArticle.delete({ where: { id } });
    await this.cache.del(CACHE_KEY);
    return result;
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
