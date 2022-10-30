import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class List {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
