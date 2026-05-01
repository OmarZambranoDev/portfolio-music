import { useState, useCallback } from 'react';
import { useMusicStore } from '../store/musicStore';
import { Track } from '../types';

export function useTrackActions(onAddToPlaylist?: (track: Track) => void) {
  const { playTrack, togglePlay, currentTrackId, isPlaying } = useMusicStore();
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  const handlePlay = useCallback(
    (trackId: string) => {
      playTrack(trackId);
    },
    [playTrack]
  );

  const handleTogglePlay = useCallback(() => {
    togglePlay();
  }, [togglePlay]);

  const handleDoubleClick = useCallback(
    (track: Track) => {
      playTrack(track.id);
    },
    [playTrack]
  );

  const handleSelect = useCallback((trackId: string) => {
    setSelectedTrackId((prev) => (prev === trackId ? null : trackId));
  }, []);

  const handleAddToPlaylist = useCallback(
    (track: Track) => {
      onAddToPlaylist?.(track);
    },
    [onAddToPlaylist]
  );

  const isCurrentTrack = useCallback(
    (trackId: string) => currentTrackId === trackId,
    [currentTrackId]
  );

  const isSelected = useCallback(
    (trackId: string) => selectedTrackId === trackId,
    [selectedTrackId]
  );

  return {
    handlePlay,
    handleTogglePlay,
    handleDoubleClick,
    handleSelect,
    handleAddToPlaylist,
    isCurrentTrack,
    isSelected,
    isPlaying,
  };
}
