import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType('CreateTimelineInput')
export class CreateTimelineEntryInput {
  @Field()
  @IsNotEmpty()
  year: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  presidentName?: string;

  @Field({ nullable: true })
  @IsOptional()
  coverPhoto?: string;

  @Field({ nullable: true })
  @IsOptional()
  quote?: string;
}
