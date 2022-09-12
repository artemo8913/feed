import { Repository } from 'typeorm';

import { VolEntity } from '~/entities/vol.entity';
import { CustomRepository } from '~/database/typeorm-ex.decorator';

@CustomRepository(VolEntity)
export class VolRepository extends Repository<VolEntity> {}
