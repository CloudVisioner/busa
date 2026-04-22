import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateEventInput } from './create-event.input'
import { UpdateEventInput } from './update-event.input'

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 9) {
    return this.prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })
  }

  async findBySlug(slug: string) {
    return this.prisma.event.findUnique({ where: { slug } })
  }

  async findUpcoming() {
    return this.prisma.event.findMany({
      where: { isUpcoming: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(input: CreateEventInput) {
    return this.prisma.event.create({ data: input })
  }

  async update(id: string, input: UpdateEventInput) {
    return this.prisma.event.update({ where: { id }, data: input })
  }

  async delete(id: string) {
    return this.prisma.event.delete({ where: { id } })
  }
}
