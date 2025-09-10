import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userRepository.find({ relations: ['company'] });
  }

  @Query(() => User, { nullable: true })
  async user(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['company'],
    });
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('role', { nullable: true }) role?: string,
    @Args('companyId', { type: () => Int, nullable: true }) companyId?: number,
  ): Promise<User> {
    let company: Company | undefined = undefined;
    if (companyId) {
      const foundCompany = await this.companyRepository.findOne({
        where: { id: companyId },
      });
      company = foundCompany ?? undefined;
    }
    const user = this.userRepository.create({
      email,
      name,
      role,
      company,
    });
    return this.userRepository.save(user);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('email', { nullable: true }) email?: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('role', { nullable: true }) role?: string,
    @Args('companyId', { type: () => Int, nullable: true }) companyId?: number,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    if (email !== undefined) user.email = email;
    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (companyId !== undefined) {
      if (companyId) {
        const foundCompany = await this.companyRepository.findOne({
          where: { id: companyId },
        });
        user.company = foundCompany ?? null;
      } else {
        user.company = null;
      }
    }
    return this.userRepository.save(user);
  }

  @Mutation(() => User)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    await this.userRepository.remove(user);
    return user;
  }
}
