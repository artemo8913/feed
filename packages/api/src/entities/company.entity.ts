import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { DepartmentEntity } from './department.entity';

@Entity({ name: 'company' })
export class CompanyEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column({ nullable: true })
    web?: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => DepartmentEntity, (dep) => dep.lead, {
        eager: true,
        cascade: true,
    })
    departments?: DepartmentEntity[];
}
