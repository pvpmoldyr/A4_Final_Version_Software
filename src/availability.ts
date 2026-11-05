import type { CheckResult, Room } from './types';

export const MAX_BOOKING_MINUTES = 120;
export const DAY_LENGTH_MINUTES = 1440;

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  // Touching endpoints are allowed, so strict inequality
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Evaluate a candidate booking against all acceptance criteria.
 * This function never mutates room data (AC5).
 */
export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number,
): CheckResult {
  const reasons: string[] = [];

  // Input validation (AC1, AC6): reject empty/NaN times before applying rules
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !Number.isFinite(currentTime)
  ) {
    return {
      decision: 'unavailable',
      reasons: ['Please enter a valid start time, end time and current time.'],
    };
  }

  // AC1: 0 ≤ start < end ≤ 1440 and start must be after current time
  if (start < 0 || end > DAY_LENGTH_MINUTES) {
    reasons.push('Times must fall within the same day (00:00–24:00).');
  }
  if (start >= end) {
    reasons.push('Start time must be earlier than end time.');
  }
  if (start <= currentTime) {
    reasons.push('Start time must be after the current time.');
  }

  // AC2: Reject bookings longer than the maximum booking length
  const duration = end - start;
  if (duration > MAX_BOOKING_MINUTES) {
    reasons.push(`Booking duration is ${duration} min — maximum allowed is ${MAX_BOOKING_MINUTES} min.`);
  }

  // AC3: Reject when room is blocked
  if (room.blocked) {
    reasons.push(room.blockedReason ?? 'This room is currently blocked.');
  }

  // AC4: Reject overlapping intervals (touching endpoints allowed)
  for (const booking of room.bookings) {
    if (overlaps(start, end, booking.start, booking.end)) {
      reasons.push(
        `Overlaps existing booking "${booking.title}" (${formatTime(booking.start)}–${formatTime(booking.end)}).`,
      );
    }
  }

  return {
    decision: reasons.length === 0 ? 'available' : 'unavailable',
    reasons,
  };
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function parseTime(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTimeInput(minutes: number): string {
  return formatTime(minutes);
}
