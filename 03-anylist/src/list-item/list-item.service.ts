import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { List } from '../lists/entities/list.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {

    const {itemId, listId, ...rest} = createListItemInput;

    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: {id: itemId},
      list: {id: listId}
    });
    await this.listItemsRepository.save(newListItem);

    return this.findOne(newListItem.id);
  }

  async findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<ListItem[]> {
    
    const {limit, offset} = paginationArgs;
    const {search} = searchArgs;

    const queryBuilder = this.listItemsRepository.createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, {listId: list.id});

    if(search){
      queryBuilder.andWhere('LOWER(item.name) like :name', {name: `%${search.toLowerCase()}%`});
    }

    return queryBuilder.getMany();

  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({id});
    if(!listItem) throw new NotFoundException(`List item with ID ${id} not found`);
    return listItem;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    
    const {itemId, listId, ...rest} = updateListItemInput;

    // const listItem = await this.listItemsRepository.preload({
    //   ...rest,
    //   item: {id: itemId},
    //   list: {id: listId}
    // });

    // if(!listItem) throw new NotFoundException(`List item with ID ${id} not found`);

    // return this.listItemsRepository.save(listItem);

    const queryBuilder = this.listItemsRepository.createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', {id});
    //console.log(queryBuilder.getSql());
    await queryBuilder.execute();

    if(listId) queryBuilder.set({list: {id: listId}});
    //console.log(queryBuilder.getSql());
    await queryBuilder.execute();
    
    if(itemId) queryBuilder.set({item: {id: itemId}}); //Parece que solo puede haber un set por queryBuilder, por eso se puede ejecutar hasta 3 veces en este caso 
    //console.log(queryBuilder.getSql());
    await queryBuilder.execute();
    
    return await this.findOne(id);

  }

  // async remove(id: string): Promise<ListItem> {
  //   return `This action removes a #${id} listItem`;
  // }

  async itemListCountByList(list: List): Promise<number> {
    return this.listItemsRepository.count({
      where: {
        list: {
          id: list.id
        }
      }
    });
  }
}
