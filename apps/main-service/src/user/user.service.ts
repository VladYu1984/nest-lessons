import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';
import { CreateUserParams } from './types';
// import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly profileService: ProfileService,
  ) {}

  async createUser(params: CreateUserParams): Promise<User> {
    const { email, name, password, role } = params;

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password,
        role,
      },
    });

    // await this.profileService.createProfileForUser(user.id);

    return user;
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.delete({ where: { id } });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
