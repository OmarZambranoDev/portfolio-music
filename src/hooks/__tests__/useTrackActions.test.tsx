import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ToastProvider } from '@OmarZambranoDev/portfolio-ui';
import { useMusicStore } from '../../store/musicStore';
import { useTrackActions } from '../useTrackActions';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('useTrackActions', () => {
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

  describe('handlePlay', () => {
    it('should play a track', () => {
      const { result } = renderHook(() => useTrackActions(), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      act(() => {
        result.current.handlePlay(tracks[0].id);
      });

      const state = useMusicStore.getState();
      expect(state.currentTrackId).toBe(tracks[0].id);
      expect(state.isPlaying).toBe(true);
    });

    it('should start from beginning when playing different track', () => {
      const { result } = renderHook(() => useTrackActions(), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      act(() => {
        result.current.handlePlay(tracks[0].id);
      });

      useMusicStore.getState().seek(30);

      act(() => {
        result.current.handlePlay(tracks[1].id);
      });

      expect(useMusicStore.getState().currentTime).toBe(0);
    });
  });

  describe('handleTogglePlay', () => {
    it('should toggle play/pause', () => {
      const { result } = renderHook(() => useTrackActions(), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      act(() => {
        result.current.handlePlay(tracks[0].id);
      });
      expect(useMusicStore.getState().isPlaying).toBe(true);

      act(() => {
        result.current.handleTogglePlay();
      });
      expect(useMusicStore.getState().isPlaying).toBe(false);

      act(() => {
        result.current.handleTogglePlay();
      });
      expect(useMusicStore.getState().isPlaying).toBe(true);
    });
  });

  describe('handleDoubleClick', () => {
    it('should restart the current track', () => {
      const { result } = renderHook(() => useTrackActions(), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      act(() => {
        result.current.handlePlay(tracks[0].id);
      });

      useMusicStore.getState().seek(60);
      expect(useMusicStore.getState().currentTime).toBe(60);

      act(() => {
        result.current.handleDoubleClick(tracks[0]);
      });

      expect(useMusicStore.getState().currentTrackId).toBe(tracks[0].id);
      expect(useMusicStore.getState().currentTime).toBe(0);
      expect(useMusicStore.getState().isPlaying).toBe(true);
    });

    it('should play a different track on double click', () => {
      const { result } = renderHook(() => useTrackActions(), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      act(() => {
        result.current.handlePlay(tracks[0].id);
      });

      act(() => {
        result.current.handleDoubleClick(tracks[1]);
      });

      expect(useMusicStore.getState().currentTrackId).toBe(tracks[1].id);
      expect(useMusicStore.getState().isPlaying).toBe(true);
    });
  });

  describe('handleSelect', () => {
    it('should select a track', () => {
      const { result } = renderHook(() => useTrackActions(), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      act(() => {
        result.current.handleSelect(tracks[0].id);
      });

      expect(result.current.isSelected(tracks[0].id)).toBe(true);
    });

    it('should deselect when clicking again', () => {
      const { result } = renderHook(() => useTrackActions(), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      act(() => {
        result.current.handleSelect(tracks[0].id);
      });
      expect(result.current.isSelected(tracks[0].id)).toBe(true);

      act(() => {
        result.current.handleSelect(tracks[0].id);
      });
      expect(result.current.isSelected(tracks[0].id)).toBe(false);
    });

    it('should select a different track', () => {
      const { result } = renderHook(() => useTrackActions(), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      act(() => {
        result.current.handleSelect(tracks[0].id);
      });
      expect(result.current.isSelected(tracks[0].id)).toBe(true);

      act(() => {
        result.current.handleSelect(tracks[1].id);
      });
      expect(result.current.isSelected(tracks[0].id)).toBe(false);
      expect(result.current.isSelected(tracks[1].id)).toBe(true);
    });
  });

  describe('isCurrentTrack', () => {
    it('should return true for the current track', () => {
      const { result } = renderHook(() => useTrackActions(), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      act(() => {
        result.current.handlePlay(tracks[0].id);
      });

      expect(result.current.isCurrentTrack(tracks[0].id)).toBe(true);
      expect(result.current.isCurrentTrack(tracks[1].id)).toBe(false);
    });

    it('should return true even when paused', () => {
      const { result } = renderHook(() => useTrackActions(), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      act(() => {
        result.current.handlePlay(tracks[0].id);
      });
      act(() => {
        result.current.handleTogglePlay();
      });

      // isCurrentTrack checks currentTrackId only, not isPlaying
      expect(result.current.isCurrentTrack(tracks[0].id)).toBe(true);
    });
  });

  describe('isPlaying', () => {
    it('should reflect playing state', () => {
      const { result } = renderHook(() => useTrackActions(), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      expect(result.current.isPlaying).toBe(false);

      act(() => {
        result.current.handlePlay(tracks[0].id);
      });
      expect(result.current.isPlaying).toBe(true);

      act(() => {
        result.current.handleTogglePlay();
      });
      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('handleRemove', () => {
    it('should remove a track from playlist with remove context', async () => {
      const playlistId = useMusicStore.getState().createPlaylist('Test Playlist');
      const tracks = useMusicStore.getState().allTracks;
      useMusicStore.getState().addTrackToPlaylist(playlistId, tracks[0].id);

      const { result } = renderHook(
        () => useTrackActions(undefined, { playlistId, playlistName: 'Test Playlist' }),
        { wrapper }
      );

      act(() => {
        result.current.handleRemove(tracks[0].id);
      });

      const playlist = useMusicStore.getState().playlists.find((p) => p.id === playlistId);
      expect(playlist?.trackIds).not.toContain(tracks[0].id);
    });
  });

  describe('handleAddToPlaylist', () => {
    it('should call onAddToPlaylist callback', () => {
      let calledWith: unknown = null;
      const onAddToPlaylist = (track: unknown) => {
        calledWith = track;
      };

      const { result } = renderHook(() => useTrackActions(onAddToPlaylist), { wrapper });
      const tracks = useMusicStore.getState().allTracks;

      act(() => {
        result.current.handleAddToPlaylist(tracks[0]);
      });

      expect(calledWith).toBe(tracks[0]);
    });
  });
});
