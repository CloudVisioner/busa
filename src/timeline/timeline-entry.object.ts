import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TimelineEntryObject {
  @Field(() => ID)
  id: string;

  @Field()
  year: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  presidentName?: string;

  @Field(() => [String])
  achievements: string[];

  @Field({ nullable: true })
  coverPhoto?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
