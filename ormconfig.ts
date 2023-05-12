import { config } from 'dotenv';
config();
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
});

dataSource
  .initialize()
  .then(() => console.log('DataSource has been initialized'))
  .catch((err) => console.error('Error during DataSource initialization', err));

export default dataSource;
