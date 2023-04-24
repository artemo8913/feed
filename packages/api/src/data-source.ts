import { DataSource } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { VolEntity } from './entities/vol.entity';
import { DepartmentEntity } from './entities/department.entity';
import { BadgeEntity } from './entities/badge.entity';
import { FeedTransactionEntity } from './entities/feed-transaction.entity';
import { FeedTypeEntity } from './entities/feed-type.entity';
import { LocationEntity } from './entities/location.entity';

export const AppDataSource = new DataSource({
    driver: require('sqlite3'),
    type: 'sqlite',
    // host: configService.get<string>('TYPEORM_HOST'),
    // port: configService.get<number>('TYPEORM_PORT'),
    // username: configService.get<string>('TYPEORM_USERNAME'),
    // password: configService.get<string>('TYPEORM_PASSWORD'),
    synchronize: true,
    database: '_db/app.db',
    // entities: [__dirname + '/entities/*.entity.ts'],
    entities: [
        UserEntity,
        VolEntity,
        DepartmentEntity,
        BadgeEntity,
        FeedTypeEntity,
        FeedTransactionEntity,
        LocationEntity,
    ],
    migrations: ['src/migrations/*.{ts, js}'],
    logging: true,
    // prepareDatabase: async (db) => {
    //     // console.log(db);
    //     await db.pragma(`cipher='sqlcipher'`);
    //     // await db.pragma(`foreign_keys=ON`);
    // },
});
