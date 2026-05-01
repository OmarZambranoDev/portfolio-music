import { useEffect, useRef, useCallback } from 'react';
import { useMusicStore } from '../store/musicStore';

export function usePlaybackProgress() {
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const currentTrackId = useMusicStore((state) => state.currentTrackId);
  const currentTime = useMusicStore((state) => state.currentTime);
  const track = useMusicStore((state) => state.getCurrentTrack());

  const animationRef = useRef<number>();

  useEffect(() => {
    if (isPlaying && track) {
      let lastTimestamp = performance.now();

      const updateTime = (timestamp: number) => {
        const delta = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        const state = useMusicStore.getState();
        const freshTrack = state.getCurrentTrack();
        const newTime = state.currentTime + delta;

        if (freshTrack && newTime >= freshTrack.duration) {
          state.nextTrack();
        } else {
          state.seek(newTime);
        }
        animationRef.current = requestAnimationFrame(updateTime);
      };

      animationRef.current = requestAnimationFrame(updateTime);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [isPlaying, currentTrackId]);

  const progressPercent = track ? (currentTime / track.duration) * 100 : 0;

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!track) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      useMusicStore.getState().seek(percent * track.duration);
    },
    [track]
  );

  return {
    track,
    currentTime,
    progressPercent,
    handleSeek,
  };
}
