import { Field, Int, ObjectType } from '@nestjs/graphql'
import { TeamMemberObject } from './team-member.object'

@ObjectType()
export class PaginatedTeamMembers {
  @Field(() => [TeamMemberObject]) items: TeamMemberObject[]
  @Field(() => Int) total: number
  @Field(() => Int) page: number
  @Field(() => Int) limit: number
}
