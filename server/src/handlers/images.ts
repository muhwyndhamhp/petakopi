import { type Context } from 'hono';
import { getDB } from '../db';
import { type InferOutput } from 'valibot';
import { ImageUploadSchema } from '@rpcTypes/image';
import { Resource } from 'sst';
import { uuidv7 } from 'uuidv7';

export async function deleteImage(id: string) {
  const db = await getDB();

  const deleted = await db
    .deleteFrom('images')
    .where('images.id', '=', id)
    .executeTakeFirst();

  return { success: deleted.numDeletedRows === 1n };
}

export async function image(c: Context) {
  const db = await getDB();
  const id = c.req.param('id');

  const image = await db.selectFrom('images')
    .selectAll()
    .where('images.coffee_id', '=', id)
    .execute();

  return c.json(image);
}

export async function createImage(image: InferOutput<typeof ImageUploadSchema>) {
  const imageId = uuidv7();
  const key = `images/${imageId}-${image.file.name}`;
  await Resource.PetaKopiBucket.put(key, image.file);

  const db = await getDB();
  const res = await db.insertInto('images').values({
    url: `https://${process.env.BUCKET_DOMAIN}/${key}`,
    alt: 'image alt',
    id: imageId,
    coffee_id: image.id,
  }).executeTakeFirst();

  return {
    success: !!(res.numInsertedOrUpdatedRows ?? 0n > 0n),
    id: imageId,
  };
}