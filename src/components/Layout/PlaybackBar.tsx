import { Button } from '@OmarZambranoDev/portfolio-ui';
import { useMusicStore } from '../../store/musicStore';
import { usePlaybackProgress } from '../../hooks/usePlaybackProgress';
import { SeekBar } from '../Library/SeekBar';
import { PlaybackControls } from '../Library/PlaybackControls';
import { formatTime } from '../../utils/formatTime';
import { Volume2, VolumeX } from 'lucide-react';

export function PlaybackBar() {
  const { volume, isMuted, setVolume, toggleMute } = useMusicStore();
  const { track, currentTime } = usePlaybackProgress();

  if (!track) {
    return (
      <div className="h-20 bg-white border-t border-earth-stone/30 flex items-center justify-center text-earth-moss">
        Select a track to begin simulated playback
      </div>
    );
  }

  return (
    <div className="h-20 bg-white border-t border-earth-stone/30 px-4">
      <div className="h-full flex items-center gap-4">
        {/* Track info */}
        <div className="w-64 flex items-center gap-3">
          <img
            src={track.coverArt}
            alt={`${track.album} cover art`}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-earth-forest truncate">{track.title}</p>
            <p className="text-xs text-earth-moss truncate">{track.artist}</p>
          </div>
        </div>

        {/* Controls + seek bar */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          <PlaybackControls size="md" className="gap-4" />
          <div className="w-full max-w-2xl flex items-center gap-3">
            <span className="text-xs text-earth-moss w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <SeekBar showTimes={false} showTooltip className="flex-1" touchHeight="h-3" />
            <span className="text-xs text-earth-moss w-10">
              -{formatTime(track.duration - currentTime)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="w-32 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <div className="relative flex-1 h-6 flex items-center cursor-pointer">
            <label htmlFor="volume-slider" className="sr-only">
              Volume
            </label>
            <input
              id="volume-slider"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer bg-earth-stone/30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, #344b33 ${
                  (isMuted ? 0 : volume) * 100
                }%, #c5ae96 ${(isMuted ? 0 : volume) * 100}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
