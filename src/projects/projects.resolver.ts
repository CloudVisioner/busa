import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectObject } from './project.object'
import { PaginatedProjects } from './paginated-projects.object'
import { CreateProjectInput } from './create-project.input'
import { UpdateProjectInput } from './update-project.input'
import { GqlAuthGuard } from '../auth/gql-auth.guard'

@Resolver(() => ProjectObject)
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => PaginatedProjects)
  projects(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    return this.projectsService.findAll(page, limit)
  }

  @Query(() => [ProjectObject])
  featuredProjects() {
    return this.projectsService.findFeatured()
  }

  @Query(() => ProjectObject, { nullable: true })
  project(@Args('slug') slug: string) {
    return this.projectsService.findBySlug(slug)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProjectObject)
  createProject(@Args('input') input: CreateProjectInput) {
    return this.projectsService.create(input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProjectObject)
  updateProject(@Args('id') id: string, @Args('input') input: UpdateProjectInput) {
    return this.projectsService.update(id, input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProjectObject)
  deleteProject(@Args('id') id: string) {
    return this.projectsService.delete(id)
  }
}
