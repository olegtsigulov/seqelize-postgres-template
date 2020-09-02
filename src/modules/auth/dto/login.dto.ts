import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class LoginDto {
    @(Joiful.string().email().required())
    @ApiProperty({ default: 'user@gmail.com' })
    email: string;

    @(Joiful.string()
      .min(8)
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .required())
    @ApiProperty({ default: 'password' })
    password: string;
}
