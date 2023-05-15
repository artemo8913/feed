export interface VolEntity {
    id: number;
    uuid?: string;
    qr?: string;
    name?: string;
    lastname?: string;
    nickname?: string;
    phone?: string;
    email?: string;
    photo?: string;
    position?: string;
    // nutritionType?: string;
    is_active?: boolean;
    is_blocked?: boolean;
    daily_eats?: number;
    active_from?: Date;
    comment?: string;
    active_to?: Date;
    arrival_date?: Date;
    departure_date?: Date;
    // chef?: VolEntity[];
    departments?: Array<{ id: number, name: string }>; //DepartmentEntity[];
    // location?: LocationEntity[];
    // badgeType?: BadgeEntity;
    feed_type?: number; //FeedTypeEntity;
}

export { DepartmentEntity } from '@feed/api/src/entities/department.entity';
export { LocationEntity } from '@feed/api/src/entities/location.entity';
