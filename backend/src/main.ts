import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidatorOptions, ValidationError } from 'class-validator';
import BackendException from './utils/BackendException.filter'
import { UserService } from './user/user.service';
import { usersTest } from "./user/test";
import {PrismaService} from "./prisma/prisma.service"
var passport = require('passport');

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  forbidUnknownValues?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}

async function createTestUsers() {
	const prisma = new PrismaService();
	const userService: UserService = new UserService(prisma);

	usersTest.forEach(async (user) => {
		let newUser = await userService.user({username: user.username});
		if (!newUser) {
			newUser = await userService.createUser(user);
			userService.generateTwoFactorAuthenticationSecret(newUser);
		}
	})
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.use(passport.initialize());
  app.useGlobalFilters(new BackendException())
  app.enableCors({
	credentials: true,
	origin: ['http://localhost:3001', 'http://127.0.0.1:3001']
  });
  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await createTestUsers();
  await app.listen(3000);
}
bootstrap();
