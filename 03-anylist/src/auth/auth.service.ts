import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs/login.input';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './dto/types/auth-response.type';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    private getJWT(id: string) {
        return this.jwtService.sign({id});
    }

    async signup(signupInput: SignupInput): Promise<AuthResponse> {
        
        const user = await this.usersService.create(signupInput);

        const token = this.getJWT(user.id);

        return {
            token,
            user
        }

    }

    async login(loginInput: LoginInput): Promise<AuthResponse> {

        const {email, password} = loginInput;
        
        const user = await this.usersService.findOneByEmail(email);

        if(!bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('Invalid Credentials');
        }

        const token = this.getJWT(user.id);

        return {
            token,
            user
        }

    }

    async validateUser(id: string): Promise<User> {

        const user = await this.usersService.findOneById(id);

        if(!user.isActive) throw new UnauthorizedException('User is inactive, talk to an admin');

        delete user.password;

        return user;

    }

    revalidateToken(user: User): AuthResponse {

        const token = this.getJWT(user.id);

        return {
            token,
            user
        } 

    }

}
