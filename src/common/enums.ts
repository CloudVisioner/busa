import { registerEnumType } from '@nestjs/graphql'
import {
  EventType as PrismaEventType,
  VisaType as PrismaVisaType,
  Role as PrismaRole,
} from '@prisma/client'

registerEnumType(PrismaEventType, { name: 'EventTypeEnum' })
registerEnumType(PrismaVisaType, { name: 'VisaTypeEnum' })
registerEnumType(PrismaRole, { name: 'RoleEnum' })

export { PrismaEventType, PrismaVisaType, PrismaRole }
