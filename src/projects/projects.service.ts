import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProjectInput } from './create-project.input'
import { UpdateProjectInput } from './update-project.input'
import { Errors } from '../common/errors'

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      this.prisma.project.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.project.count(),
    ])
    return { items, total, page, limit }
  }

  async findFeatured() {
    return this.prisma.project.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } })
    if (!project) throw Errors.NOT_FOUND('Project')
    return project
  }

  async create(input: CreateProjectInput) {
    try {
      return await this.prisma.project.create({ data: input })
    } catch (err: unknown) {
      if (isPrismaUniqueError(err)) throw Errors.ALREADY_EXISTS('Project', 'slug')
      throw err
    }
  }

  async update(id: string, input: UpdateProjectInput) {
    const existing = await this.prisma.project.findUnique({ where: { id } })
    if (!existing) throw Errors.NOT_FOUND('Project')
    return this.prisma.project.update({ where: { id }, data: input })
  }

  async delete(id: string) {
    const existing = await this.prisma.project.findUnique({ where: { id } })
    if (!existing) throw Errors.NOT_FOUND('Project')
    return this.prisma.project.delete({ where: { id } })
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
