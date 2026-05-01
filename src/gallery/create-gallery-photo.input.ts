import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateGalleryPhotoInput {
  @Field() @IsNotEmpty() src: string;
  @Field() @IsNotEmpty() alt: string;
  @Field() @IsNotEmpty() event: string;
  @Field(() => Int) @IsNotEmpty() year: number;
  @Field() @IsNotEmpty() eventName: string;
}
