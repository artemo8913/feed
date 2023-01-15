import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { DepartmentEntity } from '~/entities/department.entity';
import { DepartmentRepository } from '~/repositories/department.repository';

@Injectable()
export class DepartmentService extends TypeOrmCrudService<DepartmentEntity> {
    constructor(
        @InjectRepository(DepartmentRepository)
        public readonly repo: Repository<DepartmentEntity>,
    ) {
        super(repo);
    }
}
