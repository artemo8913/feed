import dotenv from 'dotenv';

// TODO ?? purge

process.exit(1);

console.log(232323, process.env.TYPEORM_SEEDING_FACTORIES);

dotenv.config();

export default {
    type: process.env.TYPEORM_CONNECTION || 'better-sqlite3-multiple-ciphers',
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE || '_db/app.db',
    migrations: [process.env.TYPEORM_MIGRATIONS || 'migrations/*.ts'],
    entities: [process.env.TYPEORM_ENTITIES || 'src/**/**.entity.ts'],
    cli: {
        migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR || 'migrations',
        entitiesDir: 'src/entities',
    },
    seeds: [process.env.TYPEORM_SEEDING_SEEDS || 'seeds/**/*.ts'],
    factories: [process.env.TYPEORM_SEEDING_FACTORIES || 'factories/**/*.ts'],
};
