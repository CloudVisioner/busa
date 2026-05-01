import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PrismaEventType } from '../common/enums';

@ObjectType()
export class EventObject {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  date: string;

  @Field(() => Boolean)
  isFeatured: boolean;

  @Field()
  location: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  coverPhoto?: string;

  @Field(() => PrismaEventType)
  type: PrismaEventType;

  @Field(() => [String])
  photos: string[];

  @Field({ nullable: true })
  attendance?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
