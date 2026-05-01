import { Track } from '../types';
import { FALLBACK_TRACKS } from './fallbackTracks';

export function getFallbackTracks(): Track[] {
  return FALLBACK_TRACKS.map((track, index) => ({
    ...track,
    id: `track-${String(index + 1).padStart(3, '0')}`,
    coverArt: `https://picsum.photos/seed/${track.artist
      .toLowerCase()
      .replace(/\s/g, '-')}/400/400`,
    genre: track.genre || 'Pop',
  }));
}

export function getDefaultPlaylistTracks(tracks: Track[]): Record<string, string[]> {
  return {
    'default-chill': tracks
      .filter((t) =>
        ['Pop', 'R&B', 'Dance', 'Latin Pop', 'Afrobeats', 'Indie Pop', 'Indie Folk'].includes(
          t.genre || ''
        )
      )
      .slice(0, 12)
      .map((t) => t.id),
    'default-workout': tracks
      .filter((t) =>
        ['Hip Hop', 'Rock', 'Pop Rock', 'Electronic', 'Country Rap', 'Dance'].includes(
          t.genre || ''
        )
      )
      .slice(0, 12)
      .map((t) => t.id),
    'default-favorites': tracks.slice(0, 8).map((t) => t.id),
  };
}
