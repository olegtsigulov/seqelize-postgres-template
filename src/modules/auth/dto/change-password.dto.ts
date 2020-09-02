import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class ChangePasswordDto {
    @(Joiful.string().email().required())
    @ApiProperty({ default: 'user@gmail.com' })
    email: string;

    @(Joiful.string().required())
    @ApiProperty({ default: 'password' })
    oldPassword: string;

    @(Joiful.string().required())
    @ApiProperty({ default: 'password2' })
    newPassword: string;
}
