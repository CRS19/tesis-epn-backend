import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [AppModule],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('root module', () => {
    it('when app is initialized, then should exist a root module', () => {
      expect(app).toBeDefined();
      expect(app.get(AppService)).toBeInstanceOf(AppService);
      expect(app.get(AppController)).toBeInstanceOf(AppController);
    });
  });
});
