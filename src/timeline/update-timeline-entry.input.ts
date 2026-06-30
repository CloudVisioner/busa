import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType('UpdateTimelineInput')
export class UpdateTimelineEntryInput {
  @Field({ nullable: true })
  @IsOptional()
  year?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

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
