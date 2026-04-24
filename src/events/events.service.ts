import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateEventInput } from './create-event.input'
import { UpdateEventInput } from './update-event.input'
import { Errors } from '../common/errors'

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 9) {
    const skip = (page - 1) * limit
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
          location: true,
          type: true,
          isUpcoming: true,
          coverPhoto: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.event.count(),
    ])
    return { items, total, page, limit }
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({ where: { slug } })
    if (!event) throw Errors.NOT_FOUND('Event')
    return event
  }

  async findUpcoming() {
    return this.prisma.event.findMany({
      where: { isUpcoming: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(input: CreateEventInput) {
    try {
      return await this.prisma.event.create({ data: input })
    } catch (err: unknown) {
      if (isPrismaUniqueError(err)) throw Errors.ALREADY_EXISTS('Event', 'slug')
      throw err
    }
  }

  async update(id: string, input: UpdateEventInput) {
    const existing = await this.prisma.event.findUnique({ where: { id } })
    if (!existing) throw Errors.NOT_FOUND('Event')
    return this.prisma.event.update({ where: { id }, data: input })
  }

  async delete(id: string) {
    const existing = await this.prisma.event.findUnique({ where: { id } })
    if (!existing) throw Errors.NOT_FOUND('Event')
    return this.prisma.event.delete({ where: { id } })
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
