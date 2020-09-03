import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class CreateLocalUserDto {
    @(Joiful.string().email().required())
    @ApiProperty({ default: 'user@gmail.com' })
    email: string;

    @(Joiful.string()
      .min(8)
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .required())
    @ApiProperty({ default: 'Password1' })
    password: string;

    @(Joiful.string())
    @ApiPropertyOptional({ description: 'User name', example: 'Ivan' })
    firstName?: string;

    @(Joiful.string())
    @ApiPropertyOptional({ description: 'User second name', example: 'Ivanov' })
    lastName?: string;
}
