import { Test, TestingModule } from '@nestjs/testing';
import { LessonsServiceController } from './lessons-service.controller';
import { LessonsServiceService } from './lessons-service.service';

describe('LessonsServiceController', () => {
  let lessonsServiceController: LessonsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LessonsServiceController],
      providers: [LessonsServiceService],
    }).compile();

    lessonsServiceController = app.get<LessonsServiceController>(LessonsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(lessonsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
