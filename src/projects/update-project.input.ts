import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import GraphQLJSON from 'graphql-type-json'

@InputType()
export class UpdateProjectInput {
  @Field({ nullable: true }) @IsOptional() title?: string
  @Field({ nullable: true }) @IsOptional() slug?: string
  @Field({ nullable: true }) @IsOptional() summary?: string
  @Field({ nullable: true }) @IsOptional() description?: string
  @Field({ nullable: true }) @IsOptional() coverPhoto?: string
  @Field({ nullable: true }) @IsOptional() category?: string
  @Field(() => [String], { nullable: true }) @IsOptional() tags?: string[]
  @Field({ nullable: true }) @IsOptional() isFeatured?: boolean
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
