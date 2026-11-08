import { describe, expect, it } from 'vitest';
import { checkAvailability } from './availability';
import { filterRooms } from './roomFilters';
import { sampleRooms } from './sampleData';
import type { Room } from './types';

const CURRENT_TIME = 480; // 08:00

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: 'r1',
    name: 'Room 1',
    building: 'A',
    capacity: 20,
    equipment: [],
    blocked: false,
    bookings: [],
    ...overrides,
  };
}

function ids(rooms: Room[]): string[] {
  return rooms.map((room) => room.id);
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value as object).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

describe('F1 - capacity must be at least the attendee count', () => {
  it('F1: a room whose capacity equals the attendee count is kept (40 and 40)', () => {
    const rooms = [makeRoom({ id: 'exact', capacity: 40 })];
    expect(ids(filterRooms(rooms, { attendees: 40, requiredEquipment: [] }))).toEqual(['exact']);
  });

  it('F1: a room whose capacity is one below the attendee count is rejected (40 vs 41)', () => {
    const rooms = [makeRoom({ id: 'small', capacity: 40 })];
    expect(filterRooms(rooms, { attendees: 41, requiredEquipment: [] })).toEqual([]);
  });

  it('F1: attendees null applies no capacity filter', () => {
    const rooms = [makeRoom({ id: 'tiny', capacity: 5 }), makeRoom({ id: 'huge', capacity: 500 })];
    expect(ids(filterRooms(rooms, { attendees: null, requiredEquipment: [] }))).toEqual([
      'tiny',
      'huge',
    ]);
  });
});

describe('F2 - a room must have ALL required equipment', () => {
  it('F2: a room that has every selected item is kept', () => {
    const rooms = [
      makeRoom({ id: 'full', equipment: ['Projector', 'Whiteboard', 'Microphone'] }),
    ];
    expect(
      ids(filterRooms(rooms, { attendees: null, requiredEquipment: ['Projector', 'Whiteboard'] })),
    ).toEqual(['full']);
  });

  it('F2: a room with only one of two selected items is rejected (ALL, not ANY)', () => {
    const rooms = [makeRoom({ id: 'partial', equipment: ['Projector'] })];
    expect(
      filterRooms(rooms, { attendees: null, requiredEquipment: ['Projector', 'Whiteboard'] }),
    ).toEqual([]);
  });

  it('F2: with no equipment selected, every room is kept, including rooms with no equipment', () => {
    const rooms = [
      makeRoom({ id: 'bare', equipment: [] }),
      makeRoom({ id: 'equipped', equipment: ['Computers'] }),
    ];
    expect(ids(filterRooms(rooms, { attendees: null, requiredEquipment: [] }))).toEqual([
      'bare',
      'equipped',
    ]);
  });
});

describe('F4 - no matches', () => {
  it('F4: when nothing matches the filters, the result is an empty array', () => {
    const rooms = [makeRoom({ id: 'a', capacity: 20, equipment: ['Whiteboard'] })];
    expect(
      filterRooms(rooms, { attendees: 500, requiredEquipment: ['Projector'] }),
    ).toEqual([]);
  });
});

describe('F3 - blocked rooms are filtered like any other room', () => {
  it('F3: a blocked room that matches the filters stays in the list and is unavailable to book', () => {
    const blockedRoom = makeRoom({
      id: 'blocked',
      capacity: 30,
      equipment: ['Projector'],
      blocked: true,
      blockedReason: 'Under maintenance',
    });

    const result = filterRooms([blockedRoom], {
      attendees: 20,
      requiredEquipment: ['Projector'],
    });

    expect(ids(result)).toEqual(['blocked']);
    expect(checkAvailability(result[0], 540, 600, CURRENT_TIME).decision).toBe('unavailable');
  });
});

describe('purity - filterRooms does not change its input', () => {
  it('leaves a deeply frozen copy of sampleRooms unchanged and returns a new array', () => {
    const snapshot = structuredClone(sampleRooms);
    const frozenRooms = deepFreeze(structuredClone(sampleRooms));

    const result = filterRooms(frozenRooms, { attendees: 20, requiredEquipment: ['Projector'] });

    expect(result).not.toBe(frozenRooms);
    expect(frozenRooms).toEqual(snapshot);
    expect(sampleRooms).toEqual(snapshot);
  });
});

describe('integration - availability uses each room\'s own bookings', () => {
  it('600-660 is available in room-101 and unavailable in room-104 with sampleRooms', () => {
    const rooms = filterRooms(sampleRooms, { attendees: 1, requiredEquipment: [] });
    const findRoom = (id: string): Room => {
      const room = rooms.find((r) => r.id === id);
      if (!room) throw new Error(`Missing ${id}`);
      return room;
    };

    expect(checkAvailability(findRoom('room-101'), 600, 660, CURRENT_TIME).decision).toBe(
      'available',
    );
    expect(checkAvailability(findRoom('room-104'), 600, 660, CURRENT_TIME).decision).toBe(
      'unavailable',
    );
  });
});
