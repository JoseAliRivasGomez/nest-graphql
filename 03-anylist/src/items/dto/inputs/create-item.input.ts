import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsPositive()
  @Field(() => Float)
  quantity: number;

  @Field(() => String, {nullable: true})
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
