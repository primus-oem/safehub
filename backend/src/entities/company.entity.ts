import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Document } from './document.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Company {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @OneToMany(() => User, (user) => user.company)
  @Field(() => [User], { nullable: true })
  users: User[];

  @OneToMany(() => Document, (doc) => doc.company)
  @Field(() => [Document], { nullable: true })
  documents: Document[];
}
