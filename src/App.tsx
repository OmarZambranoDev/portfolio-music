import { useEffect } from 'react';
import { ToastProvider, TooltipProvider, useToast } from '@OmarZambranoDev/portfolio-ui';
import { useMusicStore } from './store/musicStore';
import { useIsMobile } from './hooks/useIsMobile';
import { LibrarySidebar } from './components/Layout/LibrarySidebar';
import { PlaybackBar } from './components/Layout/PlaybackBar';
import { AllSongsView } from './components/Library/AllSongsView';
import { PlaylistView } from './components/Library/PlaylistView';
import { MobileLayout } from './components/Layout/MobileLayout';

function AppContent() {
  const activePlaylistId = useMusicStore((state) => state.activePlaylistId);
  const loadTracks = useMusicStore((state) => state.loadTracks);
  const isLoaded = useMusicStore((state) => state.isLoaded);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  useEffect(() => {
    if (isLoaded) {
      toast({
        title: 'Demo mode',
        description:
          'This is a demonstration app. No actual audio plays — track progress is simulated.',
        duration: 6000,
      });
    }
  }, [isLoaded, toast]);

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

  if (isMobile) {
    return <MobileLayout />;
  }

  return (
    <div className="h-screen-dynamic flex flex-col bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
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
  );
}

function App() {
  return (
    <TooltipProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </TooltipProvider>
  );
}

export default App;
