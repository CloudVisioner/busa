import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProjectInput } from './create-project.input'
import { UpdateProjectInput } from './update-project.input'

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async findFeatured() {
    return this.prisma.project.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findBySlug(slug: string) {
    return this.prisma.project.findUnique({ where: { slug } })
  }

  async create(input: CreateProjectInput) {
    return this.prisma.project.create({ data: input })
  }

  async update(id: string, input: UpdateProjectInput) {
    return this.prisma.project.update({ where: { id }, data: input })
  }

  async delete(id: string) {
    return this.prisma.project.delete({ where: { id } })
  }
}
