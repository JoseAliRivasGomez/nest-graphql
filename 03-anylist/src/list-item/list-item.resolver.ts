import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { jwtAuthGuard } from '../auth/guards/jwt-auth.guards';

@Resolver(() => ListItem)
@UseGuards(jwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  async createListItem(@Args('createListItemInput') createListItemInput: CreateListItemInput) {
    return this.listItemService.create(createListItemInput);
  }

  // @Query(() => [ListItem], { name: 'listItem' })
  // async findAll(): Promise<ListItem[]> {
  //   return this.listItemService.findAll();
  // }

  @Query(() => ListItem, { name: 'listItem' })
  async findOne(@Args('id', { type: () => String }, ParseUUIDPipe) id: string): Promise<ListItem> {
    return this.listItemService.findOne(id);
  }

  @Mutation(() => ListItem)
  async updateListItem(@Args('updateListItemInput') updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    return this.listItemService.update(updateListItemInput.id, updateListItemInput);
  }

  // @Mutation(() => ListItem)
  // async removeListItem(@Args('id', { type: () => Int }) id: number): Promise<ListItem> {
  //   return this.listItemService.remove(id);
  // }
}
