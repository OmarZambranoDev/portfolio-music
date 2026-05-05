import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMusicStore } from '../../store/musicStore';
import { usePlaybackProgress } from '../usePlaybackProgress';

describe('usePlaybackProgress', () => {
  beforeEach(async () => {
    useMusicStore.setState({
      currentTrackId: null,
      currentTime: 0,
      isPlaying: false,
      volume: 0.8,
      isMuted: false,
      sortBy: 'title',
      sortDirection: 'asc',
      isLoaded: false,
      loadError: null,
    });
    await useMusicStore.getState().loadTracks();
  });

  describe('track', () => {
    it('should return null when no track is selected', () => {
      const { result } = renderHook(() => usePlaybackProgress());
      expect(result.current.track).toBeNull();
    });

    it('should return the current track', () => {
      const tracks = useMusicStore.getState().allTracks;
      useMusicStore.getState().playTrack(tracks[0].id);

      const { result } = renderHook(() => usePlaybackProgress());
      expect(result.current.track?.id).toBe(tracks[0].id);
    });
  });

  describe('currentTime', () => {
    it('should start at 0', () => {
      const tracks = useMusicStore.getState().allTracks;
      useMusicStore.getState().playTrack(tracks[0].id);

      const { result } = renderHook(() => usePlaybackProgress());
      expect(result.current.currentTime).toBe(0);
    });

    it('should reflect seeked position', () => {
      const tracks = useMusicStore.getState().allTracks;
      useMusicStore.getState().playTrack(tracks[0].id);
      useMusicStore.getState().seek(120);

      const { result } = renderHook(() => usePlaybackProgress());
      expect(result.current.currentTime).toBe(120);
    });
  });

  describe('progressPercent', () => {
    it('should be 0 at start', () => {
      const tracks = useMusicStore.getState().allTracks;
      useMusicStore.getState().playTrack(tracks[0].id);

      const { result } = renderHook(() => usePlaybackProgress());
      expect(result.current.progressPercent).toBe(0);
    });

    it('should reflect position in track', () => {
      const tracks = useMusicStore.getState().allTracks;
      useMusicStore.getState().playTrack(tracks[0].id);

      const halfway = tracks[0].duration / 2;
      useMusicStore.getState().seek(halfway);

      const { result } = renderHook(() => usePlaybackProgress());
      expect(result.current.progressPercent).toBeCloseTo(50, 0);
    });
  });

  describe('handleSeek', () => {
    it('should return a function', () => {
      const { result } = renderHook(() => usePlaybackProgress());
      expect(typeof result.current.handleSeek).toBe('function');
    });
  });
});
