import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { TimelineService } from './timeline.service'
import { TimelineEntryObject } from './timeline-entry.object'
import { CreateTimelineEntryInput } from './create-timeline-entry.input'
import { UpdateTimelineEntryInput } from './update-timeline-entry.input'
import { GqlAuthGuard } from '../auth/gql-auth.guard'

@Resolver(() => TimelineEntryObject)
export class TimelineResolver {
  constructor(private timelineService: TimelineService) {}

  @Query(() => [TimelineEntryObject])
  timeline() {
    return this.timelineService.findAll()
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TimelineEntryObject)
  createTimelineEntry(@Args('input') input: CreateTimelineEntryInput) {
    return this.timelineService.create(input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TimelineEntryObject)
  updateTimelineEntry(@Args('id') id: string, @Args('input') input: UpdateTimelineEntryInput) {
    return this.timelineService.update(id, input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TimelineEntryObject)
  deleteTimelineEntry(@Args('id') id: string) {
    return this.timelineService.delete(id)
  }
}
