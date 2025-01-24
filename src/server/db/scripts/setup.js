import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const scripts = [
  '01_init_database.sql',
  '02_initial_data.sql'
];

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  try {
    console.log('Starting database setup...');

    for (const script of scripts) {
      console.log(`Running ${script}...`);
      const sqlPath = path.join(__dirname, script);
      const sql = fs.readFileSync(sqlPath, 'utf8');

      try {
        await connection.query(sql);
        console.log(`Successfully executed ${script}`);
      } catch (error) {
        console.error(`Error executing ${script}:`, error);
        throw error;
      }
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase().catch(console.error);
}

export default setupDatabase;