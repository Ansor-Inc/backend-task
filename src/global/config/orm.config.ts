import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = function (
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get('PG_HOST'),
    port: +configService.get('PG_PORT'),
    username: configService.get('PG_USERNAME'),
    password: configService.get('PG_PASSWORD'),
    database: configService.get('PG_DB'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true, // <-- depends on prod/dev
  };
};
