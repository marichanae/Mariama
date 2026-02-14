import { UsersService } from './users.service';
import { UpdateInterestsDto } from './dto/update-interests.dto';
interface RequestUser {
    userId: string;
    email: string;
    role: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: RequestUser): Promise<any>;
    updateInterests(user: RequestUser, dto: UpdateInterestsDto): Promise<any>;
}
export {};
