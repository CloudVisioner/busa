import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'

@InputType()
export class CreateTeamMemberInput {
  @Field() @IsNotEmpty() name: string
  @Field() @IsNotEmpty() role: string
  @Field({ nullable: true }) @IsOptional() photo?: string
  @Field(() => Int) @IsNotEmpty() year: number
  @Field({ nullable: true }) @IsOptional() nimaqildi?: string
  @Field({ nullable: true }) @IsOptional() quote?: string
  @Field(() => Int, { defaultValue: 0 }) @IsOptional() order: number
}
