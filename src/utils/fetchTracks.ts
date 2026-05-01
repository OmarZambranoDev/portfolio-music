import { Track } from '../types';
import { getFallbackTracks } from './generateMockTracks';

const BILLBOARD_API =
  'https://raw.githubusercontent.com/utkarshkrsingh/Billboard-Scraper-API/main/billboard-hot-100.json';

interface BillboardTrack {
  rank: number;
  title: string;
  artist: string;
  cover?: string;
}

function transformBillboardData(data: BillboardTrack[]): Track[] {
  return data.slice(0, 200).map((item, index) => ({
    id: `track-${String(index + 1).padStart(3, '0')}`,
    title: item.title,
    artist: item.artist,
    album: 'Billboard Hot 100',
    duration: 150 + Math.floor(Math.random() * 120),
    coverArt: item.cover || `https://picsum.photos/seed/${index}/400/400`,
    genre: 'Various',
    year: new Date().getFullYear(),
  }));
}

export async function fetchTracks(): Promise<Track[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(BILLBOARD_API, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`API responded with ${response.status}`);

    const data: BillboardTrack[] = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Empty or invalid data');
    }

    console.log(`✅ Loaded ${Math.min(data.length, 200)} tracks from Billboard API`);
    return transformBillboardData(data);
  } catch (error) {
    console.warn('⚠️ Billboard API unavailable, using fallback tracks:', error);
    console.log('📀 Using 120 hardcoded chart-topping tracks');
    return getFallbackTracks();
  }
}
