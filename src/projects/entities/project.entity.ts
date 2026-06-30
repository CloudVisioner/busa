import { Field, ObjectType } from '@nestjs/graphql';

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

  @Field()
  isFeatured: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
