import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { jwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ListItemService } from '../list-item/list-item.service';

@Resolver(() => List)
@UseGuards(jwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService,
  ) {}

  @Mutation(() => List, {name: 'createList'})
  async createList(@Args('createListInput') createListInput: CreateListInput, @CurrentUser() user: User): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUser() user: User, 
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() user: User): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List, {name: 'updateList'})
  async updateList(@Args('updateListInput') updateListInput: UpdateListInput, @CurrentUser() user: User): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List, {name: 'removeList'})
  async removeList(@Args('id', { type: () => ID }) id: string, @CurrentUser() user: User): Promise<List> {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], {name: 'items'})
  async items(
    @CurrentUser([ValidRoles.admin]) adminUser: User, 
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<ListItem[]> {
    return this.listItemsService.findAll(list, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, {name: 'totalItems'})
  async totalItems(@CurrentUser([ValidRoles.admin]) adminUser: User, @Parent() list: List): Promise<number> {
    return this.listItemsService.itemListCountByList(list);
  }

}
