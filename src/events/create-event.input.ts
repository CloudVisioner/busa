import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { PrismaEventType } from '../common/enums'

@InputType()
export class CreateEventInput {
  @Field()
  @IsNotEmpty()
  title: string

  @Field()
  @IsNotEmpty()
  slug: string

  @Field()
  @IsNotEmpty()
  date: string

  @Field()
  @IsNotEmpty()
  location: string

  @Field()
  @IsNotEmpty()
  description: string

  @Field()
  @IsNotEmpty()
  coverPhoto: string

  @Field(() => PrismaEventType)
  @IsNotEmpty()
  type: PrismaEventType

  @Field({ defaultValue: false })
  @IsOptional()
  isUpcoming: boolean

  @Field(() => [String], { defaultValue: [] })
  @IsOptional()
  photos: string[]
}
