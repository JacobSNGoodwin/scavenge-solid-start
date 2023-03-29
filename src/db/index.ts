import Database from 'better-sqlite3';
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';

import { and, asc, eq } from 'drizzle-orm/expressions';
import { nanoid } from 'nanoid';
import {
  HuntItem,
  hunt_items,
  ScavengerHunt,
  scavenger_hunts,
  User,
  users,
} from './schema';

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

export const getUserScavengerHunts = (userId: string): Array<ScavengerHunt> =>
  db
    .select()
    .from(scavenger_hunts)
    .where(eq(scavenger_hunts.created_by, userId))
    .orderBy(asc(scavenger_hunts.title))
    .all();

export const addScavengerHunt = (title: string, userId: string) =>
  db
    .insert(scavenger_hunts)
    .values({
      id: nanoid(20),
      created_by: userId,
      title,
    })
    .returning()
    .get();

export const getScavengerHunt = (id: string, userId: string) =>
  db
    .select()
    .from(scavenger_hunts)
    .leftJoin(hunt_items, eq(hunt_items.scavenger_hunt_id, scavenger_hunts.id))
    .where(
      and(eq(scavenger_hunts.id, id), eq(scavenger_hunts.created_by, userId))
    )
    .orderBy(asc(hunt_items.weight))
    .all();

export const deleteScavengerHunt = (id: string, userId: string) =>
  db
    .delete(scavenger_hunts)
    .where(
      and(eq(scavenger_hunts.id, id), eq(scavenger_hunts.created_by, userId))
    )
    .run();

export const addHuntItem = ({
  scavenger_hunt_id,
  title,
  weight,
}: Omit<HuntItem, 'id'>) => {
  db.insert(hunt_items)
    .values({
      id: nanoid(20),
      title,
      weight,
      scavenger_hunt_id,
    })
    .run();
};
