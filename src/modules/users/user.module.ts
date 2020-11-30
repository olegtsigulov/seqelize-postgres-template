import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
// import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
// import { AuthMiddleware } from '../../shared/index';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})

export class UserModule {
  /** Middlewares */
  // public configure(consumer: MiddlewareConsumer) {
  //   consumer
  //       .apply(AuthMiddleware)
  //       .forRoutes(
  //           { path: '/users', method: RequestMethod.GET },
  //           { path: '/users/:id', method: RequestMethod.GET },
  //           { path: '/users/:id', method: RequestMethod.PUT },
  //           { path: '/users/:id', method: RequestMethod.DELETE }
  //       );
  // }
}
