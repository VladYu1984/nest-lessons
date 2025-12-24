import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonsServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
