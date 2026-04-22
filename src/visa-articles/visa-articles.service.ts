import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateVisaArticleInput } from './create-visa-article.input'
import { UpdateVisaArticleInput } from './update-visa-article.input'
import { PrismaVisaType } from '../common/enums'

@Injectable()
export class VisaArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.visaArticle.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async findBySlug(slug: string) {
    return this.prisma.visaArticle.findUnique({ where: { slug } })
  }

  async findByType(visaType: PrismaVisaType) {
    return this.prisma.visaArticle.findMany({
      where: { visaType },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(input: CreateVisaArticleInput) {
    return this.prisma.visaArticle.create({ data: input })
  }

  async update(id: string, input: UpdateVisaArticleInput) {
    return this.prisma.visaArticle.update({ where: { id }, data: input })
  }

  async delete(id: string) {
    return this.prisma.visaArticle.delete({ where: { id } })
  }
}
