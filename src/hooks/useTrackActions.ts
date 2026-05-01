import { useState, useCallback } from 'react';
import { useMusicStore } from '../store/musicStore';
import { useToast } from '@portfolio/ui';
import { Track } from '../types';

export function useTrackActions(
  onAddToPlaylist?: (track: Track) => void,
  removeContext?: { playlistId: string; playlistName: string }
) {
  const { playTrack, togglePlay, currentTrackId, isPlaying, removeTrackFromPlaylist } =
    useMusicStore();
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleRemove = useCallback(
    (trackId: string) => {
      if (!removeContext) return;
      const track = useMusicStore.getState().allTracks.find((t) => t.id === trackId);
      removeTrackFromPlaylist(removeContext.playlistId, trackId);
      if (track) {
        toast({
          title: 'Track removed',
          description: `"${track.title}" removed from "${removeContext.playlistName}"`,
          variant: 'success',
        });
      }
    },
    [removeContext, removeTrackFromPlaylist, toast]
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
    handleRemove,
    isCurrentTrack,
    isSelected,
    isPlaying,
  };
}
