import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

type StorageError = { message: string } | null;

interface BucketClient {
  upload(
    path: string,
    file: Buffer,
    options: { contentType: string },
  ): Promise<{ error: StorageError }>;
  getPublicUrl(path: string): { data: { publicUrl: string } };
  remove(paths: string[]): Promise<{ error: StorageError }>;
}

interface UploadSupabaseClient {
  storage: { from(bucket: string): BucketClient };
}

@Injectable()
export class UploadService {
  private readonly supabase: UploadSupabaseClient;
  private readonly bucket: string;

  constructor() {
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;
    this.bucket = process.env.SUPABASE_BUCKET ?? 'busa-media';
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      serviceKey as string,
    );
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '-');
    const path = `${folder}/${timestamp}-${safeName}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(path, file.buffer, { contentType: file.mimetype });

    if (error)
      throw new InternalServerErrorException(`Upload failed: ${error.message}`);

    const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async deleteFile(url: string): Promise<void> {
    const bucketBase = `${process.env.SUPABASE_URL}/storage/v1/object/public/${this.bucket}/`;
    const path = url.replace(bucketBase, '');

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([path]);
    if (error)
      throw new InternalServerErrorException(`Delete failed: ${error.message}`);
  }
}
