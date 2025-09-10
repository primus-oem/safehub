import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { User } from './entities/user.entity';

@Resolver(() => Company)
export class CompanyResolver {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Query(() => [Company])
  async companies(): Promise<Company[]> {
    return this.companyRepository.find({ relations: ['users', 'documents'] });
  }

  @Query(() => Company, { nullable: true })
  async company(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Company | null> {
    return this.companyRepository.findOne({
      where: { id },
      relations: ['users', 'documents'],
    });
  }

  @Mutation(() => Company)
  async createCompany(@Args('name') name: string): Promise<Company> {
    const company = this.companyRepository.create({ name });
    return this.companyRepository.save(company);
  }

  @Mutation(() => Company)
  async updateCompany(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
  ): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new Error('Company not found');
    company.name = name;
    return this.companyRepository.save(company);
  }

  @Mutation(() => Company)
  async deleteCompany(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new Error('Company not found');
    await this.companyRepository.remove(company);
    return company;
  }

  @Mutation(() => User)
  async assignUserToCompany(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('companyId', { type: () => Int }) companyId: number,
    @Args('role', { nullable: true }) role?: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    if (!user || !company) throw new Error('User or Company not found');
    user.company = company;
    if (role) user.role = role;
    return this.userRepository.save(user);
  }
}
