import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

@InputType('CreateTimelineInput')
export class CreateTimelineEntryInput {
  @Field()
  @IsNotEmpty()
  year: string;

  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  description: string;

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
