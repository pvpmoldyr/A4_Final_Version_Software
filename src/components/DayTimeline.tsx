import type { Booking, Decision } from '@/types';
import { DAY_LENGTH_MINUTES, formatTime } from '@/availability';

interface DayTimelineProps {
  bookings: Booking[];
  hasChecked: boolean;
  startMin: number;
  duration: number;
  decision: Decision | null;
}

export function DayTimeline({
  bookings,
  hasChecked,
  startMin,
  duration,
  decision,
}: DayTimelineProps) {
  return (
    <div className="mt-5">
      <p className="text-xs font-medium text-slate-500 mb-2">
        Day Timeline (00:00 → 24:00)
      </p>
      <div className="relative h-6 rounded-full bg-slate-100 overflow-hidden">
        {bookings.map((b, i) => (
          <div
            key={i}
            className="absolute h-full bg-blue-400/70 border-r border-blue-300"
            style={{
              left: `${(b.start / DAY_LENGTH_MINUTES) * 100}%`,
              width: `${((b.end - b.start) / DAY_LENGTH_MINUTES) * 100}%`,
            }}
            title={`${b.title}: ${formatTime(b.start)}–${formatTime(b.end)}`}
          />
        ))}
        {/* Candidate interval marker */}
        {hasChecked && duration > 0 && startMin >= 0 && startMin + duration <= DAY_LENGTH_MINUTES && (
          <div
            className={`absolute h-full border-2 ${
              decision === 'available'
                ? 'border-green-500 bg-green-300/40'
                : 'border-red-500 bg-red-300/40'
            }`}
            style={{
              left: `${(startMin / DAY_LENGTH_MINUTES) * 100}%`,
              width: `${(duration / DAY_LENGTH_MINUTES) * 100}%`,
            }}
          />
        )}
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>00:00</span>
        <span>12:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
}
