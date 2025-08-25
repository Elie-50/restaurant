import type { Config } from 'drizzle-kit';

export default {
    schema: "./db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    dialect: 'mysql'
} satisfies Config;