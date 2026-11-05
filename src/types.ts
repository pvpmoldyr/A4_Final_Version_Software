export interface Booking {
  start: number; // minutes from midnight (0–1440)
  end: number;
  title: string;
  bookedBy: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  blockedReason?: string;
  bookings: Booking[];
}

export type Decision = 'available' | 'unavailable';

export interface CheckResult {
  decision: Decision;
  reasons: string[];
}

export interface CandidateInterval {
  room: Room;
  start: number;
  end: number;
  currentTime: number;
}
