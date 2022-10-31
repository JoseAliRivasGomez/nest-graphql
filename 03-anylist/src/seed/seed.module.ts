import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { ListItemModule } from '../list-item/list-item.module';
import { ListsModule } from '../lists/lists.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [ConfigModule, ItemsModule, UsersModule, ListItemModule, ListsModule]
})
export class SeedModule {}
