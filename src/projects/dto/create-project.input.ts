import { Field, InputType } from '@nestjs/graphql';
import { ProjectStatus } from '../entities/project.entity';

@InputType()
export class CreateProjectInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  coverPhoto?: string;

  @Field(() => [String], { nullable: true })
  photos?: string[];

  @Field({ nullable: true })
  icon?: string;

  @Field(() => ProjectStatus, { nullable: true })
  status?: ProjectStatus;

  @Field({ nullable: true })
  startDate?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field(() => [String], { nullable: true })
  members?: string[];
}
