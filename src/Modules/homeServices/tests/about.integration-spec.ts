// Finish this

import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutModule } from '../homeServices.module';
import { AboutEntity } from '../Domain/Entities/homeServices.entity';
import * as request from 'supertest';
// import { AppModule } from '../../src/app.module'; // optional if you want full module

// Integration test for AboutModule using in-memory MySQL database
describe('About integration (MySQL in-memory)', () => {

  // Nest application instance
  let app: INestApplication;

  // Setup the testing module and initialize the Nest application before all tests
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          database: ':memory:',
          dropSchema: true,
          entities: [AboutEntity],
          synchronize: true,
          logging: false,
        }),
        AboutModule, // import only the module under test
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  // Close the Nest application after all tests
  afterAll(async () => {

    if (app) await app.close();
  });

  // Test case: GET /about should return 200 OK
  it('GET /about returns 200', async () => {

    // Use supertest to make a GET request to /about and expect a 200 status code
    return request(app.getHttpServer()).get('/about').expect(200);
  });

  // Test case: POST /about should create a new about section
  it('POST /about creates a new about section', async () => {

    // New about section data to be sent in the request body
    const newSection = {
      section: 'Test Section',
      contentText: 'Test content for the about section.',
    };

    // Use supertest to make a POST request to /about and expect a 201 status code
    return request(app.getHttpServer())
      .post('/about')
      .send(newSection)
      .expect(201)
      // Validate the response body
      .then((response) => {
        // Check that the response body contains the expected properties, like aboutId, section, and contentText
        expect(response.body).toHaveProperty('aboutId');
        expect(response.body.section).toBe(newSection.section);
        expect(response.body.contentText).toBe(newSection.contentText);
      });
  });

  // put, put position and delete tests now
});