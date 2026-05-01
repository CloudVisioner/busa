import { Module } from '@nestjs/common';
import { VisaArticlesResolver } from './visa-articles.resolver';
import { VisaArticlesService } from './visa-articles.service';

@Module({
  providers: [VisaArticlesResolver, VisaArticlesService],
})
export class VisaArticlesModule {}
