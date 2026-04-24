import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTeamMemberInput } from './create-team-member.input'
import { UpdateTeamMemberInput } from './update-team-member.input'
import { Errors } from '../common/errors'

const CACHE_KEY = 'team_members'
const CACHE_TTL = 60 * 60 * 1000

@Injectable()
export class TeamService {
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
    const members = await this.prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
    await this.cache.set(CACHE_KEY, members, CACHE_TTL)
    return members
  }

  async findById(id: string) {
    const member = await this.prisma.teamMember.findUnique({ where: { id } })
    if (!member) throw Errors.NOT_FOUND('Team member')
    return member
  }

  async create(input: CreateTeamMemberInput) {
    const result = await this.prisma.teamMember.create({ data: input })
    await this.cache.del(CACHE_KEY)
    return result
  }

  async update(id: string, input: UpdateTeamMemberInput) {
    const existing = await this.prisma.teamMember.findUnique({ where: { id } })
    if (!existing) throw Errors.NOT_FOUND('Team member')
    const result = await this.prisma.teamMember.update({ where: { id }, data: input })
    await this.cache.del(CACHE_KEY)
    return result
  }

  async delete(id: string) {
    const existing = await this.prisma.teamMember.findUnique({ where: { id } })
    if (!existing) throw Errors.NOT_FOUND('Team member')
    const result = await this.prisma.teamMember.delete({ where: { id } })
    await this.cache.del(CACHE_KEY)
    return result
  }
}
