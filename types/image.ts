import type { Selectable } from 'kysely';
import { custom, object, string } from 'valibot';

export interface ImageTable {
  id: string;
  url: string;
  alt: string;
  coffee_id: string;
}

export type Image = Selectable<ImageTable>;

export const ImageUploadSchema = object({
  id: string(),
  file: custom<File>((v) => v instanceof File, 'Expected a File'),
});
