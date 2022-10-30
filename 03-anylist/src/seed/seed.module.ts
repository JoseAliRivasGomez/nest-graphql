import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [ConfigModule, ItemsModule, UsersModule]
})
export class SeedModule {}
