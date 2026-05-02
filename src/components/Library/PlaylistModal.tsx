import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@portfolio/ui';
import { Plus } from 'lucide-react';
import { Track, Playlist } from '../../types';

export type PlaylistModalMode =
  | 'create'
  | 'add-to-playlist'
  | 'create-and-add'
  | 'delete'
  | 'rename';

interface PlaylistModalProps {
  mode: PlaylistModalMode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // For 'create' and 'create-and-add'
  playlistName?: string;
  onPlaylistNameChange?: (name: string) => void;
  playlistDescription?: string;
  onPlaylistDescriptionChange?: (desc: string) => void;
  // For 'add-to-playlist'
  playlists?: Playlist[];
  selectedTrack?: Track | null;
  onAddToPlaylist?: (playlistId: string) => void;
  onSwitchToCreateAndAdd?: () => void;
  // For 'delete'
  playlistToDelete?: Playlist | null;
  onDelete?: () => void;
  onRename?: () => void;
  // Common
  onCreate?: () => void;
  onCreateAndAdd?: () => void;
}

export function PlaylistModal({
  mode,
  open,
  onOpenChange,
  playlistName = '',
  onPlaylistNameChange,
  playlistDescription = '',
  onPlaylistDescriptionChange,
  playlists = [],
  selectedTrack,
  onAddToPlaylist,
  onSwitchToCreateAndAdd,
  playlistToDelete,
  onDelete,
  onRename,
  onCreate,
  onCreateAndAdd,
}: PlaylistModalProps) {
  if (!mode) return null;

  const renderContent = () => {
    switch (mode) {
      case 'create':
        return (
          <>
            <ModalHeader>
              <ModalTitle>Create Playlist</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-moss mb-1">Name</label>
                  <input
                    type="text"
                    value={playlistName}
                    onChange={(e) => onPlaylistNameChange?.(e.target.value)}
                    className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="My Playlist"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-moss mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={playlistDescription}
                    onChange={(e) => onPlaylistDescriptionChange?.(e.target.value)}
                    className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    rows={2}
                    placeholder="What's this playlist about?"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onCreate} disabled={!playlistName.trim()}>
                Create
              </Button>
            </ModalFooter>
          </>
        );

      case 'add-to-playlist':
        return (
          <>
            <ModalHeader>
              <ModalTitle>Add to Playlist</ModalTitle>
            </ModalHeader>
            <ModalBody>
              {selectedTrack && (
                <p className="text-sm text-earth-sage mb-3">
                  Adding: <span className="font-medium text-earth-forest">{selectedTrack.title}</span>{' '}
                  by {selectedTrack.artist}
                </p>
              )}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => onAddToPlaylist?.(playlist.id)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-earth-forest">{playlist.name}</span>
                    <span className="text-sm text-earth-sage">{playlist.trackIds.length} tracks</span>
                  </button>
                ))}
                <button
                  onClick={onSwitchToCreateAndAdd}
                  className="w-full text-left px-4 py-3 rounded-lg border-2 border-dashed border-muted hover:border-primary transition-colors flex items-center gap-2 text-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Playlist</span>
                </button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        );

      case 'create-and-add':
        return (
          <>
            <ModalHeader>
              <ModalTitle>Create New Playlist</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-moss mb-1">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    value={playlistName}
                    onChange={(e) => onPlaylistNameChange?.(e.target.value)}
                    className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="My Playlist"
                    autoFocus
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={onSwitchToCreateAndAdd}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onCreateAndAdd} disabled={!playlistName.trim()}>
                Create & Add
              </Button>
            </ModalFooter>
          </>
        );

      case 'delete':
        return (
          <>
            <ModalHeader>
              <ModalTitle>Delete Playlist</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p className="text-earth-moss">
                Are you sure you want to delete &ldquo;{playlistToDelete?.name}&rdquo;? This action
                cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onDelete}>
                Delete
              </Button>
            </ModalFooter>
          </>
        );

      case 'rename':
        return (
          <>
            <ModalHeader>
              <ModalTitle>Rename Playlist</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-moss mb-1">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    value={playlistName}
                    onChange={(e) => onPlaylistNameChange?.(e.target.value)}
                    className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onRename?.();
                    }}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onRename} disabled={!playlistName.trim()}>
                Save
              </Button>
            </ModalFooter>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm">{renderContent()}</ModalContent>
    </Modal>
  );
}
