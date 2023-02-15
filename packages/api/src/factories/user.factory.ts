// import { Faker } from '@faker-js/faker';

import { setSeederFactory } from 'typeorm-extension';

import { UserEntity } from '@feed/api/src/entities/user.entity';

setSeederFactory(UserEntity, (_faker) => {
    // const gender = faker.datatype.number(1);
    // const firstName = faker.name.firstName(gender);
    // const lastName = faker.name.lastName(gender);
    // const email = faker.internet.email(firstName, lastName);

    const user = new UserEntity();
    user.username = 'admin';
    user.password =
        '$2a$12$H7T3Q6W4Xjb/wiArX1Eyc.FPPublUyDZGlptWovNTeX50p0ULw7/u';
    user.roles = ['ADMIN'];
    return user;
});
