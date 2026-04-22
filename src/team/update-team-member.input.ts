import { Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class UpdateTeamMemberInput {
  @Field({ nullable: true }) @IsOptional() name?: string
  @Field({ nullable: true }) @IsOptional() role?: string
  @Field({ nullable: true }) @IsOptional() photo?: string
  @Field(() => Int, { nullable: true }) @IsOptional() year?: number
  @Field({ nullable: true }) @IsOptional() nimaqildi?: string
  @Field({ nullable: true }) @IsOptional() quote?: string
  @Field(() => Int, { nullable: true }) @IsOptional() order?: number
}
