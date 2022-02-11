import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { NftModule } from './nft/nft.module';
import Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path/posix';

/* TODO: 
    1. Add PostgreSQL and TypeORM // done
    2. Setup domain and model entities
    3. Setup basic crud
    4. Add error handling and validation

  
    5. Add authentication with JWT passport
    6. Add role based authorization
    7. Dataloader for N+1 queries
    8. Add caching? 
    9. DB migrations and seeding -- generate mockdata somewhere
    10. add unit tests 
*/
@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: Boolean('GRAPHQL__PLAYGROUND'),
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      }),
    }),
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
    UsersModule,
    CommentsModule,
    NftModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
