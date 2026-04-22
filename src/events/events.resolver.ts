import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { EventsService } from './events.service'
import { EventObject } from './event.object'
import { CreateEventInput } from './create-event.input'
import { UpdateEventInput } from './update-event.input'
import { GqlAuthGuard } from '../auth/gql-auth.guard'

@Resolver(() => EventObject)
export class EventsResolver {
  constructor(private eventsService: EventsService) {}

  @Query(() => [EventObject])
  events(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 9 }) limit: number,
  ) {
    return this.eventsService.findAll(page, limit)
  }

  @Query(() => EventObject, { nullable: true })
  event(@Args('slug') slug: string) {
    return this.eventsService.findBySlug(slug)
  }

  @Query(() => [EventObject])
  upcomingEvents() {
    return this.eventsService.findUpcoming()
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EventObject)
  createEvent(@Args('input') input: CreateEventInput) {
    return this.eventsService.create(input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EventObject)
  updateEvent(
    @Args('id') id: string,
    @Args('input') input: UpdateEventInput,
  ) {
    return this.eventsService.update(id, input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EventObject)
  deleteEvent(@Args('id') id: string) {
    return this.eventsService.delete(id)
  }
}
