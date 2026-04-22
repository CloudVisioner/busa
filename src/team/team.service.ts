import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTeamMemberInput } from './create-team-member.input'
import { UpdateTeamMemberInput } from './update-team-member.input'

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
  }

  async findById(id: string) {
    return this.prisma.teamMember.findUnique({ where: { id } })
  }

  async create(input: CreateTeamMemberInput) {
    return this.prisma.teamMember.create({ data: input })
  }

  async update(id: string, input: UpdateTeamMemberInput) {
    return this.prisma.teamMember.update({ where: { id }, data: input })
  }

  async delete(id: string) {
    return this.prisma.teamMember.delete({ where: { id } })
  }
}
