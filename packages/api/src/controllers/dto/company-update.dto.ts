import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyUpdateDto {
    @ApiProperty()
    @IsOptional()
    readonly name: string;

    @ApiProperty()
    @IsOptional()
    readonly location: string;

    @ApiProperty()
    @IsOptional()
    readonly web?: string;

    @ApiProperty()
    @IsOptional()
    readonly isActive: boolean;
}
