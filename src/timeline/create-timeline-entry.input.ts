import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'

@InputType()
export class CreateTimelineEntryInput {
  @Field() @IsNotEmpty() year: string
  @Field() @IsNotEmpty() title: string
  @Field() @IsNotEmpty() description: string
  @Field() @IsNotEmpty() presidentName: string
  @Field({ nullable: true }) @IsOptional() presidentPhoto?: string
  @Field(() => [String]) achievements: string[]
  @Field({ defaultValue: false }) @IsOptional() isDark: boolean
  @Field(() => Int, { defaultValue: 0 }) @IsOptional() order: number
}
