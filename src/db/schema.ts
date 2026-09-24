import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'users' table (Mandatory for Cloud SQL & Firebase Auth setup)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Scrapbook settings, pages, and customized content
export const scrapbooks = pgTable('scrapbooks', {
  id: serial('id').primaryKey(),
  bookKey: text('book_key').notNull().unique(), // default: 'main_book'
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  recipientName: text('recipient_name'),
  senderName: text('sender_name'),
  specialDate: text('special_date'),
  theme: jsonb('theme'),
  pages: jsonb('pages').notNull(),
  songs: jsonb('songs'),
  surpriseQuotes: jsonb('surprise_quotes'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Media library: Fotos, Videos y Audios subidos
export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'image' | 'video' | 'audio'
  url: text('url').notNull(),
  caption: text('caption'),
  size: integer('size'),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Songs library: Música agregada o subida por el usuario
export const songs = pgTable('songs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull().default('local'), // 'local' | 'youtube' | 'spotify' | 'synth'
  duration: text('duration'),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  media: many(media),
  songs: many(songs),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  user: one(users, {
    fields: [media.userId],
    references: [users.id],
  }),
}));

export const songsRelations = relations(songs, ({ one }) => ({
  user: one(users, {
    fields: [songs.userId],
    references: [users.id],
  }),
}));
