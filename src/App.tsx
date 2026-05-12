import { useEffect } from 'react';
import { ToastProvider, TooltipProvider } from '@OmarZambranoDev/portfolio-ui';
import { useMusicStore } from './store/musicStore';
import { useIsMobile } from './hooks/useIsMobile';
import { LibrarySidebar } from './components/Layout/LibrarySidebar';
import { PlaybackBar } from './components/Layout/PlaybackBar';
import { AllSongsView } from './components/Library/AllSongsView';
import { PlaylistView } from './components/Library/PlaylistView';
import { MobileLayout } from './components/Layout/MobileLayout';

function App() {
  const activePlaylistId = useMusicStore((state) => state.activePlaylistId);
  const loadTracks = useMusicStore((state) => state.loadTracks);
  const isLoaded = useMusicStore((state) => state.isLoaded);
  const isMobile = useIsMobile();

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-earth-moss">Loading tracks...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <TooltipProvider>
        <ToastProvider>
          <MobileLayout />
        </ToastProvider>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <ToastProvider>
        <div className="h-full flex flex-col bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
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
    </TooltipProvider>
  );
}

export default App;
