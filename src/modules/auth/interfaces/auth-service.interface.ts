import { Algorithm } from 'jsonwebtoken';
import { Response } from 'express';
import { ProviderUserData } from '../dto/provider-user-data.dto';
import { UserDto } from '../../users/dto';
import { CreateLocalUserDto } from '../dto/create-local-user.dto';

export interface IAuthService {
    accessOptions: IJwtOptions;
    refreshOptions: IJwtOptions;
    /**
     * @description: Sign the user, create a new token before
     * it insert in the response header Authorization.
     * @param {email: string; password: string} credentials
     * @param res
     * @return {Promise<string>}
     */
    localLogin(credentials: { email: string; password: string }, res: Response): Promise<UserDto>;
    localSignUp(userData: CreateLocalUserDto, res: Response): Promise<UserDto>;
    socialSign(userData: ProviderUserData, res: Response): Promise<{user:UserDto, newUser: boolean}>;
    tokenSign(userData: UserDto, res: Response): Promise<void>;
}

export interface IJwtOptions {
    algorithm: Algorithm;
    expiresIn: number | string;
    jwtid: string;
    secret: string;
}
