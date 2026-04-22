import { Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class UpdateTimelineEntryInput {
  @Field({ nullable: true }) @IsOptional() year?: string
  @Field({ nullable: true }) @IsOptional() title?: string
  @Field({ nullable: true }) @IsOptional() description?: string
  @Field({ nullable: true }) @IsOptional() presidentName?: string
  @Field({ nullable: true }) @IsOptional() presidentPhoto?: string
  @Field(() => [String], { nullable: true }) @IsOptional() achievements?: string[]
  @Field({ nullable: true }) @IsOptional() isDark?: boolean
  @Field(() => Int, { nullable: true }) @IsOptional() order?: number
}
