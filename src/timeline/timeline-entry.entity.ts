import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TimelineEntryObject {
  @Field(() => ID)
  id: string;

  @Field()
  year: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  presidentName?: string;

  @Field({ nullable: true })
  coverPhoto?: string;

  @Field({ nullable: true })
  quote?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
