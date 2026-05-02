import { useEffect, useRef, useCallback, useState } from 'react';
import { useMusicStore } from '../store/musicStore';

export function usePlaybackProgress() {
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const currentTrackId = useMusicStore((state) => state.currentTrackId);
  const currentTime = useMusicStore((state) => state.currentTime);
  const track = useMusicStore((state) => state.getCurrentTrack());
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);

  const animationRef = useRef<number>();

  useEffect(() => {
    if (isPlaying && track && !isDragging) {
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
  }, [isPlaying, currentTrackId, isDragging]);

  const progressPercent = track ? (currentTime / track.duration) * 100 : 0;

  const calculateTimeFromEvent = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!seekBarRef.current || !track) return null;
      const rect = seekBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = x / rect.width;
      return percent * track.duration;
    },
    [track]
  );

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const time = calculateTimeFromEvent(e);
      if (time !== null) {
        useMusicStore.getState().seek(time);
      }
    },
    [calculateTimeFromEvent]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      const time = calculateTimeFromEvent(e);
      if (time !== null) {
        useMusicStore.getState().seek(time);
      }

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const moveTime = calculateTimeFromEvent(moveEvent);
        if (moveTime !== null) {
          useMusicStore.getState().seek(moveTime);
          // Update hover position so tooltip follows cursor during drag
          if (seekBarRef.current && track) {
            const rect = seekBarRef.current.getBoundingClientRect();
            const x = moveEvent.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            setHoverPosition(Math.max(0, Math.min(percent, 100)));
          }
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        setHoverPosition(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [calculateTimeFromEvent, track]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging && seekBarRef.current && track) {
        const rect = seekBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = (x / rect.width) * 100;
        setHoverPosition(Math.max(0, Math.min(percent, 100)));
      }
    },
    [isDragging, track]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverPosition(null);
  }, []);

  return {
    track,
    currentTime,
    progressPercent,
    hoverPosition,
    isDragging,
    seekBarRef,
    handleSeek,
    handleMouseDown,
    handleMouseMove,
    handleMouseLeave,
  };
}
