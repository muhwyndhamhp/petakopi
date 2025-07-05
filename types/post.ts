import { type Selectable } from 'kysely';

export type PostStatus = '' | 'draft' | 'published';

export type PostType = 'article' | 'coffee';

export interface PostTable {
  id: number; // from gorm.Model
  created_at: string; // ISO string
  updated_at: string;
  deleted_at?: string | null;

  title: string;
  abstract: string;
  header_image_url: string;
  content: string;
  encoded_content: string; // template.HTML is rendered HTML string
  markdown_content: string;
  status: PostStatus;
  published_at: string; // ISO string
  slug: string;

  form_meta?: Record<string, any>;
  userId: number;

  type: PostType;
  tags_literal: string;
}

export type Post = Selectable<PostTable>;
