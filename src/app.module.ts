import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path/posix';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { WalletsResolver } from './users/resolvers/wallets.resolver';
import { TransactionsModule } from './transactions/transactions.module';
import { AssetsModule } from './assets/assets.module';
import databaseConfig from './database/database.config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

/* TODO: 
    1. Add PostgreSQL and TypeORM // done
    2. Setup domain and model entities // initial done
    3. Setup basic crud - modfiy BaseEntity to BaseModel // initial done
      - add currency js for monetary values (floating point arithmetic issues) - done
      - accountStatus enum "Approved", "Disabled" - hmm
    4. Add error handling and validation - needs improvement
    5. Enable searching filtering and pagination

  
    5. Add authentication with JWT passport -done
    6. Add role based authorization -done
    7. Dataloader for N+1 queries
    8. Add caching? 
    9. DB migrations and seeding -- generate mockdata somewhere
    10. add unit tests 
    11. GraphQL complexity
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
      envFilePath: ['.env', '.env.production'],
      load: [databaseConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    UsersModule,
    CommentsModule,
    AssetsModule,
    AuthModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [WalletsResolver],
})
export class AppModule {}
