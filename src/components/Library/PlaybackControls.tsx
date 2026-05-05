import { Button } from '@OmarZambranoDev/portfolio-ui';
import { useMusicStore } from '../../store/musicStore';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface PlaybackControlsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PlaybackControls({ size = 'md', className = '' }: PlaybackControlsProps) {
  const { isPlaying, togglePlay, nextTrack, previousTrack } = useMusicStore();

  const iconSizes = {
    sm: { skip: 'w-4 h-4', play: 'w-5 h-5' },
    md: { skip: 'w-4 h-4', play: 'w-5 h-5' },
    lg: { skip: 'w-6 h-6', play: 'w-8 h-8' },
  };

  const buttonSizes = {
    sm: { skip: 'sm' as const, play: 'sm' as const },
    md: { skip: 'sm' as const, play: 'md' as const },
    lg: { skip: 'md' as const, play: 'lg' as const },
  };

  const { skip, play } = iconSizes[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`flex items-center justify-center ${className}`}>
        <Button
          variant="outline"
          size={buttonSizes[size].skip}
          onClick={previousTrack}
          aria-label="Previous track"
        >
          <SkipBack className={skip} />
        </Button>
        <Button
          variant="primary"
          size={buttonSizes[size].play}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className={play} /> : <Play className={play} />}
        </Button>
        <Button
          variant="outline"
          size={buttonSizes[size].skip}
          onClick={nextTrack}
          aria-label="Next track"
        >
          <SkipForward className={skip} />
        </Button>
      </div>
    </div>
  );
}
