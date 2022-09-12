import { Repository } from 'typeorm';

import { CompanyEntity } from '~/entities/company.entity';
import { CustomRepository } from '~/database/typeorm-ex.decorator';

@CustomRepository(CompanyEntity)
export class CompanyRepository extends Repository<CompanyEntity> {}
