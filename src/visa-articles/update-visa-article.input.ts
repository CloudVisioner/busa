import { Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { PrismaVisaType } from '../common/enums'

@InputType()
export class UpdateVisaArticleInput {
  @Field({ nullable: true }) @IsOptional() title?: string
  @Field({ nullable: true }) @IsOptional() slug?: string
  @Field({ nullable: true }) @IsOptional() content?: string
  @Field(() => PrismaVisaType, { nullable: true }) @IsOptional() visaType?: PrismaVisaType
  @Field(() => Int, { nullable: true }) @IsOptional() readTime?: number
  @Field({ nullable: true }) @IsOptional() description?: string
  @Field({ nullable: true }) @IsOptional() isOutdated?: boolean
  @Field({ nullable: true }) @IsOptional() outdatedLink?: string
  @Field({ nullable: true }) @IsOptional() featureImage?: string
  @Field({ nullable: true }) @IsOptional() author?: string
}
