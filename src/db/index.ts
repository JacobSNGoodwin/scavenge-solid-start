import Database from 'better-sqlite3';
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';

import { eq } from 'drizzle-orm/expressions';
import { users } from './schema';

const sqlite = new Database('scavenge.db');
const db: BetterSQLite3Database = drizzle(sqlite);

// better-sqlite3 is syncronous

export const getUserById = (id: string) => {
  db.select().from(users).where(eq(users.id, id)).get();
};
