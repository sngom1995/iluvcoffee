import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1720380030967 implements MigrationInterface {
    name = 'SchemaSync1720380030967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ADD "descripion" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "descripion"`);
    }

}
