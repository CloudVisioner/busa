import { Module } from '@nestjs/common'
import { GalleryResolver } from './gallery.resolver'
import { GalleryService } from './gallery.service'

@Module({
  providers: [GalleryResolver, GalleryService],
})
export class GalleryModule {}
