import { Field, Int, ObjectType } from "@nestjs/graphql";


@ObjectType({description: 'Todo quick aggregations'})
export class AggregationsType {

    @Field(() => Int, {deprecationReason: 'Must use "total" instead'})
    totalTodos: number;

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    pending: number;

    @Field(() => Int)
    completed: number;

}