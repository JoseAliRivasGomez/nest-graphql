import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    // CONFIGURACION CON AUTORIZACION
    // GraphQLModule.forRootAsync({
    //   driver: ApolloDriver,
    //   imports: [AuthModule],
    //   inject: [JwtService],
    //   useFactory: async(jwtService: JwtService) => {
    //     return {
    //       playground: false,
    //       autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
    //       plugins: [
    //         ApolloServerPluginLandingPageLocalDefault
    //       ],
    //       context({req}) {
    //         const token = req.headers.authorization?.replace('Bearer ', '');
    //         if(!token) throw Error('JWT needed');

    //         const payload = jwtService.decode(token);
    //         if(!payload) throw Error('Valid JWT needed');
            
            
    //       }
    //     }
    //   }
    // }),

    // CONFIGURACION BASICA
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: false,
      playground: false,
      autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault
      ]        
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl: (process.env.STAGE === 'prod') ? {
        rejectUnauthorized: false,
        sslmode: 'require'
      } : false as any,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
    ListItemModule,    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor() {
    console.log("stage", process.env.STAGE);
    console.log("host", process.env.DB_HOST);
    console.log("port", +process.env.DB_PORT);
    console.log("username", process.env.DB_USERNAME);
    console.log("password", process.env.DB_PASSWORD);
    console.log("database", process.env.DB_NAME);
  }

}
