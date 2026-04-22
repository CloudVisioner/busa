import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PrismaEventType } from '../common/enums'

@ObjectType()
export class EventObject {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  date: string

  @Field()
  location: string

  @Field()
  description: string

  @Field()
  coverPhoto: string

  @Field(() => PrismaEventType)
  type: PrismaEventType

  @Field()
  isUpcoming: boolean

  @Field(() => [String])
  photos: string[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
