import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { PrismaVisaType } from '../common/enums'

@ObjectType()
export class VisaArticleObject {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  content: string

  @Field(() => PrismaVisaType)
  visaType: PrismaVisaType

  @Field(() => Int)
  readTime: number

  @Field()
  description: string

  @Field()
  isOutdated: boolean

  @Field({ nullable: true })
  outdatedLink?: string

  @Field({ nullable: true })
  featureImage?: string

  @Field()
  author: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
