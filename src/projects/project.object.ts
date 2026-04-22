import { Field, ID, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'

@ObjectType()
export class ProjectObject {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  summary: string

  @Field()
  description: string

  @Field()
  coverPhoto: string

  @Field()
  category: string

  @Field(() => [String])
  tags: string[]

  @Field()
  isFeatured: boolean

  @Field({ nullable: true })
  heroImage?: string

  @Field({ nullable: true })
  heroEyebrow?: string

  @Field({ nullable: true })
  heroDisplayTitle?: string

  @Field({ nullable: true })
  heroSubtitle?: string

  @Field({ nullable: true })
  aboutTitle?: string

  @Field(() => [String], { nullable: true })
  aboutParagraphs?: string[]

  @Field(() => GraphQLJSON, { nullable: true })
  features?: any

  @Field({ nullable: true })
  processTitle?: string

  @Field(() => GraphQLJSON, { nullable: true })
  processSteps?: any

  @Field({ nullable: true })
  galleryTitle?: string

  @Field({ nullable: true })
  gallerySubtitle?: string

  @Field(() => GraphQLJSON, { nullable: true })
  galleryImages?: any

  @Field({ nullable: true })
  ctaTitle?: string

  @Field({ nullable: true })
  ctaSubtitle?: string

  @Field({ nullable: true })
  ctaPrimaryLabel?: string

  @Field({ nullable: true })
  ctaSecondaryLabel?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
