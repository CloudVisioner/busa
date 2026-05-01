import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Project } from './entities/project.entity';

@ObjectType()
export class PaginatedProjects {
  @Field(() => [Project]) items: Project[];
  @Field(() => Int) total: number;
  @Field() hasMore: boolean;
}
