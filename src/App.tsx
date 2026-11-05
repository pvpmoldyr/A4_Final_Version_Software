import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Users,
  Ban,
  CalendarDays,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { sampleRooms } from '@/sampleData';
import {
  DAY_LENGTH_MINUTES,
  MAX_BOOKING_MINUTES,
  checkAvailability,
  formatTime,
  parseTime,
} from '@/availability';
import { DayTimeline } from '@/components/DayTimeline';
import type { CheckResult } from '@/types';

function getNowMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export default function App() {
  const [rooms] = useState(sampleRooms);
  const [selectedRoomId, setSelectedRoomId] = useState(sampleRooms[0].id);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [currentTime, setCurrentTime] = useState(getNowMinutes());
  const [result, setResult] = useState<CheckResult | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) ?? rooms[0],
    [rooms, selectedRoomId],
  );

  const startMin = parseTime(startTime);
  const endMin = parseTime(endTime);

  function handleCheck() {
    const res = checkAvailability(selectedRoom, startMin, endMin, currentTime);
    setResult(res);
    setHasChecked(true);
  }

  function handleReset() {
    setResult(null);
    setHasChecked(false);
    setStartTime('10:00');
    setEndTime('11:00');
    setCurrentTime(getNowMinutes());
  }

  const duration = endMin - startMin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shrink-0">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">
              Smart Campus Room Availability Checker
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Find and verify available rooms for your next session.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Form */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Booking Request
            </h2>

            {/* Room selector */}
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Room
            </label>
            <div className="space-y-2 mb-5">
              {rooms.map((room) => {
                const active = room.id === selectedRoomId;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      setHasChecked(false);
                      setResult(null);
                    }}
                    className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                      active
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {room.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {room.building}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {room.capacity}
                          </span>
                        </div>
                      </div>
                      {room.blocked && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                          <Ban className="w-3 h-3" /> Blocked
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Time inputs */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setHasChecked(false);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setHasChecked(false);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Current time */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Current Time (simulation)
              </label>
              <input
                type="time"
                value={formatTime(currentTime)}
                onChange={(e) => {
                  setCurrentTime(parseTime(e.target.value));
                  setHasChecked(false);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Defaults to now — adjust to test edge cases.
              </p>
            </div>

            {/* Duration preview */}
            <div className="mb-5 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Requested duration</span>
                <span
                  className={`font-semibold ${
                    duration > MAX_BOOKING_MINUTES || duration <= 0
                      ? 'text-red-600'
                      : 'text-slate-800'
                  }`}
                >
                  {duration > 0 ? formatDuration(duration) : '—'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCheck}
                className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold px-4 py-2.5 transition-all shadow-sm"
              >
                Check Availability
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600 text-sm font-medium px-4 py-2.5 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </section>

          {/* Right: Result + Schedule */}
          <section className="lg:col-span-3 space-y-6">
            {/* Decision card */}
            {hasChecked && result && (
              <div
                className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                  result.decision === 'available'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.decision === 'available' ? (
                    <CheckCircle2 className="w-7 h-7 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <h3
                      className={`text-lg font-bold ${
                        result.decision === 'available'
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}
                    >
                      {result.decision === 'available'
                        ? 'Available — this time slot is free'
                        : 'Unavailable — this request cannot be booked'}
                    </h3>
                    {result.reasons.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {result.reasons.map((reason, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-red-700"
                          >
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        <p className="mt-1 text-sm text-green-700">
                          No conflicts detected. The room is free during the
                          selected interval and all rules are satisfied.
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          This is a check only; no booking is saved.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Room schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-800">
                  Today's Schedule
                </h2>
                {selectedRoom.blocked && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                    <Ban className="w-3.5 h-3.5" /> {selectedRoom.blockedReason}
                  </span>
                )}
              </div>

              {selectedRoom.blocked ? (
                <p className="text-sm text-slate-400 py-6 text-center">
                  This room is blocked and cannot be booked.
                </p>
              ) : selectedRoom.bookings.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">
                  No existing bookings for this room today.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {[...selectedRoom.bookings]
                    .sort((a, b) => a.start - b.start)
                    .map((b, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3"
                      >
                        <div className="w-1 h-10 rounded-full bg-blue-500 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {b.title}
                          </p>
                          <p className="text-xs text-slate-500">by {b.bookedBy}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-slate-700 tabular-nums">
                            {formatTime(b.start)}–{formatTime(b.end)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatDuration(b.end - b.start)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Timeline visualization */}
              {!selectedRoom.blocked && selectedRoom.bookings.length > 0 && (
                <DayTimeline
                  bookings={selectedRoom.bookings}
                  hasChecked={hasChecked}
                  startMin={startMin}
                  duration={duration}
                  decision={result?.decision ?? null}
                />
              )}
            </div>

            {/* Rules reference */}
            <div className="bg-slate-800 rounded-2xl p-5 sm:p-6 text-slate-300">
              <h2 className="text-sm font-semibold text-white mb-3">
                Booking Rules
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-mono">AC1</span>
                  Interval must satisfy 0 ≤ start &lt; end ≤ {DAY_LENGTH_MINUTES}, and start must be after the current time.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-mono">AC2</span>
                  Bookings may not exceed {MAX_BOOKING_MINUTES} minutes in duration.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-mono">AC3</span>
                  Blocked rooms cannot be booked.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-mono">AC4</span>
                  No overlap with existing bookings; touching endpoints are allowed.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
