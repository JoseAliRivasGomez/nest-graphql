import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloResolver {

    @Query(() => String, {description: 'Devuelve Hola', name: 'hello'})
    hello(): string {
        return 'Hola';
    }

    @Query(() => Float, {name: 'randomNumber'})
    getRandomNumber(): number {
        return Math.random() * 100;
    }

    @Query(() => Int, {name: 'randomFromZeroTo', description: 'From zero to argument TO (default 10)'})
    getRandomFromZeroTo(@Args('to', {type: () => Int, nullable: true}) to: number = 10): number {
        return Math.floor(Math.random() * to);
    }
}
