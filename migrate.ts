import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle } from 'drizzle-orm/better-sqlite3';

const sqlite = new Database('scavenge.db');
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: './migrations' });
