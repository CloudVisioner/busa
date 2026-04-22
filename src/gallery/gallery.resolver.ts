import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GalleryService } from './gallery.service'
import { GalleryPhotoObject } from './gallery-photo.object'
import { CreateGalleryPhotoInput } from './create-gallery-photo.input'
import { GqlAuthGuard } from '../auth/gql-auth.guard'

@Resolver(() => GalleryPhotoObject)
export class GalleryResolver {
  constructor(private galleryService: GalleryService) {}

  @Query(() => [GalleryPhotoObject])
  galleryPhotos() {
    return this.galleryService.findAll()
  }

  @Query(() => [GalleryPhotoObject])
  galleryPhotosByYear(@Args('year', { type: () => Int }) year: number) {
    return this.galleryService.findByYear(year)
  }

  @Query(() => [GalleryPhotoObject])
  galleryPhotosByEvent(@Args('event') event: string) {
    return this.galleryService.findByEvent(event)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => GalleryPhotoObject)
  createGalleryPhoto(@Args('input') input: CreateGalleryPhotoInput) {
    return this.galleryService.create(input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => GalleryPhotoObject)
  deleteGalleryPhoto(@Args('id') id: string) {
    return this.galleryService.delete(id)
  }
}
