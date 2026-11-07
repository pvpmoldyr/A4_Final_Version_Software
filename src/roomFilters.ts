import type { Room } from './types';

export function filterRooms(
  rooms: Room[],
  criteria: { attendees: number | null; requiredEquipment: string[] },
): Room[] {
  const { attendees, requiredEquipment } = criteria;

  return rooms.filter(
    (room) =>
      (attendees === null || room.capacity >= attendees) &&
      requiredEquipment.every((item) => room.equipment.includes(item)),
  );
}
