// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SeedingSource } = require('@concepta/typeorm-seeding');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { UserSeeder } = require('./dist/seeds/user.seeder');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppDataSource } = require('./dist/data-source');

console.log('seeding...');

module.exports = new SeedingSource({
    dataSource: AppDataSource, // overridden if provided by CLI arg
    seeders: [UserSeeder],
    defaultSeeders: [UserSeeder]
});
