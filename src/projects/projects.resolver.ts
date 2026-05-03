import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { PaginatedProjects } from './paginated-projects.object';
import { CreateProjectInput } from './create-project.input';
import { UpdateProjectInput } from './update-project.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PaginationInput } from '../common/pagination.input';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Project)
  createProject(@Args('input') input: CreateProjectInput) {
    console.log('CreateProject input:', JSON.stringify(input, null, 2));
    return this.projectsService.create(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Project)
  updateProject(@Args('input') input: UpdateProjectInput) {
    return this.projectsService.update(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Project)
  removeProject(@Args('id') id: string) {
    return this.projectsService.remove(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Project)
  setFeaturedProject(@Args('id') id: string) {
    return this.projectsService.setFeatured(id);
  }

  @Query(() => [Project])
  projects() {
    return this.projectsService.findAll();
  }

  @Query(() => Project, { nullable: true })
  project(@Args('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Query(() => Project, { nullable: true })
  projectBySlug(@Args('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Query(() => Project, { nullable: true })
  featuredProject() {
    return this.projectsService.findFeatured();
  }

  @Query(() => PaginatedProjects)
  paginatedProjects(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return this.projectsService.paginated(pagination);
  }
}
