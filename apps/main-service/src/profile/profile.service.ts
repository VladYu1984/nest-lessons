import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Profile } from '@prisma/client';
import { UpdateProfileData } from './types';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfileForUser(userId: string): Promise<Profile> {
    return await this.prisma.profile.create({
      data: {
        userId,
        about: null,
        avatarUrl: null,
      },
    });
  }

  async updateProfile(
    userId: string,
    data: Partial<UpdateProfileData>,
  ): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }

  async updateAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ avatarUrl: string }> {
    if (!file) {
      throw new Error('File not provided');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.avatarUrl) {
      try {
        const filename = profile.avatarUrl.split('/').pop();
        if (filename) {
          const filePath = join(process.cwd(), 'uploads', 'avatars', filename);
          await fs.unlink(filePath);
        }
      } catch (err) {
        console.warn('Failed to delete old avatar:', err);
      }
    }

    const avatarUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/avatars/${file.filename}`;

    await this.prisma.profile.update({
      where: { userId },
      data: { avatarUrl },
    });

    return { avatarUrl };
  }
}
