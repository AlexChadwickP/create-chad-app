import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Add this line

export default defineConfig({
    schema: "./server/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});