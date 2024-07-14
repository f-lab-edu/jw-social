import { faker } from '@faker-js/faker';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const userService = app.get(UsersService);

  await dataSource.transaction(async (transactionalEntityManager) => {
    await transactionalEntityManager.query('TRUNCATE TABLE "post" CASCADE');
    await transactionalEntityManager.query('TRUNCATE TABLE "user" CASCADE');
  });

  const batchSize = 1000;
  const totalUsers = 1000000;
  const totalBatches = Math.ceil(totalUsers / batchSize);
  const emails = new Set<string>();

  for (let batch = 0; batch < totalBatches; batch++) {
    const users = [];
    while (users.length < batchSize) {
      const email = faker.internet.email();
      if (!emails.has(email)) {
        emails.add(email);
        users.push({
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: email,
          avatar: faker.image.avatar(),
        });
      }
    }
    await userService.createMany(users);
    console.log(`Batch ${batch + 1}/${totalBatches} inserted`);
  }

  await app.close();
}

bootstrap();
