import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const connection = connect({
  host: process?.env?.PLANET_SCALE_HOST,
  username: process?.env?.PLANET_SCALE_USERNAME,
  password: process?.env?.PLANET_SCALE_PW,
});

const db = drizzle(connection);

migrate(db, { migrationsFolder: './migrations' });
