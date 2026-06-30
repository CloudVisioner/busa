import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { LoginInput } from './dto/login.input'
import { AuthResponse } from './dto/auth.response'
import { SignupInput } from './dto/signup.input'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input.email, input.password)
  }

  @Mutation(() => AuthResponse)
  signup(@Args('input') input: SignupInput) {
    return this.authService.signup(input.email, input.password)
  }
}
