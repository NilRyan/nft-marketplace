import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { NftModule } from './nft/nft.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path/posix';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';

/* TODO: 
    1. Add PostgreSQL and TypeORM // done
    2. Setup domain and model entities // initial done
    3. Setup basic crud - modfiy BaseEntity to BaseModel // initial done
      - add currency js for monetary values (floating point arithmetic issues)
    4. Add error handling and validation
    5. Enable searching filtering and pagination

  
    5. Add authentication with JWT passport
    6. Add role based authorization
    7. Dataloader for N+1 queries
    8. Add caching? 
    9. DB migrations and seeding -- generate mockdata somewhere
    10. add unit tests 
*/
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        playground: Boolean('GRAPHQL__PLAYGROUND'),
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
    }),
    DatabaseModule,
    UsersModule,
    CommentsModule,
    NftModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
