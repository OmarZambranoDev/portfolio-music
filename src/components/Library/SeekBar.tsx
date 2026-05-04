import { useRef, useCallback, useState } from 'react';
import { useMusicStore } from '../../store/musicStore';
import { usePlaybackProgress } from '../../hooks/usePlaybackProgress';
import { formatTime } from '../../utils/formatTime';

interface SeekBarProps {
  showTimes?: boolean;
  showTooltip?: boolean;
  className?: string;
  touchHeight?: string;
}

export function SeekBar({
  showTimes = true,
  showTooltip = false,
  className = '',
  touchHeight = 'h-8',
}: SeekBarProps) {
  const { track, currentTime, progressPercent } = usePlaybackProgress();
  const seekBarRef = useRef<HTMLDivElement>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculatePercent = useCallback((clientX: number): number | null => {
    if (!seekBarRef.current) return null;
    const rect = seekBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (x / rect.width) * 100;
  }, []);

  const handleSeek = useCallback(
    (clientX: number) => {
      const percent = calculatePercent(clientX);
      if (percent !== null && track) {
        useMusicStore.getState().seek((percent / 100) * track.duration);
        setHoverPosition(percent);
      }
    },
    [calculatePercent, track]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleSeek(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setHoverPosition(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) {
      const percent = calculatePercent(e.clientX);
      setHoverPosition(percent);
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setHoverPosition(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleSeek(e.touches[0].clientX);

    const handleTouchMove = (moveEvent: TouchEvent) => {
      handleSeek(moveEvent.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setHoverPosition(null);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  if (!track) return null;

  return (
    <div className={className}>
      <div
        ref={seekBarRef}
        className={`${touchHeight} flex items-center cursor-pointer relative group`}
        style={{ touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
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

      {/* Time tooltip */}
      {showTooltip && hoverPosition !== null && seekBarRef.current && (
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

      {showTimes && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-earth-moss">{formatTime(currentTime)}</span>
          <span className="text-xs text-earth-moss">
            -{formatTime(track.duration - currentTime)}
          </span>
        </div>
      )}
    </div>
  );
}
