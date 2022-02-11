import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import Joi from 'joi';

/* TODO: 
    1. Add PostgreSQL and TypeORM
    2. Setup domain and model entities
    3. Setup basic crud
    4. Add error handling and validation

  
    5. Add authentication with JWT passport
    6. Add role based authorization
    7. Dataloader for N+1 queries
    8. Add caching? 
    9. DB migrations and seeding -- generate mockdata somewhere
*/
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
