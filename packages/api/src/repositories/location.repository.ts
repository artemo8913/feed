import { Repository } from 'typeorm';

import { LocationEntity } from '~/entities/location.entity';
import { CustomRepository } from '~/database/typeorm-ex.decorator';

@CustomRepository(LocationEntity)
export class LocationRepository extends Repository<LocationEntity> {}
