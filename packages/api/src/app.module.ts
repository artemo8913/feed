import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './controllers/app.controller';
import { AuthController } from './controllers/auth.controller';
import { AppService } from './services/app.service';
import { CompanyRepository } from './repositories/company.repository';
import { UserRepository } from './repositories/user.repository';
import { JobRepository } from './repositories/job.repository';
import { CompanyController } from './controllers/company.controller';
import { JobController } from './controllers/job.controller';
import { CompanyService } from './services/company.service';
import { JobService } from './services/job.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';

import { roles } from './app.roles';
import { jwtConstants } from './constants/jwt';
import { AppDataSource } from './datasource';
import { TypeOrmExModule } from './database/typeorm-ex.module';
import { VolService } from '~/services/vol.service';
import { VolRepository } from '~/repositories/vol.repository';
import { VolController } from '~/controllers/vol.controller';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                // driver: require('better-sqlite3-multiple-ciphers'),
                // type: configService.get<string>('TYPEORM_CONNECTION') as any,
                // database: configService.get<string>('TYPEORM_DATABASE'),
                // entities: [configService.get<string>('TYPEORM_ENTITIES')],
                // migrations: [configService.get<string>('TYPEORM_MIGRATIONS')],
                logging: true,
                synchronize: true,
                dropSchema: false,
                migrationsRun: false,
                cli: {
                    migrationsDir: configService.get<string>(
                        'TYPEORM_MIGRATIONS_DIR',
                    ),
                },
            }),
            dataSourceFactory: (o) => Promise.resolve(AppDataSource),
            inject: [ConfigService],
        }),
        TypeOrmExModule.forCustomRepository([
            CompanyRepository,
            JobRepository,
            UserRepository,
            VolRepository,
        ]),
        AccessControlModule.forRoles(roles),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [
        AppController,
        CompanyController,
        JobController,
        VolController,
        AuthController,
    ],
    providers: [
        AppService,
        CompanyService,
        JobService,
        VolService,
        UserService,
        AuthService,
        JwtAuthStrategy,
    ],
    exports: [],
})
export class AppModule {}
