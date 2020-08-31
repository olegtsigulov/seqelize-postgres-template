import * as jwt from 'jsonwebtoken';
import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import { MessageCodeError } from '../errors';
import { User } from '../../modules/users/user.entity';

@Injectable()
export class LocalAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {
            const token = (req.headers.authorization as string).split(' ')[1];
            const decoded: any = jwt.verify(token, process.env.JWT_KEY || '');
            const user = await User.findOne<User>({
                where: {
                    id: decoded.id,
                    email: decoded.email
                }
            });
            if (!user) throw new MessageCodeError('request:unauthorized');
            return true;
        } else {
            throw new MessageCodeError('request:unauthorized');
        }
    }
}
