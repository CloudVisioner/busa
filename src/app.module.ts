import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
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
import { AppResolver } from './app.resolver'
import './common/enums'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  providers: [AppResolver],
})
export class AppModule {}
