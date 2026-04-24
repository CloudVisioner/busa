import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { CacheModule } from '@nestjs/cache-manager'
import { join } from 'path'
import GraphQLJSON from 'graphql-type-json'
import { PrismaModule } from './prisma/prisma.module'
import { EventsModule } from './events/events.module'
import { ProjectsModule } from './projects/projects.module'
import { VisaArticlesModule } from './visa-articles/visa-articles.module'
import { GalleryModule } from './gallery/gallery.module'
import { TeamModule } from './team/team.module'
import { TimelineModule } from './timeline/timeline.module'
import { AuthModule } from './auth/auth.module'
import { UploadModule } from './upload/upload.module'
import { AppResolver } from './app.resolver'
import { envValidationSchema } from './config/env.validation'
import './common/enums'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidationSchema }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    CacheModule.register({ isGlobal: true, ttl: 5 * 60 * 1000, max: 100 }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      buildSchemaOptions: {
        scalarsMap: [{ type: () => GraphQLJSON, scalar: GraphQLJSON }],
      },
      context: ({ req }) => ({ req }),
    }),
    PrismaModule,
    EventsModule,
    ProjectsModule,
    VisaArticlesModule,
    GalleryModule,
    TeamModule,
    TimelineModule,
    AuthModule,
    UploadModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
