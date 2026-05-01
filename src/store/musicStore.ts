import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Track, Playlist } from '../types';
import { getDefaultPlaylistTracks } from '../utils/generateMockTracks';
import { getFallbackTracks } from '../utils/generateMockTracks';

interface MusicStore {
  // Player state
  currentTrackId: string | null;
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;

  // Library state
  allTracks: Track[];
  isLoaded: boolean;
  loadError: string | null;

  // Playlist state
  playlists: Playlist[];
  isSidebarCollapsed: boolean;
  searchQuery: string;
  activePlaylistId: string | null;
  sortBy: 'title' | 'artist' | 'album' | 'duration';
  sortDirection: 'asc' | 'desc';

  // Actions
  loadTracks: () => Promise<void>;
  playTrack: (trackId: string) => void;
  togglePlay: () => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seek: (time: number) => void;
  createPlaylist: (name: string, description?: string) => string;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  renamePlaylist: (playlistId: string, name: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActivePlaylist: (playlistId: string | null) => void;
  setSortBy: (sortBy: MusicStore['sortBy']) => void;
  toggleSortDirection: () => void;

  // Getters
  getCurrentTrack: () => Track | null;
  getActivePlaylist: () => Playlist | null;
  getFilteredTracks: () => Track[];
  getPlaylistTracks: (playlistId: string) => Track[];
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      // Initial player state
      currentTrackId: null,
      currentTime: 0,
      isPlaying: false,
      volume: 0.8,
      isMuted: false,

      // Initial library state
      allTracks: [],
      isLoaded: false,
      loadError: null,

      // Initial playlist state
      playlists: [
        {
          id: 'default-favorites',
          name: 'Favorites',
          description: 'Your favorite tracks',
          trackIds: [],
          createdAt: new Date(),
          isDefault: true,
        },
        {
          id: 'default-chill',
          name: 'Chill Vibes',
          description: 'Relaxing tracks to unwind',
          trackIds: [],
          createdAt: new Date(),
          isDefault: true,
        },
        {
          id: 'default-workout',
          name: 'Workout Mix',
          description: 'High energy tracks for exercise',
          trackIds: [],
          createdAt: new Date(),
          isDefault: true,
        },
      ],
      isSidebarCollapsed: false,
      searchQuery: '',
      activePlaylistId: null,
      sortBy: 'title',
      sortDirection: 'asc',

      // Load tracks
      loadTracks: async () => {
        const { isLoaded } = get();
        if (isLoaded) return;

        try {
          const tracks = getFallbackTracks();
          const defaultTracks = getDefaultPlaylistTracks(tracks);

          set((state) => ({
            allTracks: tracks,
            isLoaded: true,
            loadError: null,
            playlists: state.playlists.map((p) => {
              if (p.id === 'default-chill') {
                return { ...p, trackIds: defaultTracks['default-chill'] || [] };
              }
              if (p.id === 'default-workout') {
                return { ...p, trackIds: defaultTracks['default-workout'] || [] };
              }
              if (p.id === 'default-favorites') {
                return { ...p, trackIds: defaultTracks['default-favorites'] || [] };
              }
              return p;
            }),
          }));
        } catch (error) {
          set({
            isLoaded: true,
            loadError: error instanceof Error ? error.message : 'Failed to load tracks',
          });
        }
      },

      // Playback controls
      playTrack: (trackId) => set({ currentTrackId: trackId, currentTime: 0, isPlaying: true }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      pauseTrack: () => set({ isPlaying: false }),

      nextTrack: () => {
        const { currentTrackId, activePlaylistId, playlists, allTracks } = get();
        const tracks = activePlaylistId
          ? playlists.find((p) => p.id === activePlaylistId)?.trackIds || []
          : allTracks.map((t) => t.id);
        if (!currentTrackId || tracks.length === 0) return;
        const currentIndex = tracks.indexOf(currentTrackId);
        const nextTrackId = tracks[(currentIndex + 1) % tracks.length];
        set({ currentTrackId: nextTrackId, currentTime: 0 });
      },

      previousTrack: () => {
        const { currentTrackId, activePlaylistId, playlists, allTracks } = get();
        const tracks = activePlaylistId
          ? playlists.find((p) => p.id === activePlaylistId)?.trackIds || []
          : allTracks.map((t) => t.id);
        if (!currentTrackId || tracks.length === 0) return;
        const currentIndex = tracks.indexOf(currentTrackId);
        const prevTrackId = tracks[(currentIndex - 1 + tracks.length) % tracks.length];
        set({ currentTrackId: prevTrackId, currentTime: 0 });
      },

      setVolume: (volume) =>
        set({
          volume: Math.max(0, Math.min(1, volume)),
          isMuted: volume === 0 ? true : get().isMuted,
        }),

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      seek: (time) => {
        const track = get().getCurrentTrack();
        if (track) set({ currentTime: Math.max(0, Math.min(time, track.duration)) });
      },

      // Playlist CRUD
      createPlaylist: (name, description) => {
        const id = `playlist-${Date.now()}`;
        set((state) => ({
          playlists: [
            ...state.playlists,
            { id, name, description, trackIds: [], createdAt: new Date() },
          ],
        }));
        return id;
      },

      deletePlaylist: (playlistId) =>
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== playlistId),
          activePlaylistId: state.activePlaylistId === playlistId ? null : state.activePlaylistId,
        })),

      addTrackToPlaylist: (playlistId, trackId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId && !p.trackIds.includes(trackId)
              ? { ...p, trackIds: [...p.trackIds, trackId] }
              : p
          ),
        })),

      removeTrackFromPlaylist: (playlistId, trackId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) } : p
          ),
        })),

      renamePlaylist: (playlistId, name) =>
        set((state) => ({
          playlists: state.playlists.map((p) => (p.id === playlistId ? { ...p, name } : p)),
        })),

      // UI state
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActivePlaylist: (playlistId) => set({ activePlaylistId: playlistId }),
      setSortBy: (sortBy) => set({ sortBy }),
      toggleSortDirection: () =>
        set((state) => ({
          sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
        })),

      // Getters
      getCurrentTrack: () => {
        const { currentTrackId, allTracks } = get();
        return allTracks.find((t) => t.id === currentTrackId) || null;
      },

      getActivePlaylist: () => {
        const { activePlaylistId, playlists } = get();
        return playlists.find((p) => p.id === activePlaylistId) || null;
      },

      getFilteredTracks: () => {
        const { allTracks, searchQuery, sortBy, sortDirection } = get();
        let filtered = allTracks;

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.title.toLowerCase().includes(query) ||
              t.artist.toLowerCase().includes(query) ||
              t.album.toLowerCase().includes(query)
          );
        }

        filtered = [...filtered].sort((a, b) => {
          let comparison = 0;
          if (sortBy === 'title') comparison = a.title.localeCompare(b.title);
          else if (sortBy === 'artist') comparison = a.artist.localeCompare(b.artist);
          else if (sortBy === 'album') comparison = a.album.localeCompare(b.album);
          else if (sortBy === 'duration') comparison = a.duration - b.duration;
          return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },

      getPlaylistTracks: (playlistId) => {
        const { playlists, allTracks } = get();
        const playlist = playlists.find((p) => p.id === playlistId);
        if (!playlist) return [];
        return playlist.trackIds
          .map((id) => allTracks.find((t) => t.id === id))
          .filter((t): t is Track => t !== undefined);
      },
    }),
    {
      name: 'music-player-storage',
      // 🔑 Fix: merge default playlists with persisted user playlists
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<MusicStore>;
        const defaultPlaylists = currentState.playlists.filter((p) => p.isDefault);
        const userPlaylists = (persisted.playlists || []).filter((p: Playlist) => !p.isDefault);
        return {
          ...currentState,
          ...persisted,
          playlists: [...defaultPlaylists, ...userPlaylists],
        };
      },
      partialize: (state) => ({
        currentTrackId: state.currentTrackId,
        currentTime: state.currentTime,
        volume: state.volume,
        isMuted: state.isMuted,
        playlists: state.playlists.filter((p) => !p.isDefault),
        isSidebarCollapsed: state.isSidebarCollapsed,
        sortBy: state.sortBy,
        sortDirection: state.sortDirection,
      }),
    }
  )
);
