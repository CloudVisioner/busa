import { Field, Int, ObjectType } from '@nestjs/graphql'
import { TimelineEntryObject } from './timeline-entry.object'

@ObjectType()
export class PaginatedTimeline {
  @Field(() => [TimelineEntryObject]) items: TimelineEntryObject[]
  @Field(() => Int) total: number
  @Field(() => Int) page: number
  @Field(() => Int) limit: number
}
