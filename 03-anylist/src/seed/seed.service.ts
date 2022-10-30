import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        private readonly usersService: UsersService,

        private readonly itemsService: ItemsService,

    ) {
        this.isProd = configService.get('STATE') === 'prod';
    }

    async executeSeed() {

        if(this.isProd) {
            throw new UnauthorizedException('We cant run SEED on Production');
        }

        await this.deleteDatabase();

        const user = await this.loadUsers();

        await this.loadItems(user);

        return true;
    }

    async deleteDatabase() {
        await this.itemsRepository.createQueryBuilder().delete().where({}).execute();
        await this.usersRepository.createQueryBuilder().delete().where({}).execute();
    }

    async loadUsers(): Promise<User> {
        const users = [];
        for(const user of SEED_USERS){
            users.push(await this.usersService.create(user));
        }

        return users[0];
    }

    async loadItems(user: User): Promise<void> {
        const itemsPromises = [];
        for(const item of SEED_ITEMS){
            itemsPromises.push(this.itemsService.create(item, user));
        }
        await Promise.all(itemsPromises);
    }

}
