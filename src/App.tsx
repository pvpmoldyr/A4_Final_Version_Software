import { useMemo, useState } from 'react';
import {
  Clock,
  MapPin,
  Users,
  Ban,
  CalendarDays,
  RotateCcw,
} from 'lucide-react';
import { sampleRooms } from '@/sampleData';
import { filterRooms } from '@/roomFilters';
import {
  DAY_LENGTH_MINUTES,
  MAX_BOOKING_MINUTES,
  checkAvailability,
  formatTime,
  parseTime,
} from '@/availability';
import { DayTimeline } from '@/components/DayTimeline';
import { RoomFilters } from '@/components/RoomFilters';
import { ResultCard } from '@/components/ResultCard';
import type { CheckResult } from '@/types';
import { formatDuration } from '@/timeUtils';

function getNowMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export default function App() {
  const [rooms] = useState(sampleRooms);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<number | null>(null);
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [currentTime, setCurrentTime] = useState(getNowMinutes());
  const [result, setResult] = useState<CheckResult | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const filteredRooms = useMemo(
    () => filterRooms(rooms, { attendees, requiredEquipment }),
    [rooms, attendees, requiredEquipment],
  );

  const selectedRoom = useMemo(
    () => filteredRooms.find((r) => r.id === selectedRoomId) ?? null,
    [filteredRooms, selectedRoomId],
  );

  function clearResult() {
    setResult(null);
    setHasChecked(false);
  }

  function updateFilters(next: { attendees: number | null; requiredEquipment: string[] }) {
    setAttendees(next.attendees);
    setRequiredEquipment(next.requiredEquipment);
    clearResult();
    const stillVisible = filterRooms(rooms, next).some((room) => room.id === selectedRoomId);
    if (!stillVisible) setSelectedRoomId(null);
  }

  function toggleEquipment(item: string) {
    const next = requiredEquipment.includes(item)
      ? requiredEquipment.filter((e) => e !== item)
      : [...requiredEquipment, item];
    updateFilters({ attendees, requiredEquipment: next });
  }

  const startMin = parseTime(startTime);
  const endMin = parseTime(endTime);

  function handleCheck() {
    if (!selectedRoom) return;
    const res = checkAvailability(selectedRoom, startMin, endMin, currentTime);
    setResult(res);
    setHasChecked(true);
  }

  function handleReset() {
    clearResult();
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

            {/* Filters */}
            <RoomFilters
              attendees={attendees}
              selectedEquipment={requiredEquipment}
              onAttendeesChange={(value) => updateFilters({ attendees: value, requiredEquipment })}
              onToggleEquipment={toggleEquipment}
            />

            {/* Room selector */}
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Room
            </label>
            {filteredRooms.length === 0 ? (
              <p className="text-sm text-slate-500 text-center rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 mb-5">
                No rooms match your requirements
              </p>
            ) : (
              <div className="space-y-2 mb-5">
                {filteredRooms.map((room) => {
                  const active = room.id === selectedRoomId;
                  return (
                    <button
                      key={room.id}
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        clearResult();
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
                          {room.equipment.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {room.equipment.map((item) => (
                                <span
                                  key={item}
                                  className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
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
            )}

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
                    clearResult();
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
                    clearResult();
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
                  clearResult();
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
                disabled={!selectedRoom}
                className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold px-4 py-2.5 transition-all shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:hover:bg-slate-300 disabled:active:scale-100"
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
            {hasChecked && result && <ResultCard result={result} />}

            {/* Room schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-800">
                  Today's Schedule
                </h2>
                {selectedRoom?.blocked && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                    <Ban className="w-3.5 h-3.5" /> {selectedRoom.blockedReason}
                  </span>
                )}
              </div>

              {!selectedRoom ? (
                <p className="text-sm text-slate-400 py-6 text-center">
                  Select a room to see its schedule
                </p>
              ) : selectedRoom.blocked ? (
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
              {selectedRoom && !selectedRoom.blocked && selectedRoom.bookings.length > 0 && (
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
