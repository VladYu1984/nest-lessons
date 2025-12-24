import {
  Body,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../common/decorators/user.decorator';
import { JWTAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { extname } from 'path';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch()
  @UseGuards(JWTAuthGuard)
  async updateProfile(
    @User('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(userId, dto);
  }

  @Patch('avatar')
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (_req, file, callback) => {
          const uniqueName = Date.now() + '_' + Math.round(Math.random() * 1e9);
          callback(null, uniqueName + extname(file.originalname));
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/image\/(jpg|jpeg|png)/i)) {
          return callback(new MulterError('LIMIT_UNEXPECTED_FILE'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10Mb
      },
    }),
  )
  async updateAvatar(
    @User('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.profileService.updateAvatar(userId, file);
  }
}
