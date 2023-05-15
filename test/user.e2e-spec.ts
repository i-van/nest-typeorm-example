import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDriver } from 'mysql-emulator';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          driver: createDriver(),
          entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
          synchronize: true,
        }),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /users', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'first', role: 'user', active: true })
      .set('Accept', 'application/json');

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].id).toEqual(1);
    expect(response.body[0].name).toEqual('first');
    expect(response.body[0].role).toEqual('user');
    expect(response.body[0].active).toEqual(true);
  });
  it('POST /users', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'first', role: 'user', active: true })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(201);
    expect(response.body.id).toEqual(1);
    expect(response.body.name).toEqual('first');
    expect(response.body.role).toEqual('user');
    expect(response.body.active).toEqual(true);
  });
  it('PATCH /users/:id', async () => {
    const { body: createdUser } = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'first', role: 'user', active: false })
      .set('Accept', 'application/json');

    const response = await request(app.getHttpServer())
      .patch(`/users/${createdUser.id}`)
      .send({ name: 'updated', active: true })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.name).toEqual('updated');
    expect(response.body.role).toEqual('user');
    expect(response.body.active).toEqual(true);
  });
  it('DELETE /users/:id', async () => {
    const { body: createdUser } = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'first', role: 'user', active: false })
      .set('Accept', 'application/json');

    const response = await request(app.getHttpServer())
      .delete(`/users/${createdUser.id}`)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
  });
});
