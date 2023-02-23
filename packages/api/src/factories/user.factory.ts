import { Factory } from '@concepta/typeorm-seeding';

import { UserEntity } from '@feed/api/src/entities/user.entity';

export class UserFactory extends Factory<UserEntity> {
    protected async entity(): Promise<UserEntity> {
        const user = new UserEntity();
        user.username = 'admin';
        user.password =
            '$2a$12$H7T3Q6W4Xjb/wiArX1Eyc.FPPublUyDZGlptWovNTeX50p0ULw7/u';
        user.roles = ['ADMIN'];

        console.log('UserFactory', user);

        return user;
    }
}
