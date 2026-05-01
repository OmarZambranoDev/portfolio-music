import { useState, useCallback } from 'react';
import { useMusicStore } from '../store/musicStore';
import { Track } from '../types';
import { PlaylistModalMode } from '../components/Library/PlaylistModal';

export function usePlaylistModals() {
  const { createPlaylist, addTrackToPlaylist, deletePlaylist, renamePlaylist, setActivePlaylist } =
    useMusicStore();

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
    }
  }, [playlistName, playlistDescription, createPlaylist, closeModal]);

  const handleAddToPlaylist = useCallback(
    (targetPlaylistId: string) => {
      if (selectedTrack) {
        addTrackToPlaylist(targetPlaylistId, selectedTrack.id);
        closeModal();
      }
    },
    [selectedTrack, addTrackToPlaylist, closeModal]
  );

  const handleCreateAndAdd = useCallback(() => {
    if (playlistName.trim() && selectedTrack) {
      const newId = createPlaylist(playlistName.trim());
      addTrackToPlaylist(newId, selectedTrack.id);
      closeModal();
    }
  }, [playlistName, selectedTrack, createPlaylist, addTrackToPlaylist, closeModal]);

  const handleDelete = useCallback(() => {
    if (selectedPlaylistId) {
      deletePlaylist(selectedPlaylistId);
      setActivePlaylist(null);
      closeModal();
    }
  }, [selectedPlaylistId, deletePlaylist, setActivePlaylist, closeModal]);

  const handleRename = useCallback(() => {
    if (selectedPlaylistId && playlistName.trim()) {
      renamePlaylist(selectedPlaylistId, playlistName.trim());
      closeModal();
    }
  }, [selectedPlaylistId, playlistName, renamePlaylist, closeModal]);

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
