import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/main-service-client';
import { CreateUserParams, UserProfile } from './types';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
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

    await this.profileService.createProfileForUser(user.id);

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

  async getUsersByIds(ids: string[]): Promise<UserProfile[]> {
    if (ids.length === 0) return [];

    const users = await this.prisma.user.findMany({
      where: { id: { in: ids.filter((id): id is string => !!id) } },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
      },
    });

    const foundIds = users.map((u) => u.id);
    const missing = ids.filter((id) => !foundIds.includes(id));
    if (missing.length) {
      throw new NotFoundException(`Users not found: ${missing.join(', ')}`);
    }

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      profile: u.profile ?? null,
    }));
  }

  async getUserWithProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        profile: {
          select: {
            about: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
