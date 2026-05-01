import { Field, ObjectType } from '@nestjs/graphql';
import { PrismaRole } from '../../common/enums';

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field()
  email: string;

  @Field(() => PrismaRole)
  role: PrismaRole;
}
