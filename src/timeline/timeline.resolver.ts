import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { TimelineEntryObject } from './timeline-entry.object';
import { PaginatedTimeline } from './paginated-timeline.object';
import { CreateTimelineEntryInput } from './create-timeline-entry.input';
import { UpdateTimelineEntryInput } from './update-timeline-entry.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => TimelineEntryObject)
export class TimelineResolver {
  constructor(private timelineService: TimelineService) {}

  @Query(() => PaginatedTimeline)
  timelines(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    return this.timelineService.findAll(page, limit);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TimelineEntryObject)
  createTimeline(@Args('input') input: CreateTimelineEntryInput) {
    return this.timelineService.create(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TimelineEntryObject)
  updateTimeline(
    @Args('id') id: string,
    @Args('input') input: UpdateTimelineEntryInput,
  ) {
    return this.timelineService.update(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TimelineEntryObject)
  deleteTimeline(@Args('id') id: string) {
    return this.timelineService.delete(id);
  }
}
