import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { PrismaEventType } from '../common/enums'

@InputType()
export class UpdateEventInput {
  @Field({ nullable: true })
  @IsOptional()
  title?: string

  @Field({ nullable: true })
  @IsOptional()
  slug?: string

  @Field({ nullable: true })
  @IsOptional()
  date?: string

  @Field({ nullable: true })
  @IsOptional()
  location?: string

  @Field({ nullable: true })
  @IsOptional()
  description?: string

  @Field({ nullable: true })
  @IsOptional()
  coverPhoto?: string

  @Field(() => PrismaEventType, { nullable: true })
  @IsOptional()
  type?: PrismaEventType

  @Field({ nullable: true })
  @IsOptional()
  isUpcoming?: boolean

  @Field(() => [String], { nullable: true })
  @IsOptional()
  photos?: string[]
}
