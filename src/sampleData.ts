import type { Room } from './types';

export const EQUIPMENT_OPTIONS = ['Projector', 'Whiteboard', 'Microphone', 'Computers', 'Video conferencing'];

export const sampleRooms: Room[] = [
  {
    id: 'room-101',
    name: 'Room 101 — Lecture Hall A',
    building: 'Engineering Block',
    capacity: 120,
    equipment: ['Projector', 'Microphone', 'Whiteboard'],
    blocked: false,
    bookings: [
      { start: 540, end: 600, title: 'Data Structures 101', bookedBy: 'Prof. Chen' },
      { start: 720, end: 780, title: 'Faculty Meeting', bookedBy: 'Dept. Office' },
      { start: 900, end: 960, title: 'Algorithms Seminar', bookedBy: 'Prof. Chen' },
    ],
  },
  {
    id: 'room-102',
    name: 'Room 102 — Lab B',
    building: 'Science Wing',
    capacity: 40,
    equipment: ['Computers', 'Projector', 'Whiteboard'],
    blocked: false,
    bookings: [
      { start: 480, end: 540, title: 'Physics Lab Session', bookedBy: 'Prof. Kumar' },
      { start: 840, end: 900, title: 'Chemistry Practical', bookedBy: 'Prof. Lopez' },
    ],
  },
  {
    id: 'room-103',
    name: 'Room 103 — Seminar Room',
    building: 'Library Tower',
    capacity: 25,
    equipment: ['Projector', 'Video conferencing'],
    blocked: true,
    blockedReason: 'Under maintenance — HVAC repair scheduled.',
    bookings: [],
  },
  {
    id: 'room-104',
    name: 'Room 104 — Auditorium',
    building: 'Main Building',
    capacity: 300,
    equipment: ['Projector', 'Microphone', 'Video conferencing'],
    blocked: false,
    bookings: [
      { start: 600, end: 720, title: 'Guest Lecture: AI Ethics', bookedBy: 'Dean Office' },
      { start: 1020, end: 1140, title: 'Annual Symposium', bookedBy: 'Dean Office' },
    ],
  },
  {
    id: 'room-105',
    name: 'Room 105 — Study Lounge',
    building: 'Student Center',
    capacity: 15,
    equipment: ['Whiteboard'],
    blocked: false,
    bookings: [
      { start: 660, end: 720, title: 'Group Project Meeting', bookedBy: 'Student Council' },
    ],
  },
];
