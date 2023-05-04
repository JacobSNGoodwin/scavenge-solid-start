import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';

import { and, asc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import {
  HuntItem,
  hunt_items,
  ScavengerHunt,
  scavenger_hunts,
  User,
  users,
} from './schema';

const connection = connect({
  host: process?.env?.PLANET_SCALE_HOST,
  username: process?.env?.PLANET_SCALE_USERNAME,
  password: process?.env?.PLANET_SCALE_PW,
});

const db = drizzle(connection);

export const getUserByEmail = async (email: string): Promise<User | null> => {
  // you'd think this would handle not found. Sigh!
  const rows = await db.select().from(users).where(eq(users.email, email));

  if (!rows.length) {
    return null;
  }

  return rows[0];
};

export const getUserById = async (id: string): Promise<User | null> => {
  const rows = await db.select().from(users).where(eq(users.id, id));

  if (!rows.length) {
    return null;
  }

  return rows[0];
};

type NewUserData = Omit<User, 'id'>;

export const createNewUser = async (user: NewUserData): Promise<string> => {
  const id = nanoid(20);

  await db.insert(users).values({ ...user, id });

  return id;
};

export const getUserScavengerHunts = async (
  userId: string
): Promise<Array<ScavengerHunt>> =>
  db
    .select()
    .from(scavenger_hunts)
    .where(eq(scavenger_hunts.created_by, userId))
    .orderBy(asc(scavenger_hunts.title));

export const addScavengerHunt = async (
  title: string,
  userId: string
): Promise<ScavengerHunt | null> => {
  const newId = nanoid(20);
  await db.insert(scavenger_hunts).values({
    id: newId,
    created_by: userId,
    title,
  });

  const rows = await db
    .select()
    .from(scavenger_hunts)
    .where(eq(scavenger_hunts.id, newId));

  if (!rows.length) {
    return null;
  }

  return rows[0];
};

export const getUserScavengerHunt = async (id: string, userId: string) =>
  db
    .select()
    .from(scavenger_hunts)
    .leftJoin(hunt_items, eq(hunt_items.scavenger_hunt_id, scavenger_hunts.id))
    .where(
      and(eq(scavenger_hunts.id, id), eq(scavenger_hunts.created_by, userId))
    )
    .orderBy(asc(hunt_items.weight));

export const getScavengerHunt = async (id: string) =>
  db
    .select()
    .from(scavenger_hunts)
    .leftJoin(hunt_items, eq(hunt_items.scavenger_hunt_id, scavenger_hunts.id))
    .where(eq(scavenger_hunts.id, id))
    .orderBy(asc(hunt_items.weight));

export const deleteScavengerHunt = async (id: string, userId: string) => {
  await db
    .delete(scavenger_hunts)
    .where(
      and(eq(scavenger_hunts.id, id), eq(scavenger_hunts.created_by, userId))
    );

  // since we don't have foreign key relations, we must delete
  await db.delete(hunt_items).where(eq(hunt_items.scavenger_hunt_id, id));
};

type UpdateItem = {
  id: string;
  userId: string;
  title: string;
};

export const updateHuntTitle = async ({ id, userId, title }: UpdateItem) =>
  db
    .update(scavenger_hunts)
    .set({ title: title })
    .where(
      and(eq(scavenger_hunts.id, id), eq(scavenger_hunts.created_by, userId))
    );

export const addHuntItem = async ({
  scavenger_hunt_id,
  title,
  weight,
}: Omit<HuntItem, 'id'>) => {
  await db.insert(hunt_items).values({
    id: nanoid(20),
    title,
    weight,
    scavenger_hunt_id,
  });
};

export const deleteHuntItem = async (id: string) => {
  await db.delete(hunt_items).where(and(eq(hunt_items.id, id)));
};
