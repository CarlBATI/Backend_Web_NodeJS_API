import dotenv from 'dotenv';

dotenv.config();

export default {

  development:

 {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  // Add other environments (staging, production) as needed
};
