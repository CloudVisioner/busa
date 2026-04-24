import { Field, Int, ObjectType } from '@nestjs/graphql'
import { EventObject } from './event.object'

@ObjectType()
export class PaginatedEvents {
  @Field(() => [EventObject]) items: EventObject[]
  @Field(() => Int) total: number
  @Field(() => Int) page: number
  @Field(() => Int) limit: number
}
