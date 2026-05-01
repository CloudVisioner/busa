import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { PrismaEventType } from '../common/enums';

@InputType()
export class CreateEventInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsDateString()
  date: string;

  @Field(() => PrismaEventType)
  @IsNotEmpty()
  type: PrismaEventType;

  @Field()
  @IsNotEmpty()
  location: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  coverPhoto?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  photos?: string[];

  @Field({ nullable: true })
  @IsOptional()
  attendance?: string;
}
