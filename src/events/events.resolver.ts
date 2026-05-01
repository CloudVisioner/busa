import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventObject } from './event.object';
import { PaginatedEvents } from './paginated-events.object';
import { CreateEventInput } from './create-event.input';
import { UpdateEventInput } from './update-event.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PaginationInput } from '../common/pagination.input';

@Resolver(() => EventObject)
export class EventsResolver {
  constructor(private eventsService: EventsService) {}

  @Query(() => PaginatedEvents)
  events(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 9 }) limit: number,
  ) {
    return this.eventsService.findAll(page, limit);
  }

  @Query(() => PaginatedEvents)
  paginatedEvents(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return this.eventsService.findPaginated(pagination);
  }

  @Query(() => EventObject, { nullable: true })
  event(
    @Args('id', { nullable: true }) id?: string,
    @Args('slug', { nullable: true }) slug?: string,
  ) {
    return this.eventsService.findOne({ id, slug });
  }

  @Query(() => EventObject, { nullable: true })
  featuredEvent() {
    return this.eventsService.findFeatured();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EventObject)
  createEvent(@Args('input') input: CreateEventInput) {
    return this.eventsService.create(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EventObject)
  updateEvent(@Args('id') id: string, @Args('input') input: UpdateEventInput) {
    return this.eventsService.update(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EventObject)
  async setFeaturedEvent(@Args('id') id: string) {
    await this.eventsService.setFeaturedEvent(id);
    return this.eventsService.findOne({ id });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EventObject)
  deleteEvent(@Args('id') id: string) {
    return this.eventsService.delete(id);
  }
}
