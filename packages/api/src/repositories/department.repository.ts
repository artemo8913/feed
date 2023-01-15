import { Repository } from 'typeorm';

import { DepartmentEntity } from '~/entities/department.entity';
import { CustomRepository } from '~/database/typeorm-ex.decorator';

@CustomRepository(DepartmentEntity)
export class DepartmentRepository extends Repository<DepartmentEntity> {}
