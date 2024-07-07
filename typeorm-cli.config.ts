import { DataSource } from 'typeorm';
export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'samba',
  password: 'passer123',
  database: 'postgres',
  entities: [],
  migrations: [],
});
