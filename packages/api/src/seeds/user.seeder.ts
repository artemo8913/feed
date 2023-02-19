import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { UserEntity } from '@feed/api/src/entities/user.entity';

console.log('00000000000000000000000000000000000');

/*
insert into MY_TABLE (id, username, password, roles, lastSync, lastReset) values ('1', 'admin', '$2a$12$H7T3Q6W4Xjb/wiArX1Eyc.FPPublUyDZGlptWovNTeX50p0ULw7/u', 'ADMIN', null, null);
*/
export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {
        console.log('00000000000000000000000000000000000');
        const repository = dataSource.getRepository(UserEntity);
        await repository.insert([
            {
                id: 1,
                username: 'admin',
                password:
                    '$2a$12$H7T3Q6W4Xjb/wiArX1Eyc.FPPublUyDZGlptWovNTeX50p0ULw7/u',
                roles: ['ADMIN'],
            },
        ]);

        await repository.save(UserEntity);

        // ---------------------------------------------------

        // const userFactory = await factoryManager.get(UserEntity);
        // save 1 factory generated entity, to the database
        // await userFactory.save();

        // save 5 factory generated entities, to the database
        // await userFactory.saveMany(5);
    }
}
