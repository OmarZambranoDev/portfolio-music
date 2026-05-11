import { useEffect, useState } from 'react';
import { Button, ToastProvider } from '@OmarZambranoDev/portfolio-ui';
import { useMusicStore } from '../../store/musicStore';
import { MobileLibraryView } from '../Mobile/MobileLibraryView';
import { MobileSearchView } from '../Mobile/MobileSearchView';
import { MobileProfileView } from '../Mobile/MobileProfileView';
import { CondensedPlaybackBar } from '../Mobile/CondensedPlaybackBar';
import { ExpandedPlayer } from '../Mobile/ExpandedPlayer';
import { Library, Search, User } from 'lucide-react';

type MobileTab = 'library' | 'search' | 'profile';
type LibraryView = 'home' | 'allSongs' | 'playlist';
type PlayContext = 'all-songs' | string | null;

export function MobileLayout() {
  const { loadTracks, isLoaded, currentTrackId, setActivePlaylist } = useMusicStore();
  const [activeTab, setActiveTab] = useState<MobileTab>('library');
  const [libraryView, setLibraryView] = useState<LibraryView>('home');
  const [playContext, setPlayContext] = useState<PlayContext>(null);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navigatedFromSearch, setNavigatedFromSearch] = useState(false);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  useEffect(() => {
    const unsubscribe = useMusicStore.subscribe((state, prevState) => {
      if (state.currentTrackId && state.currentTrackId !== prevState.currentTrackId) {
        const { activePlaylistId } = useMusicStore.getState();
        setPlayContext(activePlaylistId || 'all-songs');
      }
    });
    return unsubscribe;
  }, []);

  const handleTabChange = (tab: MobileTab) => {
    setActiveTab(tab);
    setIsPlayerExpanded(false);
  };

  const handleLibraryViewChange = (view: LibraryView) => {
    setLibraryView(view);
    setIsPlayerExpanded(false);
  };

  if (!isLoaded) {
    return (
      <div className="h-screen-dynamic flex items-center justify-center bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-earth-moss">Loading tracks...</p>
        </div>
      </div>
    );
  }

  const handleLibraryTab = () => {
    if (activeTab === 'library' && libraryView !== 'home') {
      setLibraryView('home');
      setIsPlayerExpanded(false);
    } else {
      handleTabChange('library');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'library':
        return (
          <MobileLibraryView
            libraryView={libraryView}
            onLibraryViewChange={handleLibraryViewChange}
            playContext={playContext}
            navigatedFromSearch={navigatedFromSearch}
            onBackToSearch={() => {
              setNavigatedFromSearch(false);
              setActiveTab('search');
            }}
          />
        );
      case 'search':
        return (
          <MobileSearchView
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onNavigateToPlaylist={(playlistId) => {
              setActivePlaylist(playlistId);
              setLibraryView('playlist');
              setNavigatedFromSearch(true);
              setActiveTab('library');
            }}
          />
        );
      case 'profile':
        return <MobileProfileView />;
    }
  };

  return (
    <ToastProvider>
      <div className="h-screen-dynamic flex flex-col bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
        <main className="flex-1 overflow-auto">
          {isPlayerExpanded ? (
            <ExpandedPlayer onClose={() => setIsPlayerExpanded(false)} />
          ) : (
            renderContent()
          )}
        </main>

        {currentTrackId && !isPlayerExpanded && (
          <CondensedPlaybackBar onExpand={() => setIsPlayerExpanded(true)} />
        )}

        <nav className="flex items-center justify-around py-2 px-4 bg-white border-t border-earth-stone/30">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLibraryTab}
            className={`flex-col gap-0.5 px-3 py-1 border-transparent ${
              activeTab === 'library' ? 'text-primary' : 'text-earth-moss'
            }`}
          >
            <Library className="w-5 h-5" />
            <span className="text-xs">Library</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTabChange('search')}
            className={`flex-col gap-0.5 px-3 py-1 border-transparent ${
              activeTab === 'search' ? 'text-primary' : 'text-earth-moss'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTabChange('profile')}
            className={`flex-col gap-0.5 px-3 py-1 border-transparent ${
              activeTab === 'profile' ? 'text-primary' : 'text-earth-moss'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </nav>
      </div>
    </ToastProvider>
  );
}
