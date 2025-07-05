import { Kysely } from 'kysely';
import { Resource } from 'sst';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { type CoffeeTable } from '@rpcTypes/coffee';
import { type ImageTable } from '@rpcTypes/image';
import Database from 'better-sqlite3';
import { type PostTable } from '@rpcTypes/post';

let db: Promise<Kysely<Database>> | null = null;
let marknotesDB: Promise<Kysely<Database>> | null = null;

export function getMarknotesDB(): Promise<Kysely<Database>> {
  if (!marknotesDB) {
    marknotesDB = (async () => {
      const url = await Resource.PetaKopiKV.get('MARKNOTES_DB_URL');
      const authToken = await Resource.PetaKopiKV.get('MARKNOTES_DB_SECRET');

      if (!url || !authToken) {
        throw new Error('Missing MARKNOTES_DB_URL or MARKNOTES_DB_SECRET');
      }

      return new Kysely<Database>({
        dialect: new LibsqlDialect({
          url: url,
          authToken: authToken,
        }),
      });
    })();
  }

  return marknotesDB;
}

export function getDB(): Promise<Kysely<Database>> {
  if (!db) {
    db = (async () => {
      const url = await Resource.PetaKopiKV.get('TURSO_DB_URL');
      const authToken = await Resource.PetaKopiKV.get('TURSO_DB_SECRET');

      if (!url || !authToken) {
        throw new Error('Missing TURSO_DB_URL or TURSO_DB_SECRET');
      }

      return new Kysely<Database>({
        dialect: new LibsqlDialect({
          url: url,
          authToken: authToken,
        }),
      });
    })();
  }

  return db;
}

export interface Database {
  coffees: CoffeeTable;
  images: ImageTable;
  posts: PostTable;
}
