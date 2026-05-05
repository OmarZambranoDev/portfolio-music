import { Button, SearchBar } from '@portfolio/ui';
import { useMusicStore } from '../../store/musicStore';
import { usePlaylistModals } from '../../hooks/usePlaylistModals';
import { PlaylistModal } from '../Library/PlaylistModal';
import { SearchTrackResult } from './SearchTrackResult';
import { ListMusic } from 'lucide-react';

interface MobileSearchViewProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onNavigateToPlaylist?: (playlistId: string) => void;
}

export function MobileSearchView({ searchQuery, onSearchQueryChange, onNavigateToPlaylist }: MobileSearchViewProps) {
  const { allTracks, playlists, playTrack, currentTrackId, isPlaying, setActivePlaylist } =
    useMusicStore();

  const {
    modalMode,
    playlistName,
    selectedTrack,
    openModal,
    closeModal,
    setPlaylistName,
    handleAddToPlaylist,
    handleCreateAndAdd,
    switchToCreateAndAdd,
  } = usePlaylistModals();

  const filteredPlaylists = searchQuery
    ? playlists.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredTracks = searchQuery
    ? allTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.album.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : [];

  const handlePlay = (trackId: string) => {
    playTrack(trackId);
  };

  return (
    <>
      <div className="p-4">
        <SearchBar
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search tracks, playlists, or artists..."
          variant="default"
          size="md"
        />

        {searchQuery && filteredPlaylists.length === 0 && filteredTracks.length === 0 && (
          <p className="text-earth-moss text-center mt-8">No results found for "{searchQuery}"</p>
        )}

        {/* Playlist results */}
        {filteredPlaylists.length > 0 && (
          <div className="mt-4">
            <h2 className="text-sm font-medium text-earth-moss uppercase tracking-wider mb-2">
              Playlists
            </h2>
            <div className="space-y-1">
              {filteredPlaylists.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActivePlaylist(playlist.id);
                    onNavigateToPlaylist?.(playlist.id);
                  }}
                  className="w-full justify-start gap-3 px-3 py-2 rounded-lg border-transparent hover:bg-muted/10 text-earth-moss"
                >
                  <ListMusic className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{playlist.name}</span>
                  <span className="text-sm">{playlist.trackIds.length} tracks</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Track results */}
        {filteredTracks.length > 0 && (
          <div className="mt-4">
            <h2 className="text-sm font-medium text-earth-moss uppercase tracking-wider mb-2">
              Tracks
            </h2>
            <div className="space-y-0.5">
              {filteredTracks.slice(0, 20).map((track) => (
                <SearchTrackResult
                  key={track.id}
                  track={track}
                  isPlaying={currentTrackId === track.id && isPlaying}
                  onPlay={handlePlay}
                  onAddToPlaylist={(track) => openModal('add-to-playlist', track)}
                />
              ))}
              {filteredTracks.length > 20 && (
                <p className="text-xs text-earth-moss text-center py-2">
                  +{filteredTracks.length - 20} more results. Refine your search.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <PlaylistModal
        mode={modalMode}
        open={modalMode !== null}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        playlists={playlists}
        selectedTrack={selectedTrack}
        playlistName={playlistName}
        onPlaylistNameChange={setPlaylistName}
        onAddToPlaylist={handleAddToPlaylist}
        onSwitchToCreateAndAdd={switchToCreateAndAdd}
        onCreateAndAdd={handleCreateAndAdd}
      />
    </>
  );
}