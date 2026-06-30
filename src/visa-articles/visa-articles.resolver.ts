import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { VisaArticlesService } from './visa-articles.service';
import { VisaArticleObject } from './visa-article.object';
import { PaginatedVisaArticles } from './paginated-visa-articles.object';
import { CreateVisaArticleInput } from './create-visa-article.input';
import { UpdateVisaArticleInput } from './update-visa-article.input';
import { PrismaVisaType } from '../common/enums';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PaginationInput } from '../common/pagination.input';

@Resolver(() => VisaArticleObject)
export class VisaArticlesResolver {
  constructor(private visaArticlesService: VisaArticlesService) {}

  @Query(() => PaginatedVisaArticles)
  visaArticles(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    return this.visaArticlesService.findAll(page, limit);
  }

  @Query(() => PaginatedVisaArticles)
  paginatedVisaArticles(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return this.visaArticlesService.findPaginated(pagination);
  }

  @Query(() => VisaArticleObject, { nullable: true })
  visaArticle(@Args('slug') slug: string) {
    return this.visaArticlesService.findBySlug(slug);
  }

  @Query(() => [VisaArticleObject])
  visaArticlesByType(
    @Args('visaType', { type: () => PrismaVisaType }) visaType: PrismaVisaType,
  ) {
    return this.visaArticlesService.findByType(visaType);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => VisaArticleObject)
  createVisaArticle(@Args('input') input: CreateVisaArticleInput) {
    return this.visaArticlesService.create(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => VisaArticleObject)
  updateVisaArticle(
    @Args('id') id: string,
    @Args('input') input: UpdateVisaArticleInput,
  ) {
    return this.visaArticlesService.update(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => VisaArticleObject)
  deleteVisaArticle(@Args('id') id: string) {
    return this.visaArticlesService.delete(id);
  }
}
