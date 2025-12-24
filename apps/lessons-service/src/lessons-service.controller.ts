import { Controller, Get } from '@nestjs/common';
import { LessonsServiceService } from './lessons-service.service';

@Controller()
export class LessonsServiceController {
  constructor(private readonly lessonsServiceService: LessonsServiceService) {}

  @Get()
  getHello(): string {
    return this.lessonsServiceService.getHello();
  }
}
