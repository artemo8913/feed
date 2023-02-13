import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { UserEntity } from '@feed/api/src/entities/user.entity';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {
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

        // ---------------------------------------------------

        const userFactory = await factoryManager.get(UserEntity);
        // save 1 factory generated entity, to the database
        await userFactory.save();

        // save 5 factory generated entities, to the database
        // await userFactory.saveMany(5);
    }
}
