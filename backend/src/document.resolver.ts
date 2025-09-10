import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { Company } from './entities/company.entity';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  @Query(() => [Document])
  async documents(): Promise<Document[]> {
    return this.documentRepository.find({ relations: ['company'] });
  }

  @Mutation(() => Document)
  async createDocument(
    @Args('title') title: string,
    @Args('content', { nullable: true }) content?: string,
    @Args('companyId', { type: () => Int, nullable: true }) companyId?: number,
  ): Promise<Document> {
    let company: Company | undefined = undefined;
    if (companyId) {
      const foundCompany = await this.companyRepository.findOne({
        where: { id: companyId },
      });
      company = foundCompany ?? undefined;
    }
    const doc = this.documentRepository.create({
      title,
      content: content ?? '',
      company,
    });
    return this.documentRepository.save(doc);
  }

  @Mutation(() => Document)
  async updateDocument(
    @Args('id', { type: () => Int }) id: number,
    @Args('title') title: string,
    @Args('content', { nullable: true }) content?: string,
  ): Promise<Document> {
    const doc = await this.documentRepository.findOne({ where: { id } });
    if (!doc) throw new Error('Document not found');
    doc.title = title;
    doc.content = content ?? '';
    return this.documentRepository.save(doc);
  }

  @Mutation(() => Document)
  async deleteDocument(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Document> {
    const doc = await this.documentRepository.findOne({ where: { id } });
    if (!doc) throw new Error('Document not found');
    await this.documentRepository.remove(doc);
    return doc;
  }
}
