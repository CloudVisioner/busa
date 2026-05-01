import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  UPCOMING = 'UPCOMING',
}

registerEnumType(ProjectStatus, { name: 'ProjectStatus' });

@ObjectType()
export class Project {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  coverPhoto?: string;

  @Field(() => [String])
  photos: string[];

  @Field({ nullable: true })
  icon?: string;

  @Field(() => ProjectStatus)
  status: ProjectStatus;

  @Field({ nullable: true })
  startDate?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field(() => [String])
  members: string[];

  @Field()
  isFeatured: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
