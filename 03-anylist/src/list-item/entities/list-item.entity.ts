import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('listItems')
@ObjectType()
export class ListItem {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({type: 'numeric'})
  @Field(() => Number)
  quantity: number;

  @Column({type: 'boolean'})
  @Field(() => Boolean)
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItems, {lazy: true})
  @Field(() => List)
  list: List;

  @ManyToOne(() => Item, (item) => item.listItems, {lazy: true})
  @Field(() => Item)
  item: Item;

}
