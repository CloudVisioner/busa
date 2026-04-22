import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { TeamService } from './team.service'
import { TeamMemberObject } from './team-member.object'
import { CreateTeamMemberInput } from './create-team-member.input'
import { UpdateTeamMemberInput } from './update-team-member.input'
import { GqlAuthGuard } from '../auth/gql-auth.guard'

@Resolver(() => TeamMemberObject)
export class TeamResolver {
  constructor(private teamService: TeamService) {}

  @Query(() => [TeamMemberObject])
  teamMembers() {
    return this.teamService.findAll()
  }

  @Query(() => TeamMemberObject, { nullable: true })
  teamMember(@Args('id') id: string) {
    return this.teamService.findById(id)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TeamMemberObject)
  createTeamMember(@Args('input') input: CreateTeamMemberInput) {
    return this.teamService.create(input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TeamMemberObject)
  updateTeamMember(@Args('id') id: string, @Args('input') input: UpdateTeamMemberInput) {
    return this.teamService.update(id, input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TeamMemberObject)
  deleteTeamMember(@Args('id') id: string) {
    return this.teamService.delete(id)
  }
}
