import { Button } from '@portfolio/ui';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useMusicStore } from '../../store/musicStore';
import { usePlaybackProgress } from '../../hooks/usePlaybackProgress';
import { formatTime } from '../../utils/formatTime';

export function PlaybackBar() {
  const { togglePlay, nextTrack, previousTrack, volume, isMuted, setVolume, toggleMute } =
    useMusicStore();

  const {
    track,
    currentTime,
    progressPercent,
    hoverPosition,
    isDragging,
    seekBarRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseLeave,
  } = usePlaybackProgress();

  const isPlaying = useMusicStore((state) => state.isPlaying);

  if (!track) {
    return (
      <div className="h-20 bg-white border-t border-earth-stone/30 flex items-center justify-center text-earth-moss">
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
            alt={`${track.album} cover art`}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-earth-forest truncate">{track.title}</p>
            <p className="text-xs text-earth-moss truncate">{track.artist}</p>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={previousTrack} aria-label="Previous track">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button variant="outline" size="sm" onClick={nextTrack} aria-label="Next track">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-full max-w-2xl flex items-center gap-3">
            <span className="text-xs text-earth-moss w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div
              ref={seekBarRef}
              className="flex-1 h-6 flex items-center cursor-pointer group relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              role="slider"
              aria-label="Seek track position"
              aria-valuemin={0}
              aria-valuemax={track.duration}
              aria-valuenow={currentTime}
              aria-valuetext={formatTime(currentTime)}
              tabIndex={0}
            >
              <div className="w-full h-1 bg-earth-stone/30 rounded-full relative">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
                {hoverPosition !== null && (
                  <div
                    className="absolute top-0 h-full bg-earth-sage/50 rounded-full"
                    style={{ width: `${hoverPosition}%` }}
                  />
                )}
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full group-hover:opacity-100 transition-opacity"
                style={{
                  left: `${progressPercent}%`,
                  opacity: isDragging ? 1 : undefined,
                }}
              />
            </div>
            <span className="text-xs text-earth-moss w-10">
              -{formatTime(track.duration - currentTime)}
            </span>
          </div>

          {/* Time tooltip */}
          {hoverPosition !== null && track && seekBarRef.current && (
            <div
              className="fixed -translate-x-1/2 px-2 py-0.5 bg-earth-moss text-white font-medium text-xs rounded shadow-sm pointer-events-none z-50"
              style={{
                left:
                  seekBarRef.current.getBoundingClientRect().left +
                  (seekBarRef.current.getBoundingClientRect().width * hoverPosition) / 100,
                top: seekBarRef.current.getBoundingClientRect().top - 22,
              }}
            >
              {formatTime((hoverPosition / 100) * track.duration)}
            </div>
          )}
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
