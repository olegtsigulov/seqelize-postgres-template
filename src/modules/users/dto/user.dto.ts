import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProvidersEnum } from '../../auth/enum/providers.enum';
import { UserStatusEnum } from '../../../shared/enums/user-status.enum';

export class UserDto {
    @ApiProperty({ description: 'Unique ID', example: '124' })
    id?: number;

    @ApiProperty({ description: 'provider', enum: Object.values(ProvidersEnum), example: ProvidersEnum.GOOGLE })
    provider: string;

    @ApiPropertyOptional({ description: 'User name', example: 'Ivan' })
    firstName?: string;

    @ApiPropertyOptional({ description: 'User second name', example: 'Ivanov' })
    lastName?: string;

    @ApiProperty({ description: 'User email', example: 'user@gmail.com' })
    email: string;

    @ApiProperty({ description: 'User provider id', example: '1343455634224' })
    providerId: string;

    hash?: string;

    @ApiPropertyOptional({ description: 'User status', enum: UserStatusEnum, example: UserStatusEnum.ACTIVE })
    status?: string;

    @ApiPropertyOptional({ description: 'Timestamp when local user change password', example: 12354522 })
    lastTimePasswordUpdate?: number
}
