import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class VolUpdateCompanyDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    readonly id: number;
}

export class VolUpdateDto {
    @ApiProperty()
    @IsOptional()
    readonly name: string;

    @ApiProperty()
    @IsOptional()
    readonly position: string;
}
