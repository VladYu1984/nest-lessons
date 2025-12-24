import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/main-service-client';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      role: dto.role,
    });
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
