import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { jwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ItemsService } from 'src/items/items.service';
import { Item } from 'src/items/entities/item.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from 'src/lists/lists.service';

@Resolver(() => User)
@UseGuards(jwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  async findAll(@Args() validRoles: ValidRolesArgs, @CurrentUser([ValidRoles.admin]) user: User): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser([ValidRoles.admin]) user: User): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, {name: 'updateUser'})
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput, @CurrentUser([ValidRoles.admin]) user: User): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, {name: 'blockUser'})
  async blockUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser([ValidRoles.admin]) user: User): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, {name: 'itemCount'})
  async itemCount(@CurrentUser([ValidRoles.admin]) adminUser: User, @Parent() user: User): Promise<number> {
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], {name: 'items'})
  async items(
    @CurrentUser([ValidRoles.admin]) adminUser: User, 
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, {name: 'listCount'})
  async listCount(@CurrentUser([ValidRoles.admin]) adminUser: User, @Parent() user: User): Promise<number> {
    return this.listsService.listCountByUser(user);
  }

  @ResolveField(() => [List], {name: 'lists'})
  async lists(
    @CurrentUser([ValidRoles.admin]) adminUser: User, 
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }
}
