import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default registerAs('database', () => {
  return {
    type: 'postgres',
    namingStragegy: new SnakeNamingStrategy(),
    logging: true,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    autoLoadEntities: true,
    synchronize: process.env.MODE === 'dev',
    entities: [join(__dirname, '..', '/**/**/*.entity{.ts,.js}')],
    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: 'src/database/migrations',
    },
    seeds: ['src/database/seeding/seeds/*{.ts,.js}'],
    factories: ['src/database/seeding/factories/*{.ts,.js}'],
  };
});
