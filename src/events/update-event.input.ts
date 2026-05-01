import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsOptional } from 'class-validator';
import { PrismaEventType } from '../common/enums';

@InputType()
export class UpdateEventInput {
  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  date?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isFeatured?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => PrismaEventType, { nullable: true })
  @IsOptional()
  type?: PrismaEventType;

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
