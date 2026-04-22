import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTimelineEntryInput } from './create-timeline-entry.input'
import { UpdateTimelineEntryInput } from './update-timeline-entry.input'

@Injectable()
export class TimelineService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.timelineEntry.findMany({ orderBy: { order: 'asc' } })
  }

  async create(input: CreateTimelineEntryInput) {
    return this.prisma.timelineEntry.create({ data: input })
  }

  async update(id: string, input: UpdateTimelineEntryInput) {
    return this.prisma.timelineEntry.update({ where: { id }, data: input })
  }

  async delete(id: string) {
    return this.prisma.timelineEntry.delete({ where: { id } })
  }
}
