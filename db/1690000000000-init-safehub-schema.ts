import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSafehubSchema1690000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE companies (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                company_id INTEGER REFERENCES companies(id),
                role VARCHAR(50)
            );
            CREATE TABLE documents (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                company_id INTEGER REFERENCES companies(id)
            );
        `);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS documents;
            DROP TABLE IF EXISTS users;
            DROP TABLE IF EXISTS companies;
        `);
    }
}
