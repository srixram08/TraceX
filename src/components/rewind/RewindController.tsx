import React, { useEffect, useState } from 'react';
import { 
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Clock, Target, Sparkles, Waves
} from 'lucide-react';
import { Incident, Vessel } from '../../types';

interface RewindControllerProps {
  incident: Incident;
  rewindHours: number;
  setRewindHours: (hours: number | ((prev: number) => number)) => void;
  selectedVessel: Vessel | null;
}

export const RewindController: React.FC<RewindControllerProps> = ({
  incident,
  rewindHours,
  setRewindHours,
  selectedVessel,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const maxHours = 8;

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setRewindHours((prev: number) => {
          if (prev >= maxHours) {
            setIsPlaying(false);
            return maxHours;
          }
          return Math.min(maxHours, parseFloat((prev + 0.1 * playbackSpeed).toFixed(2)));
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, maxHours, setRewindHours]);

  const getCalculatedTime = (hoursBack: number) => {
    const baseHour = 6.5; // 06:30 UTC
    let targetHour = baseHour - hoursBack;
    if (targetHour < 0) targetHour += 24;
    const h = Math.floor(targetHour);
    const m = Math.floor((targetHour - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} UTC`;
  };

  const handleStepBack = () => {
    setRewindHours((prev: number) => Math.min(maxHours, parseFloat((prev + 0.5).toFixed(1))));
  };

  const handleStepForward = () => {
    setRewindHours((prev: number) => Math.max(0, parseFloat((prev - 0.5).toFixed(1))));
  };

  const topVessel = incident.vessels[0];
  const isNearReleaseWindow = Math.abs(rewindHours - incident.probableOrigin.estimatedReleaseOffsetHours) <= 0.8;

  return (
    <div className="bg-white dark:bg-slate-900/90 p-4.5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3 relative transition-colors duration-300">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
            <RotateCcw className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
              REWIND THE OCEAN
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800 font-bold">
                SIGNATURE ENGINE
              </span>
            </h3>
            <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mt-0.5">
              Lagrangian Retrograde Advection • Current {incident.currentKnots} kn @ {incident.currentDirectionDeg}°
            </p>
          </div>
        </div>

        {/* Current Scrubbed Time Display */}
        <div className="flex items-center gap-2.5 bg-purple-50 dark:bg-purple-950/60 px-3.5 py-2 rounded-2xl border border-purple-200 dark:border-purple-800 font-mono text-xs sm:text-sm">
          <Clock className="w-4 h-4 text-purple-700 dark:text-purple-400" />
          <div className="text-right">
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {getCalculatedTime(rewindHours)}
            </div>
            <div className="text-[11px] text-purple-800 dark:text-purple-300 font-bold">
              {rewindHours === 0 ? 'T0 (Satellite Pass)' : `T-${rewindHours.toFixed(1)}h (Reverse)`}
            </div>
          </div>
        </div>
      </div>

      {/* Rendezvous Banner when scrubbed to release window */}
      {isNearReleaseWindow && (
        <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/90 border border-purple-300 dark:border-purple-800 flex items-center justify-between text-xs font-mono text-purple-950 dark:text-purple-200 shadow-sm animate-pulse">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-700 dark:text-purple-300 shrink-0" />
            <span>
              ⚠️ <strong className="font-extrabold">{topVessel.name}</strong> intersected probable origin zone during window ({incident.probableOrigin.timeWindowStart} - {incident.probableOrigin.timeWindowEnd})
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
            {topVessel.score.overall}% Match
          </span>
        </div>
      )}

      {/* Scrubber Bar */}
      <div className="space-y-1.5 py-0.5">
        <input
          type="range"
          min="0"
          max={maxHours}
          step="0.1"
          value={rewindHours}
          onChange={(e) => setRewindHours(parseFloat(e.target.value))}
          className="w-full accent-purple-600 dark:accent-purple-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer transition-all"
        />

        {/* Timeline Marks */}
        <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400 font-extrabold">
          <span className={rewindHours === 0 ? 'text-red-600 dark:text-red-400 font-bold' : ''}>T0 (Spill)</span>
          <span className={rewindHours >= 1 && rewindHours < 2 ? 'text-purple-700 dark:text-purple-400 font-bold' : ''}>T-1h</span>
          <span className={rewindHours >= 2 && rewindHours < 3 ? 'text-purple-700 dark:text-purple-400 font-bold' : ''}>T-2h</span>
          <span className={rewindHours >= 3 && rewindHours < 4 ? 'text-purple-700 dark:text-purple-400 font-bold' : ''}>T-3h</span>
          <span className={rewindHours >= 4 && rewindHours < 5 ? 'text-purple-700 dark:text-purple-400 font-bold' : ''}>T-4h ⚠️</span>
          <span className={rewindHours >= 5 && rewindHours < 6 ? 'text-purple-700 dark:text-purple-400 font-bold' : ''}>T-5h</span>
          <span className={rewindHours >= 6 ? 'text-purple-700 dark:text-purple-400 font-bold' : ''}>T-8h</span>
        </div>
      </div>

      {/* Playback Buttons & Speed Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRewindHours(0)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Reset to T0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleStepForward}
            disabled={rewindHours <= 0}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 transition-colors"
            title="Step Forward in Time"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/30 transition-all hover:scale-105"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>Play Reverse Drift</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepBack}
            disabled={rewindHours >= maxHours}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 transition-colors"
            title="Step Backward in Time"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Multipliers */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-mono">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1.5 font-bold">Speed:</span>
          {[1, 2, 5].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2.5 py-1 rounded-xl transition-colors font-bold ${
                playbackSpeed === speed
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
          <Waves className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Dispersion Radius: <strong className="text-slate-900 dark:text-white font-extrabold">{(incident.probableOrigin.radiusKm * (1 + rewindHours * 0.25)).toFixed(1)} km</strong></span>
        </div>
      </div>

    </div>
  );
};
