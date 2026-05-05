import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ToastProvider } from '@portfolio/ui';
import { useMusicStore } from '../../store/musicStore';
import { usePlaylistModals } from '../usePlaylistModals';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('usePlaylistModals', () => {
  beforeEach(async () => {
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
    await useMusicStore.getState().loadTracks();
  });

  describe('modal state', () => {
    it('should start with modal closed', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });

      expect(result.current.modalMode).toBeNull();
      expect(result.current.selectedTrack).toBeNull();
      expect(result.current.selectedPlaylistId).toBeNull();
      expect(result.current.playlistName).toBe('');
      expect(result.current.playlistDescription).toBe('');
    });

    it('should open create modal', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });

      act(() => {
        result.current.openModal('create');
      });

      expect(result.current.modalMode).toBe('create');
    });

    it('should open add-to-playlist modal with track', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });
      const track = useMusicStore.getState().allTracks[0];

      act(() => {
        result.current.openModal('add-to-playlist', track);
      });

      expect(result.current.modalMode).toBe('add-to-playlist');
      expect(result.current.selectedTrack).toBe(track);
    });

    it('should open delete modal with playlist id', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });
      const playlistId = 'test-playlist-1';

      act(() => {
        result.current.openModal('delete', undefined, playlistId);
      });

      expect(result.current.modalMode).toBe('delete');
      expect(result.current.selectedPlaylistId).toBe(playlistId);
    });

    it('should open rename modal with playlist id and name', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });
      const playlistId = 'test-playlist-1';

      act(() => {
        result.current.openModal('rename', undefined, playlistId, 'Old Name');
      });

      expect(result.current.modalMode).toBe('rename');
      expect(result.current.selectedPlaylistId).toBe(playlistId);
      expect(result.current.playlistName).toBe('Old Name');
    });

    it('should close modal and reset state', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });

      act(() => {
        result.current.openModal('create');
      });
      act(() => {
        result.current.setPlaylistName('Test');
      });
      act(() => {
        result.current.setPlaylistDescription('Desc');
      });
      act(() => {
        result.current.closeModal();
      });

      expect(result.current.modalMode).toBeNull();
      expect(result.current.playlistName).toBe('');
      expect(result.current.playlistDescription).toBe('');
    });
  });

  describe('handleCreate', () => {
    it('should create a playlist and close modal', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });

      act(() => {
        result.current.openModal('create');
      });
      act(() => {
        result.current.setPlaylistName('New Playlist');
      });
      act(() => {
        result.current.setPlaylistDescription('A description');
      });
      act(() => {
        result.current.handleCreate();
      });

      expect(result.current.modalMode).toBeNull();

      const playlists = useMusicStore.getState().playlists;
      const created = playlists.find((p) => p.name === 'New Playlist');
      expect(created).toBeDefined();
      expect(created?.description).toBe('A description');
    });

    it('should not create playlist with empty name', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });
      const playlistCount = useMusicStore.getState().playlists.length;

      act(() => {
        result.current.openModal('create');
      });
      act(() => {
        result.current.setPlaylistName('   ');
      });
      act(() => {
        result.current.handleCreate();
      });

      // Modal should stay open since name is invalid
      expect(result.current.modalMode).toBe('create');
      expect(useMusicStore.getState().playlists.length).toBe(playlistCount);
    });
  });

  describe('handleAddToPlaylist', () => {
    it('should add track to playlist and close modal', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });
      const track = useMusicStore.getState().allTracks[0];
      const playlistId = useMusicStore.getState().createPlaylist('Test');

      act(() => {
        result.current.openModal('add-to-playlist', track);
      });
      act(() => {
        result.current.handleAddToPlaylist(playlistId);
      });

      expect(result.current.modalMode).toBeNull();

      const playlist = useMusicStore.getState().playlists.find((p) => p.id === playlistId);
      expect(playlist?.trackIds).toContain(track.id);
    });
  });

  describe('handleCreateAndAdd', () => {
    it('should create playlist and add track in one step', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });
      const track = useMusicStore.getState().allTracks[0];

      act(() => {
        result.current.openModal('create-and-add', track);
      });
      act(() => {
        result.current.setPlaylistName('Quick Playlist');
      });
      act(() => {
        result.current.handleCreateAndAdd();
      });

      expect(result.current.modalMode).toBeNull();

      const playlists = useMusicStore.getState().playlists;
      const created = playlists.find((p) => p.name === 'Quick Playlist');
      expect(created).toBeDefined();
      expect(created?.trackIds).toContain(track.id);
    });
  });

  describe('handleDelete', () => {
    it('should delete playlist and close modal', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });
      const playlistId = useMusicStore.getState().createPlaylist('To Delete');
      useMusicStore.getState().setActivePlaylist(playlistId);

      act(() => {
        result.current.openModal('delete', undefined, playlistId);
      });
      act(() => {
        result.current.handleDelete();
      });

      expect(result.current.modalMode).toBeNull();
      expect(useMusicStore.getState().activePlaylistId).toBeNull();

      const playlists = useMusicStore.getState().playlists;
      expect(playlists.find((p) => p.id === playlistId)).toBeUndefined();
    });
  });

  describe('handleRename', () => {
    it('should rename playlist and close modal', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });
      const playlistId = useMusicStore.getState().createPlaylist('Old Name');

      act(() => {
        result.current.openModal('rename', undefined, playlistId, 'Old Name');
      });
      act(() => {
        result.current.setPlaylistName('New Name');
      });
      act(() => {
        result.current.handleRename();
      });

      expect(result.current.modalMode).toBeNull();

      const playlist = useMusicStore.getState().playlists.find((p) => p.id === playlistId);
      expect(playlist?.name).toBe('New Name');
    });
  });

  describe('switchToCreateAndAdd', () => {
    it('should switch from add-to-playlist to create-and-add', () => {
      const { result } = renderHook(() => usePlaylistModals(), { wrapper });
      const track = useMusicStore.getState().allTracks[0];

      act(() => {
        result.current.openModal('add-to-playlist', track);
      });
      act(() => {
        result.current.setPlaylistName('Some Name');
      });
      act(() => {
        result.current.switchToCreateAndAdd();
      });

      expect(result.current.modalMode).toBe('create-and-add');
      expect(result.current.playlistName).toBe('');
    });
  });
});
