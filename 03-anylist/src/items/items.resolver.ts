import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { jwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Resolver(() => Item)
@UseGuards(jwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, {name: 'createItem'})
  async createItem(@Args('createItemInput') createItemInput: CreateItemInput, @CurrentUser() user: User): Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(
    @CurrentUser() user: User, 
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => Item, { name: 'item' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() user: User): Promise<Item> {
    return this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item, {name: 'updateItem'})
  async updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput, @CurrentUser() user: User): Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => Item, {name: 'removeItem'})
  async removeItem(@Args('id', { type: () => ID }) id: string, @CurrentUser() user: User): Promise<Item> {
    return this.itemsService.remove(id, user);
  }
}
