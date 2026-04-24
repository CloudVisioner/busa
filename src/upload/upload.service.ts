import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Injectable()
export class UploadService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_KEY as string,
    )
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const timestamp = Date.now()
    const path = `${folder}/${timestamp}-${file.originalname}`

    const { error } = await this.supabase.storage
      .from('busa-media')
      .upload(path, file.buffer, { contentType: file.mimetype })

    if (error) throw new InternalServerErrorException(`Upload failed: ${error.message}`)

    const { data } = this.supabase.storage.from('busa-media').getPublicUrl(path)
    return data.publicUrl
  }

  async deleteFile(url: string): Promise<void> {
    const bucketBase = `${process.env.SUPABASE_URL}/storage/v1/object/public/busa-media/`
    const path = url.replace(bucketBase, '')

    const { error } = await this.supabase.storage.from('busa-media').remove([path])
    if (error) throw new InternalServerErrorException(`Delete failed: ${error.message}`)
  }
}
