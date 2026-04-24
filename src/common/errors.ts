import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common'

export const Errors = {
  NOT_FOUND: (resource: string) =>
    new NotFoundException(`${resource} not found`),
  ALREADY_EXISTS: (resource: string, field: string) =>
    new BadRequestException(`${resource} with this ${field} already exists`),
  UNAUTHORIZED: () =>
    new UnauthorizedException('Invalid credentials'),
  FORBIDDEN: () =>
    new ForbiddenException('You do not have permission'),
  INVALID_FILE: () =>
    new BadRequestException('Invalid file type. Only JPEG, PNG, WebP allowed'),
  FILE_TOO_LARGE: () =>
    new BadRequestException('File too large. Maximum 5MB allowed'),
}
