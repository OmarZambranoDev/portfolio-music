import { describe, it, expect, beforeEach } from 'vitest';
import { useMusicStore } from '../musicStore';

describe('musicStore', () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
    useMusicStore.setState({
      currentTrackId: null,
      currentTime: 0,
      isPlaying: false,
      volume: 0.8,
      isMuted: false,
      isSidebarCollapsed: false,
      searchQuery: '',
      activePlaylistId: null,
      sortBy: 'title',
      sortDirection: 'asc',
      isLoaded: false,
      loadError: null,
    });
  });

  describe('loadTracks', () => {
    it('should load fallback tracks and populate default playlists', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const state = useMusicStore.getState();
      expect(state.isLoaded).toBe(true);
      expect(state.allTracks.length).toBeGreaterThan(0);
      expect(state.playlists.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('playback controls', () => {
    it('should play a track', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const firstTrack = useMusicStore.getState().allTracks[0];
      useMusicStore.getState().playTrack(firstTrack.id);

      const state = useMusicStore.getState();
      expect(state.currentTrackId).toBe(firstTrack.id);
      expect(state.isPlaying).toBe(true);
      expect(state.currentTime).toBe(0);
    });

    it('should toggle play/pause', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const firstTrack = useMusicStore.getState().allTracks[0];
      useMusicStore.getState().playTrack(firstTrack.id);
      expect(useMusicStore.getState().isPlaying).toBe(true);

      useMusicStore.getState().togglePlay();
      expect(useMusicStore.getState().isPlaying).toBe(false);

      useMusicStore.getState().togglePlay();
      expect(useMusicStore.getState().isPlaying).toBe(true);
    });

    it('should pause track', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const firstTrack = useMusicStore.getState().allTracks[0];
      useMusicStore.getState().playTrack(firstTrack.id);
      useMusicStore.getState().pauseTrack();

      expect(useMusicStore.getState().isPlaying).toBe(false);
      expect(useMusicStore.getState().currentTrackId).toBe(firstTrack.id);
    });

    it('should navigate to next track', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const tracks = useMusicStore.getState().getFilteredTracks();
      useMusicStore.getState().playTrack(tracks[0].id);
      useMusicStore.getState().nextTrack();

      expect(useMusicStore.getState().currentTrackId).toBe(tracks[1].id);
      expect(useMusicStore.getState().currentTime).toBe(0);
    });

    it('should navigate to previous track', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const tracks = useMusicStore.getState().getFilteredTracks();
      useMusicStore.getState().playTrack(tracks[1].id);
      useMusicStore.getState().previousTrack();

      expect(useMusicStore.getState().currentTrackId).toBe(tracks[0].id);
    });

    it('should wrap to last track on previous from first', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const tracks = useMusicStore.getState().getFilteredTracks();
      useMusicStore.getState().playTrack(tracks[0].id);
      useMusicStore.getState().previousTrack();

      expect(useMusicStore.getState().currentTrackId).toBe(tracks[tracks.length - 1].id);
    });

    it('should wrap to first track on next from last', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const tracks = useMusicStore.getState().getFilteredTracks();
      useMusicStore.getState().playTrack(tracks[tracks.length - 1].id);
      useMusicStore.getState().nextTrack();

      expect(useMusicStore.getState().currentTrackId).toBe(tracks[0].id);
    });
  });

  describe('volume', () => {
    it('should set volume within bounds', () => {
      useMusicStore.getState().setVolume(0.5);
      expect(useMusicStore.getState().volume).toBe(0.5);

      useMusicStore.getState().setVolume(1.5);
      expect(useMusicStore.getState().volume).toBe(1);

      useMusicStore.getState().setVolume(-0.5);
      expect(useMusicStore.getState().volume).toBe(0);
    });

    it('should unmute when setting volume above 0', () => {
      useMusicStore.getState().setVolume(0);
      expect(useMusicStore.getState().isMuted).toBe(true);

      useMusicStore.getState().setVolume(0.5);
      expect(useMusicStore.getState().isMuted).toBe(false);
    });

    it('should mute when setting volume to 0', () => {
      useMusicStore.getState().setVolume(0.5);
      useMusicStore.getState().setVolume(0);
      expect(useMusicStore.getState().isMuted).toBe(true);
    });

    it('should toggle mute while preserving volume', () => {
      useMusicStore.getState().setVolume(0.7);
      useMusicStore.getState().toggleMute();
      expect(useMusicStore.getState().isMuted).toBe(true);
      expect(useMusicStore.getState().volume).toBe(0.7);

      useMusicStore.getState().toggleMute();
      expect(useMusicStore.getState().isMuted).toBe(false);
      expect(useMusicStore.getState().volume).toBe(0.7);
    });
  });

  describe('seek', () => {
    it('should seek to a position', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const firstTrack = useMusicStore.getState().allTracks[0];
      useMusicStore.getState().playTrack(firstTrack.id);
      useMusicStore.getState().seek(60);

      expect(useMusicStore.getState().currentTime).toBe(60);
    });

    it('should clamp seek to track duration', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const firstTrack = useMusicStore.getState().allTracks[0];
      useMusicStore.getState().playTrack(firstTrack.id);
      useMusicStore.getState().seek(9999);

      expect(useMusicStore.getState().currentTime).toBe(firstTrack.duration);
    });

    it('should clamp seek to 0', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const firstTrack = useMusicStore.getState().allTracks[0];
      useMusicStore.getState().playTrack(firstTrack.id);
      useMusicStore.getState().seek(-100);

      expect(useMusicStore.getState().currentTime).toBe(0);
    });
  });

  describe('playlists', () => {
    it('should create a playlist', () => {
      const id = useMusicStore.getState().createPlaylist('Test Playlist', 'A test');
      const state = useMusicStore.getState();

      const playlist = state.playlists.find((p) => p.id === id);
      expect(playlist).toBeDefined();
      expect(playlist?.name).toBe('Test Playlist');
      expect(playlist?.description).toBe('A test');
      expect(playlist?.trackIds).toEqual([]);
    });

    it('should delete a playlist', () => {
      const id = useMusicStore.getState().createPlaylist('To Delete');
      useMusicStore.getState().deletePlaylist(id);

      const state = useMusicStore.getState();
      expect(state.playlists.find((p) => p.id === id)).toBeUndefined();
    });

    it('should rename a playlist', () => {
      const id = useMusicStore.getState().createPlaylist('Old Name');
      useMusicStore.getState().renamePlaylist(id, 'New Name');

      const state = useMusicStore.getState();
      const playlist = state.playlists.find((p) => p.id === id);
      expect(playlist?.name).toBe('New Name');
    });

    it('should add a track to a playlist', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const trackId = useMusicStore.getState().allTracks[0].id;
      const playlistId = useMusicStore.getState().createPlaylist('Test');
      useMusicStore.getState().addTrackToPlaylist(playlistId, trackId);

      const playlist = useMusicStore.getState().playlists.find((p) => p.id === playlistId);
      expect(playlist?.trackIds).toContain(trackId);
    });

    it('should not add duplicate tracks', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const trackId = useMusicStore.getState().allTracks[0].id;
      const playlistId = useMusicStore.getState().createPlaylist('Test');
      useMusicStore.getState().addTrackToPlaylist(playlistId, trackId);
      useMusicStore.getState().addTrackToPlaylist(playlistId, trackId);

      const playlist = useMusicStore.getState().playlists.find((p) => p.id === playlistId);
      expect(playlist?.trackIds.length).toBe(1);
    });

    it('should remove a track from a playlist', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const trackId = useMusicStore.getState().allTracks[0].id;
      const playlistId = useMusicStore.getState().createPlaylist('Test');
      useMusicStore.getState().addTrackToPlaylist(playlistId, trackId);
      useMusicStore.getState().removeTrackFromPlaylist(playlistId, trackId);

      const playlist = useMusicStore.getState().playlists.find((p) => p.id === playlistId);
      expect(playlist?.trackIds).not.toContain(trackId);
    });

    it('should clear active playlist when deleted', () => {
      const id = useMusicStore.getState().createPlaylist('Active');
      useMusicStore.getState().setActivePlaylist(id);
      useMusicStore.getState().deletePlaylist(id);

      expect(useMusicStore.getState().activePlaylistId).toBeNull();
    });

    it('should have default playlists', () => {
      const state = useMusicStore.getState();
      const defaultPlaylists = state.playlists.filter((p) => p.isDefault);
      expect(defaultPlaylists.length).toBe(3);
      expect(defaultPlaylists.map((p) => p.name)).toContain('Favorites');
      expect(defaultPlaylists.map((p) => p.name)).toContain('Chill Vibes');
      expect(defaultPlaylists.map((p) => p.name)).toContain('Workout Mix');
    });
  });

  describe('search and sort', () => {
    it('should set search query', () => {
      useMusicStore.getState().setSearchQuery('test');
      expect(useMusicStore.getState().searchQuery).toBe('test');
    });

    it('should filter tracks by search query', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const allTracks = useMusicStore.getState().allTracks;
      const targetTrack = allTracks[0];

      useMusicStore.getState().setSearchQuery(targetTrack.title);
      const filtered = useMusicStore.getState().getFilteredTracks();
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered[0].title).toBe(targetTrack.title);
    });

    it('should sort by title ascending', () => {
      useMusicStore.getState().setSortBy('title');
      useMusicStore.setState({ sortDirection: 'asc' });

      const tracks = useMusicStore.getState().getFilteredTracks();
      for (let i = 1; i < tracks.length; i++) {
        expect(tracks[i].title.localeCompare(tracks[i - 1].title)).toBeGreaterThanOrEqual(0);
      }
    });

    it('should sort by duration descending', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      useMusicStore.getState().setSortBy('duration');
      useMusicStore.setState({ sortDirection: 'desc' });

      const tracks = useMusicStore.getState().getFilteredTracks();
      for (let i = 1; i < tracks.length; i++) {
        expect(tracks[i].duration).toBeLessThanOrEqual(tracks[i - 1].duration);
      }
    });

    it('should toggle sort direction', () => {
      useMusicStore.setState({ sortDirection: 'asc' });
      useMusicStore.getState().toggleSortDirection();
      expect(useMusicStore.getState().sortDirection).toBe('desc');

      useMusicStore.getState().toggleSortDirection();
      expect(useMusicStore.getState().sortDirection).toBe('asc');
    });
  });

  describe('sidebar', () => {
    it('should toggle sidebar collapsed state', () => {
      useMusicStore.getState().setSidebarCollapsed(true);
      expect(useMusicStore.getState().isSidebarCollapsed).toBe(true);

      useMusicStore.getState().setSidebarCollapsed(false);
      expect(useMusicStore.getState().isSidebarCollapsed).toBe(false);
    });
  });

  describe('getCurrentTrack', () => {
    it('should return null when no track is selected', () => {
      expect(useMusicStore.getState().getCurrentTrack()).toBeNull();
    });

    it('should return the current track', async () => {
      const store = useMusicStore.getState();
      await store.loadTracks();

      const firstTrack = useMusicStore.getState().allTracks[0];
      useMusicStore.getState().playTrack(firstTrack.id);

      const current = useMusicStore.getState().getCurrentTrack();
      expect(current).toBeDefined();
      expect(current?.id).toBe(firstTrack.id);
    });
  });
});
