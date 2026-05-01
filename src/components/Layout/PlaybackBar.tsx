import { Button } from '@portfolio/ui';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useMusicStore } from '../../store/musicStore';
import { usePlaybackProgress } from '../../hooks/usePlaybackProgress';
import { formatTime } from '../../utils/formatTime';

export function PlaybackBar() {
  const { togglePlay, nextTrack, previousTrack, volume, isMuted, setVolume, toggleMute } =
    useMusicStore();

  const { track, currentTime, progressPercent, handleSeek } = usePlaybackProgress();

  const isPlaying = useMusicStore((state) => state.isPlaying);

  if (!track) {
    return (
      <div className="h-20 bg-white border-t border-earth-stone/30 flex items-center justify-center text-earth-sage">
        No track selected
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
            alt={track.album}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-earth-forest truncate">{track.title}</p>
            <p className="text-xs text-earth-sage truncate">{track.artist}</p>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={previousTrack}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button variant="primary" size="md" onClick={togglePlay}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button variant="outline" size="sm" onClick={nextTrack}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-full max-w-2xl flex items-center gap-3">
            <span className="text-xs text-earth-sage w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-1 h-1 bg-earth-stone/30 rounded-full cursor-pointer group"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-primary rounded-full relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs text-earth-sage w-10">
              -{formatTime(track.duration - currentTime)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="w-32 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleMute}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-earth-stone/30 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
