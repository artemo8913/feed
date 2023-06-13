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
    is_vegan?: boolean; // nutritionType
    is_active?: boolean;
    is_blocked?: boolean;
    daily_eats?: number;
    active_from?: Date;
    comment?: string;
    active_to?: Date;
    arrival_date?: Date;
    departure_date?: Date;
    ref_to?: number; // chef
    departments?: Array<{ id: number; name: string }>; //DepartmentEntity[];
    // location?: LocationEntity[];
    badge_type?: number; //BadgeType
    feed_type?: number; //FeedTypeEntity;
}

export interface KitchenEntity {
    id: number;
    name: string;
}

export interface FeedTypeEntity {
    id: number;
    name: string;
}

export interface ColorTypeEntity {
    id: number;
    name: string;
    description: string;
}

export interface FeedTransactionEntity {
    id: number;
    ulid: string;
    amount: number;
    dtime: string;
    meal_time: string;
    volunteer: number;
    is_vegan: boolean;
    reason: string;
}

export { DepartmentEntity } from '@feed/api/src/entities/department.entity';
export { LocationEntity } from '@feed/api/src/entities/location.entity';
