import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as PrismaUser } from '@prisma/main-service-client';
import { CreateUserDto } from './dto/create-user.dto';
import { JWTAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<PrismaUser> {
    return this.userService.createUser({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      role: dto.role,
    });
  }

  @UseGuards(JWTAuthGuard)
  @Get('me')
  async getMe(@User('id') userId: string) {
    return await this.userService.getUserWithProfile(userId);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
