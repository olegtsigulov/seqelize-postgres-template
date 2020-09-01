import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class LoginDto {
    @(Joiful.string().email().required())
    @ApiProperty({ default: 'user@gmail.com' })
    email: string;

    @(Joiful.string().required())
    @ApiProperty({ default: 'password' })
    password: string;
}
