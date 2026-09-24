import { db } from './index.ts';
import { scrapbooks, media, songs } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export async function getScrapbook(bookKey = 'main_book') {
  try {
    const result = await db.select().from(scrapbooks).where(eq(scrapbooks.bookKey, bookKey));
    return result[0] || null;
  } catch (error) {
    console.error('Database getScrapbook failed:', error);
    throw new Error('Database getScrapbook failed. Please try again later.', { cause: error });
  }
}

export async function upsertScrapbook(data: {
  bookKey?: string;
  title: string;
  subtitle?: string;
  recipientName?: string;
  senderName?: string;
  specialDate?: string;
  theme?: any;
  pages: any;
  songs?: any;
  surpriseQuotes?: any;
}) {
  try {
    const key = data.bookKey || 'main_book';
    const result = await db.insert(scrapbooks)
      .values({
        bookKey: key,
        title: data.title,
        subtitle: data.subtitle || '',
        recipientName: data.recipientName || '',
        senderName: data.senderName || '',
        specialDate: data.specialDate || '',
        theme: data.theme || {},
        pages: data.pages,
        songs: data.songs || [],
        surpriseQuotes: data.surpriseQuotes || [],
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: scrapbooks.bookKey,
        set: {
          title: data.title,
          subtitle: data.subtitle,
          recipientName: data.recipientName,
          senderName: data.senderName,
          specialDate: data.specialDate,
          theme: data.theme,
          pages: data.pages,
          songs: data.songs,
          surpriseQuotes: data.surpriseQuotes,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database upsertScrapbook failed:', error);
    throw new Error('Database upsertScrapbook failed. Please try again later.', { cause: error });
  }
}

export async function saveMediaItem(item: {
  name: string;
  type: string;
  url: string;
  caption?: string;
  size?: number;
  userId?: number;
}) {
  try {
    const result = await db.insert(media)
      .values({
        name: item.name,
        type: item.type,
        url: item.url,
        caption: item.caption,
        size: item.size,
        userId: item.userId,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database saveMediaItem failed:', error);
    throw new Error('Database saveMediaItem failed. Please try again later.', { cause: error });
  }
}

export async function getMediaItems() {
  try {
    return await db.select().from(media).orderBy(desc(media.createdAt));
  } catch (error) {
    console.error('Database getMediaItems failed:', error);
    throw new Error('Database getMediaItems failed. Please try again later.', { cause: error });
  }
}

export async function saveSongItem(item: {
  title: string;
  artist: string;
  url: string;
  type?: string;
  duration?: string;
  userId?: number;
}) {
  try {
    const result = await db.insert(songs)
      .values({
        title: item.title,
        artist: item.artist,
        url: item.url,
        type: item.type || 'local',
        duration: item.duration || '3:30',
        userId: item.userId,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database saveSongItem failed:', error);
    throw new Error('Database saveSongItem failed. Please try again later.', { cause: error });
  }
}

export async function getSongItems() {
  try {
    return await db.select().from(songs).orderBy(desc(songs.createdAt));
  } catch (error) {
    console.error('Database getSongItems failed:', error);
    throw new Error('Database getSongItems failed. Please try again later.', { cause: error });
  }
}

export async function deleteSongItem(idOrUrl: number | string) {
  try {
    if (typeof idOrUrl === 'number') {
      return await db.delete(songs).where(eq(songs.id, idOrUrl)).returning();
    } else {
      return await db.delete(songs).where(eq(songs.url, idOrUrl)).returning();
    }
  } catch (error) {
    console.error('Database deleteSongItem failed:', error);
    throw new Error('Database deleteSongItem failed. Please try again later.', { cause: error });
  }
}
