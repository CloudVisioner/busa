import { registerEnumType } from '@nestjs/graphql';
import {
  EventType as PrismaEventType,
  VisaType as PrismaVisaType,
  Role as PrismaRole,
} from '@prisma/client';

export enum EventTimelineStatus {
  UPCOMING = 'UPCOMING',
  PAST = 'PAST',
}

registerEnumType(PrismaEventType, { name: 'EventTypeEnum' });
registerEnumType(PrismaVisaType, { name: 'VisaTypeEnum' });
registerEnumType(PrismaRole, { name: 'RoleEnum' });
registerEnumType(EventTimelineStatus, { name: 'EventTimelineStatusEnum' });

export { PrismaEventType, PrismaVisaType, PrismaRole };
