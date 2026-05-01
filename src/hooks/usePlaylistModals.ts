import { useState, useCallback } from 'react';
import { useMusicStore } from '../store/musicStore';
import { useToast } from '@portfolio/ui';
import { Track } from '../types';
import { PlaylistModalMode } from '../components/Library/PlaylistModal';

export function usePlaylistModals() {
  const {
    createPlaylist,
    addTrackToPlaylist,
    deletePlaylist,
    renamePlaylist,
    setActivePlaylist,
    playlists,
  } = useMusicStore();
  const { toast } = useToast();

  const [modalMode, setModalMode] = useState<PlaylistModalMode | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  const openModal = useCallback(
    (mode: PlaylistModalMode, track?: Track, playlistId?: string, currentName?: string) => {
      setModalMode(mode);
      if (track) setSelectedTrack(track);
      if (playlistId) setSelectedPlaylistId(playlistId);
      if (currentName) setPlaylistName(currentName);
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalMode(null);
    setSelectedTrack(null);
    setSelectedPlaylistId(null);
    setPlaylistName('');
    setPlaylistDescription('');
  }, []);

  const handleCreate = useCallback(() => {
    if (playlistName.trim()) {
      createPlaylist(playlistName.trim(), playlistDescription.trim() || undefined);
      closeModal();
      toast({
        title: 'Playlist created',
        description: `"${playlistName.trim()}" has been created`,
        variant: 'success',
      });
    }
  }, [playlistName, playlistDescription, createPlaylist, closeModal, toast]);

  const handleAddToPlaylist = useCallback(
    (targetPlaylistId: string) => {
      if (selectedTrack) {
        addTrackToPlaylist(targetPlaylistId, selectedTrack.id);
        const targetPlaylist = playlists.find((p) => p.id === targetPlaylistId);
        closeModal();
        toast({
          title: 'Track added',
          description: `"${selectedTrack.title}" added to "${targetPlaylist?.name}"`,
          variant: 'success',
        });
      }
    },
    [selectedTrack, addTrackToPlaylist, closeModal, toast, playlists]
  );

  const handleCreateAndAdd = useCallback(() => {
    if (playlistName.trim() && selectedTrack) {
      const newId = createPlaylist(playlistName.trim());
      addTrackToPlaylist(newId, selectedTrack.id);
      closeModal();
      toast({
        title: 'Playlist created & track added',
        description: `"${selectedTrack.title}" added to "${playlistName.trim()}"`,
        variant: 'success',
      });
    }
  }, [playlistName, selectedTrack, createPlaylist, addTrackToPlaylist, closeModal, toast]);

  const handleDelete = useCallback(() => {
    if (selectedPlaylistId) {
      const playlistName = playlists.find((p) => p.id === selectedPlaylistId)?.name;
      deletePlaylist(selectedPlaylistId);
      setActivePlaylist(null);
      closeModal();
      toast({
        title: 'Playlist deleted',
        description: `"${playlistName}" has been deleted`,
        variant: 'success',
      });
    }
  }, [selectedPlaylistId, deletePlaylist, setActivePlaylist, closeModal, toast, playlists]);

  const handleRename = useCallback(() => {
    if (selectedPlaylistId && playlistName.trim()) {
      const oldName = playlists.find((p) => p.id === selectedPlaylistId)?.name;
      renamePlaylist(selectedPlaylistId, playlistName.trim());
      closeModal();
      toast({
        title: 'Playlist renamed',
        description: `"${oldName}" renamed to "${playlistName.trim()}"`,
        variant: 'success',
      });
    }
  }, [selectedPlaylistId, playlistName, renamePlaylist, closeModal, toast, playlists]);

  const switchToCreateAndAdd = useCallback(() => {
    setModalMode('create-and-add');
    setPlaylistName('');
    setPlaylistDescription('');
  }, []);

  return {
    modalMode,
    selectedTrack,
    selectedPlaylistId,
    playlistName,
    playlistDescription,
    openModal,
    closeModal,
    setPlaylistName,
    setPlaylistDescription,
    handleCreate,
    handleAddToPlaylist,
    handleCreateAndAdd,
    handleDelete,
    handleRename,
    switchToCreateAndAdd,
  };
}
