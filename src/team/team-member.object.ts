import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TeamMemberObject {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  photo?: string;

  @Field(() => Int)
  year: number;

  @Field(() => Int)
  order: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
