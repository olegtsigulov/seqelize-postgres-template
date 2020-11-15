import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class ForgotPasswordDto {
    @(Joiful.string().email().required())
    @ApiProperty({ default: 'user@gmail.com' })
    email: string;
}
