import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GalleryPhotoObject {
  @Field(() => ID)
  id: string;

  @Field()
  src: string;

  @Field()
  alt: string;

  @Field()
  event: string;

  @Field(() => Int)
  year: number;

  @Field()
  eventName: string;

  @Field()
  createdAt: Date;
}
