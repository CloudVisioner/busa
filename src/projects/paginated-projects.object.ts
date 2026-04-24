import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ProjectObject } from './project.object'

@ObjectType()
export class PaginatedProjects {
  @Field(() => [ProjectObject]) items: ProjectObject[]
  @Field(() => Int) total: number
  @Field(() => Int) page: number
  @Field(() => Int) limit: number
}
