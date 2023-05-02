import {
  index,
  InferModel,
  tinyint,
  json,
  mysqlTable,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';

type ProviderId = string;
type ExternalConnectionData = Record<string, ProviderId>;

export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 20 }).primaryKey(),
    external_connections: json<ExternalConnectionData>(
      'external_connections'
    ).notNull(),
    email: varchar('email', { length: 256 }),
    name: varchar('name', { length: 256 }),
    avatar_url: varchar('avatar_url', { length: 256 }),
  },
  (users) => ({
    emailIdx: uniqueIndex('emailIdx').on(users.email),
  })
);
export type User = InferModel<typeof users>;

export const scavenger_hunts = mysqlTable(
  'scavenger_hunts',
  {
    id: varchar('id', { length: 20 }).primaryKey(),
    title: varchar('title', { length: 256 }).notNull(),
    created_by: varchar('created_by', { length: 256 })
      .notNull()
      .references(() => users.id),
  },
  (scavenger_hunts) => ({
    createdByIdx: index('created_by_idx').on(scavenger_hunts.created_by),
  })
);
export type ScavengerHunt = InferModel<typeof scavenger_hunts>;

export const hunt_items = mysqlTable('hunt_items', {
  id: varchar('id', { length: 20 }).primaryKey(),
  scavenger_hunt_id: varchar('scavenger_hunt_id', { length: 256 })
    .notNull()
    .references(() => scavenger_hunts.id, {
      onDelete: 'cascade',
    }),
  title: varchar('title', { length: 256 }).notNull(),
  weight: tinyint('weight').default(1).notNull(),
});
export type HuntItem = InferModel<typeof hunt_items>;
