import { Seeder } from '@concepta/typeorm-seeding';

import { UserFactory } from '@feed/api/src/factories/user.factory';

/*
insert into MY_TABLE (id, username, password, roles, lastSync, lastReset) values ('1', 'admin', '$2a$12$H7T3Q6W4Xjb/wiArX1Eyc.FPPublUyDZGlptWovNTeX50p0ULw7/u', 'ADMIN', null, null);
*/
export class UserSeeder extends Seeder {
    async run() {
        console.log('UserSeeder');
        await this.factory(UserFactory).create();
    }
}
