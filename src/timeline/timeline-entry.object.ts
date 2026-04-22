import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TimelineEntryObject {
  @Field(() => ID)
  id: string

  @Field()
  year: string

  @Field()
  title: string

  @Field()
  description: string

  @Field()
  presidentName: string

  @Field({ nullable: true })
  presidentPhoto?: string

  @Field(() => [String])
  achievements: string[]

  @Field()
  isDark: boolean

  @Field(() => Int)
  order: number

  @Field()
  createdAt: Date
}
