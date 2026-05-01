import { useEffect } from 'react';
import { ToastProvider } from '@portfolio/ui';
import { useMusicStore } from './store/musicStore';
import { LibrarySidebar } from './components/Layout/LibrarySidebar';
import { PlaybackBar } from './components/Layout/PlaybackBar';
import { AllSongsView } from './components/Library/AllSongsView';
import { PlaylistView } from './components/Library/PlaylistView';

function App() {
  const activePlaylistId = useMusicStore((state) => state.activePlaylistId);
  const loadTracks = useMusicStore((state) => state.loadTracks);
  const isLoaded = useMusicStore((state) => state.isLoaded);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted">Loading tracks...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="h-screen flex flex-col bg-white">
        <div className="flex-1 flex overflow-hidden">
          <LibrarySidebar />
          <main className="flex-1 overflow-auto">
            {activePlaylistId === null ? (
              <AllSongsView />
            ) : (
              <PlaylistView playlistId={activePlaylistId} />
            )}
          </main>
        </div>
        <PlaybackBar />
      </div>
    </ToastProvider>
  );
}

export default App;
