import { User } from '../user.entity';
import { UserDto } from '../dto';

export interface IUserService {
    findAll(): Promise<Array<User>>;
    findById(id: number): Promise<User | null>;
    findOne(options: Object): Promise<User | null>;
    create(user: UserDto): Promise<User>;
    update(id: number, newValue: UserDto): Promise<User | null>;
    delete(id: number): Promise<void>;
    findByEmail(email: string) : Promise<User| null>
}
