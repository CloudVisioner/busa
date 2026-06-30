import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { Errors } from '../common/errors'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw Errors.UNAUTHORIZED()

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw Errors.UNAUTHORIZED()

    const token = this.jwtService.sign({ sub: user.id, role: user.role })
    return { token, email: user.email, role: user.role }
  }

  async signup(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const existing = await this.prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) throw Errors.ALREADY_EXISTS('User', 'email')

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
      },
    })

    const token = this.jwtService.sign({ sub: user.id, role: user.role })
    return { token, email: user.email, role: user.role }
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } })
  }
}
