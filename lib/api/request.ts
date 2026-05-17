import { z } from "zod";

export async function parseJson<TSchema extends z.ZodTypeAny>(request: Request, schema: TSchema): Promise<z.infer<TSchema>> {
  const body = await request.json().catch(() => ({}));
  return schema.parse(body);
}
