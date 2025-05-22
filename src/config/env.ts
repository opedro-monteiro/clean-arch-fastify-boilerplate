import z from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string(),
    BASE_URL: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
