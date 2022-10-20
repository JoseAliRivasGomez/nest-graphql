import { Field, InputType, Int } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { min } from "rxjs";

@InputType()
export class UpdateTodoInput {

    @Field(() => Int)
    @IsInt()
    @Min(1)
    id: number;

    @Field(() => String, {description: 'What needs to be done', nullable: true})
    @IsString()
    @IsOptional()
    @MaxLength(20)
    description?: string;

    @Field(() => Boolean, {nullable: true})
    @IsBoolean()
    @IsOptional()
    done?: boolean;

}