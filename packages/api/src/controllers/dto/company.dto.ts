import { Expose, Exclude } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CompanyDto {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    name: string;

    @Expose()
    @ApiProperty()
    location: string;

    @Expose()
    @ApiProperty({ nullable: true })
    web?: string;

    @Expose()
    @ApiProperty()
    isActive: boolean;
}
