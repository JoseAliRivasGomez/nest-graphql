import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateListInput {
  
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

}
