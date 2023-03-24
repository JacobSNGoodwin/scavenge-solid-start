import {
  blob,
  index,
  InferModel,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

type ProviderId = string;
type ExternalConnectionData = Record<string, ProviderId>;

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    external_connections: blob<ExternalConnectionData>('external_connections', {
      mode: 'json',
    }).notNull(),
    email: text('email'),
    name: text('name'),
    avatar_url: text('avatar_url'),
  },
  (users) => ({
    emailIdx: uniqueIndex('emailIdx').on(users.email),
  })
);
export type User = InferModel<typeof users>;

export const scavenger_hunts = sqliteTable(
  'scavenger_hunts',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    created_by: text('created_by')
      .notNull()
      .references(() => users.id),
  },
  (scavenger_hunts) => ({
    createdByIdx: index('created_by_idx').on(scavenger_hunts.created_by),
  })
);
export type ScavengerHunt = InferModel<typeof scavenger_hunts>;

export const hunt_items = sqliteTable('hunt_items', {
  id: text('id').primaryKey(),
  scavenger_hunt_id: text('scavenger_hunt_id')
    .notNull()
    .references(() => scavenger_hunts.id, {
      onDelete: 'cascade',
    }),
  title: text('title').notNull(),
  weight: integer('weight').default(1).notNull(),
});
export type HuntItem = InferModel<typeof hunt_items>;
