import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CompanyEntity } from './company.entity';
import { VolEntity } from './vol.entity';

@Entity({ name: 'department' })
export class DepartmentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({
        type: 'varchar',
        length: 256,
    })
    name: string;

    @ManyToMany(() => VolEntity, (v) => v.department, {
        onDelete: 'CASCADE',
    })
    lead: CompanyEntity;
}
