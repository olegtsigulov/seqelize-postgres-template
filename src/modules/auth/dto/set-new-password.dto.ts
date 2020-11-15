import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class SetNewPasswordDto {
    @(Joiful.string()
      .min(8)
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .required())
    @ApiProperty({ default: 'Password1' })
    password: string;

    @(Joiful.string().required())
    @ApiProperty({ default: 'dfsfsf343' })
    id: string;
}
