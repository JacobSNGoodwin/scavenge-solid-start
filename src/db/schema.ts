import {
  index,
  InferModel,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    external_id: text('external_id').notNull(),
    external_provider: text('provider').notNull(),
    email: text('email'),
    name: text('name'),
    avatar_url: text('avatar_url'),
  },
  (users) => ({
    externalIdProviderIdx: uniqueIndex('external_id_provider_idx').on(
      users.external_id,
      users.external_provider
    ),
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
  title: text('title').notNull(),
  weight: integer('weight').default(1).notNull(),
});
export type HuntItem = InferModel<typeof hunt_items>;
