import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateGalleryPhotoInput } from './create-gallery-photo.input'

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.galleryPhoto.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async findByYear(year: number) {
    return this.prisma.galleryPhoto.findMany({
      where: { year },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findByEvent(event: string) {
    return this.prisma.galleryPhoto.findMany({
      where: { event },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(input: CreateGalleryPhotoInput) {
    return this.prisma.galleryPhoto.create({ data: input })
  }

  async delete(id: string) {
    return this.prisma.galleryPhoto.delete({ where: { id } })
  }
}
