export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverArt: string; // URL to album art
  genre?: string;
  year?: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverArt?: string;
  trackIds: string[];
  createdAt: Date;
  isDefault?: boolean; // true for pre-built playlists like Favorites, Chill Vibes
}
