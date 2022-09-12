import { Repository } from 'typeorm';

import { JobEntity } from '~/entities/job.entity';
import { CustomRepository } from '~/database/typeorm-ex.decorator';

@CustomRepository(JobEntity)
export class JobRepository extends Repository<JobEntity> {}
