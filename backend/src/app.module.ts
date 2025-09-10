import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { Company } from './entities/company.entity';
import { User } from './entities/user.entity';
import { Document } from './entities/document.entity';
import { DocumentResolver } from './document.resolver';
import { CompanyResolver } from './company.resolver';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Company, User, Document],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Company, User, Document]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [DocumentResolver, CompanyResolver, UserResolver],
})
export class AppModule {}
