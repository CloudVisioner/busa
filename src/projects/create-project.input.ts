import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'
import GraphQLJSON from 'graphql-type-json'

@InputType()
export class CreateProjectInput {
  @Field() @IsNotEmpty() title: string
  @Field() @IsNotEmpty() slug: string
  @Field() @IsNotEmpty() summary: string
  @Field() @IsNotEmpty() description: string
  @Field() @IsNotEmpty() coverPhoto: string
  @Field() @IsNotEmpty() category: string
  @Field(() => [String]) tags: string[]
  @Field({ defaultValue: false }) @IsOptional() isFeatured: boolean
  @Field({ nullable: true }) @IsOptional() heroImage?: string
  @Field({ nullable: true }) @IsOptional() heroEyebrow?: string
  @Field({ nullable: true }) @IsOptional() heroDisplayTitle?: string
  @Field({ nullable: true }) @IsOptional() heroSubtitle?: string
  @Field({ nullable: true }) @IsOptional() aboutTitle?: string
  @Field(() => [String], { nullable: true }) @IsOptional() aboutParagraphs?: string[]
  @Field(() => GraphQLJSON, { nullable: true }) @IsOptional() features?: any
  @Field({ nullable: true }) @IsOptional() processTitle?: string
  @Field(() => GraphQLJSON, { nullable: true }) @IsOptional() processSteps?: any
  @Field({ nullable: true }) @IsOptional() galleryTitle?: string
  @Field({ nullable: true }) @IsOptional() gallerySubtitle?: string
  @Field(() => GraphQLJSON, { nullable: true }) @IsOptional() galleryImages?: any
  @Field({ nullable: true }) @IsOptional() ctaTitle?: string
  @Field({ nullable: true }) @IsOptional() ctaSubtitle?: string
  @Field({ nullable: true }) @IsOptional() ctaPrimaryLabel?: string
  @Field({ nullable: true }) @IsOptional() ctaSecondaryLabel?: string
}
