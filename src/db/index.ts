import Database from 'better-sqlite3';
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';

import { eq } from 'drizzle-orm/expressions';
import { nanoid } from 'nanoid';
import { ScavengerHunt, scavenger_hunts, User, users } from './schema';

const sqlite = new Database('scavenge.db');
const db: BetterSQLite3Database = drizzle(sqlite);

// better-sqlite3 is syncronous

export const getUserByEmail = (email: string): User | null => {
  // you'd think this would handle not found. Sigh!
  const rows = db.select().from(users).where(eq(users.email, email)).all();

  if (!rows.length) {
    return null;
  }

  return rows[0];
};

export const getUserById = (id: string): User =>
  db.select().from(users).where(eq(users.id, id)).get();

type NewUserData = Omit<User, 'id'>;

export const createNewUser = (user: NewUserData) => {
  const id = nanoid(20);

  const { id: createdId } = db
    .insert(users)
    .values({ ...user, id })
    .returning()
    .get();

  return createdId;
};

export const getUserScavengerHunts = (id: string): Array<ScavengerHunt> =>
  db
    .select()
    .from(scavenger_hunts)
    .where(eq(scavenger_hunts.created_by, id))
    .all();
