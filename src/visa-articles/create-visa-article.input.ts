import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PrismaVisaType } from '../common/enums';

@InputType()
export class CreateVisaArticleInput {
  @Field() @IsNotEmpty() title: string;
  @Field() @IsNotEmpty() slug: string;
  @Field() @IsNotEmpty() content: string;
  @Field(() => PrismaVisaType) @IsNotEmpty() visaType: PrismaVisaType;
  @Field(() => Int) @IsNotEmpty() readTime: number;
  @Field() @IsNotEmpty() description: string;
  @Field({ defaultValue: false }) @IsOptional() isOutdated: boolean;
  @Field({ nullable: true }) @IsOptional() outdatedLink?: string;
  @Field({ nullable: true }) @IsOptional() featureImage?: string;
  @Field({ defaultValue: 'Admin' }) @IsOptional() author: string;
}
