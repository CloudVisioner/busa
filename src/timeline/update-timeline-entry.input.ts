import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsOptional } from 'class-validator';

@InputType('UpdateTimelineInput')
export class UpdateTimelineEntryInput {
  @Field({ nullable: true })
  @IsOptional()
  year?: string;

  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  presidentName?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  achievements?: string[];

  @Field({ nullable: true })
  @IsOptional()
  coverPhoto?: string;
}
