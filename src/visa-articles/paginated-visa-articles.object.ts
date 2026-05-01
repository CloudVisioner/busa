import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VisaArticleObject } from './visa-article.object';

@ObjectType()
export class PaginatedVisaArticles {
  @Field(() => [VisaArticleObject]) items: VisaArticleObject[];
  @Field(() => Int) total: number;
  @Field() hasMore: boolean;
  @Field(() => Int) page: number;
  @Field(() => Int) limit: number;
}
