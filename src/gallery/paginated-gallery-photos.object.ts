import { Field, Int, ObjectType } from '@nestjs/graphql'
import { GalleryPhotoObject } from './gallery-photo.object'

@ObjectType()
export class PaginatedGalleryPhotos {
  @Field(() => [GalleryPhotoObject]) items: GalleryPhotoObject[]
  @Field(() => Int) total: number
  @Field(() => Int) page: number
  @Field(() => Int) limit: number
}
