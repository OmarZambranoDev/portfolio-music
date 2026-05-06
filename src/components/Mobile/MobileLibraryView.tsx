import { Button } from '@OmarZambranoDev/portfolio-ui';
import { useMusicStore } from '../../store/musicStore';
import { usePlaylistModals } from '../../hooks/usePlaylistModals';
import { useSwipeBack } from '../../hooks/useSwipeBack';
import { PlaylistModal } from '../Library/PlaylistModal';
import { PlaylistView } from '../Library/PlaylistView';
import { AllSongsView } from '../Library/AllSongsView';
import { Music, ListMusic, Plus } from 'lucide-react';

type LibraryView = 'home' | 'allSongs' | 'playlist';
type PlayContext = 'all-songs' | string | null;

interface MobileLibraryViewProps {
  libraryView: LibraryView;
  onLibraryViewChange: (view: LibraryView) => void;
  playContext: PlayContext;
  navigatedFromSearch?: boolean;
  onBackToSearch?: () => void;
}

export function MobileLibraryView({
  libraryView,
  onLibraryViewChange,
  playContext,
  navigatedFromSearch = false,
  onBackToSearch,
}: MobileLibraryViewProps) {
  const { allTracks, playlists, activePlaylistId, setActivePlaylist } = useMusicStore();

  const {
    modalMode,
    playlistName,
    playlistDescription,
    openModal,
    closeModal,
    setPlaylistName,
    setPlaylistDescription,
    handleCreate,
  } = usePlaylistModals();

  const navigateToAllSongs = () => {
    setActivePlaylist(null);
    onLibraryViewChange('allSongs');
  };

  const navigateToPlaylist = (playlistId: string) => {
    setActivePlaylist(playlistId);
    onLibraryViewChange('playlist');
  };

  const navigateHome = () => {
    if (navigatedFromSearch && onBackToSearch) {
      onBackToSearch();
    } else {
      onLibraryViewChange('home');
    }
  };

  const { handleTouchStart, handleTouchEnd } = useSwipeBack(navigateHome);

  // All Songs track list view
  if (libraryView === 'allSongs') {
    return (
      <div className="h-full" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="px-4 pt-4">
          <Button variant="outline" size="sm" onClick={navigateHome}>
            ← {navigatedFromSearch ? 'Search' : 'Library'}
          </Button>
        </div>
        <AllSongsView />
      </div>
    );
  }

  // Playlist view
  if (libraryView === 'playlist' && activePlaylistId) {
    return (
      <div className="min-h-full" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="px-4 pt-4">
          <Button variant="outline" size="sm" onClick={navigateHome}>
            ← {navigatedFromSearch ? 'Search' : 'Library'}
          </Button>
        </div>
        <PlaylistView playlistId={activePlaylistId} />
        <PlaylistModal
          mode={modalMode}
          open={modalMode !== null}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
          playlistName={playlistName}
          onPlaylistNameChange={setPlaylistName}
          playlistDescription={playlistDescription}
          onPlaylistDescriptionChange={setPlaylistDescription}
          onCreate={handleCreate}
        />
      </div>
    );
  }

  // Library home
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-earth-forest mb-4">Library</h1>

        <Button
          variant={playContext === 'all-songs' ? 'primary' : 'outline'}
          size="sm"
          onClick={navigateToAllSongs}
          className={`w-full justify-start gap-3 px-3 py-2 rounded-lg mb-2 ${
            playContext === 'all-songs'
              ? ''
              : 'border-transparent hover:bg-muted/10 text-earth-moss'
          }`}
        >
          <Music className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 text-left">All Songs</span>
          <span className="text-sm">{allTracks.length}</span>
        </Button>

        <div className="flex items-center justify-between mt-4 mb-2 px-2">
          <span className="text-xs font-medium text-earth-moss uppercase tracking-wider">
            Playlists
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal('create')}
            aria-label="Create playlist"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-1">
          {playlists.map((playlist) => (
            <Button
              key={playlist.id}
              variant={playContext === playlist.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => navigateToPlaylist(playlist.id)}
              className={`w-full justify-start gap-3 px-3 py-2 rounded-lg ${
                playContext === playlist.id
                  ? ''
                  : 'border-transparent hover:bg-muted/10 text-earth-moss'
              }`}
            >
              <ListMusic className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left truncate">{playlist.name}</span>
              <span className="text-sm">{playlist.trackIds.length}</span>
            </Button>
          ))}
        </div>
      </div>

      <PlaylistModal
        mode={modalMode}
        open={modalMode !== null}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        playlistName={playlistName}
        onPlaylistNameChange={setPlaylistName}
        playlistDescription={playlistDescription}
        onPlaylistDescriptionChange={setPlaylistDescription}
        onCreate={handleCreate}
      />
    </>
  );
}
