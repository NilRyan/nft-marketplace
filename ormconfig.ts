import { ConfigModule } from '@nestjs/config';
import databaseConfig from './src/database/database.config';

ConfigModule.forRoot({
  isGlobal: true,
  load: [databaseConfig],
});

export default databaseConfig();
