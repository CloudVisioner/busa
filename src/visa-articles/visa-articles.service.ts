import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { PrismaService } from '../prisma/prisma.service'
import { CreateVisaArticleInput } from './create-visa-article.input'
import { UpdateVisaArticleInput } from './update-visa-article.input'
import { PrismaVisaType } from '../common/enums'
import { Errors } from '../common/errors'

const CACHE_KEY = 'visa_articles'
const CACHE_TTL = 5 * 60 * 1000

@Injectable()
export class VisaArticlesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findAll(page = 1, limit = 10) {
    const all = await this.fetchAllCached()
    const start = (page - 1) * limit
    const items = all.slice(start, start + limit)
    return { items, total: all.length, page, limit }
  }

  private async fetchAllCached() {
    const cached = await this.cache.get<unknown[]>(CACHE_KEY)
    if (cached) return cached
    const articles = await this.prisma.visaArticle.findMany({ orderBy: { createdAt: 'desc' } })
    await this.cache.set(CACHE_KEY, articles, CACHE_TTL)
    return articles
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.visaArticle.findUnique({ where: { slug } })
    if (!article) throw Errors.NOT_FOUND('Visa article')
    return article
  }

  async findByType(visaType: PrismaVisaType) {
    return this.prisma.visaArticle.findMany({
      where: { visaType },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(input: CreateVisaArticleInput) {
    try {
      const result = await this.prisma.visaArticle.create({ data: input })
      await this.cache.del(CACHE_KEY)
      return result
    } catch (err: unknown) {
      if (isPrismaUniqueError(err)) throw Errors.ALREADY_EXISTS('Visa article', 'slug')
      throw err
    }
  }

  async update(id: string, input: UpdateVisaArticleInput) {
    const existing = await this.prisma.visaArticle.findUnique({ where: { id } })
    if (!existing) throw Errors.NOT_FOUND('Visa article')
    const result = await this.prisma.visaArticle.update({ where: { id }, data: input })
    await this.cache.del(CACHE_KEY)
    return result
  }

  async delete(id: string) {
    const existing = await this.prisma.visaArticle.findUnique({ where: { id } })
    if (!existing) throw Errors.NOT_FOUND('Visa article')
    const result = await this.prisma.visaArticle.delete({ where: { id } })
    await this.cache.del(CACHE_KEY)
    return result
  }
}

function isPrismaUniqueError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === 'P2002'
  )
}
