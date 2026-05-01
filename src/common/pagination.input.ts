import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { EventTimelineStatus } from './enums';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 12 })
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 12;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  offset: number = 0;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field(() => EventTimelineStatus, { nullable: true })
  @IsOptional()
  status?: EventTimelineStatus;
}
