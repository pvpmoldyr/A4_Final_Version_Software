# Smart Campus Room Availability Checker

A small web app for browsing a campus room catalog, filtering rooms by capacity and equipment, and checking whether a room is free for a requested time slot.

## Features

- **Room catalog:** Browse rooms with their capacity, equipment, and bookings for the day.
- **Filtering:** Narrow rooms by minimum capacity (attendees) and by required equipment. A room must have every selected item.
- **Availability check:** Check a chosen room and time interval against the rules AC1-AC6:
  - AC1: Times must be valid, in order, within the day, and not in the past.
  - AC2: A booking can last at most 120 minutes.
  - AC3: Blocked rooms cannot be booked.
  - AC4: Bookings cannot overlap existing ones; back-to-back bookings are allowed.
  - AC5: Checking never changes booking data.
  - AC6: Empty or invalid time input is rejected.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

## Test

```bash
npx vitest run
```

## Type check

```bash
npx tsc --noEmit -p tsconfig.app.json
```

## Project files (`src/`)

- `main.tsx`: Starts the app and mounts it on the page.
- `App.tsx`: The main screen. Holds the filter, room selection, and time state, and wires the components together.
- `index.css`: Global styles and Tailwind setup.
- `vite-env.d.ts`: Type hints for the Vite build tool.
- `types.ts`: Shared data shapes for rooms, bookings, and check results.
- `sampleData.ts`: Sample rooms and the list of equipment options.
- `availability.ts`: Applies rules AC1-AC6 to decide whether a time slot is available, plus time formatting helpers.
- `availability.test.ts`: Tests for the availability rules.
- `roomFilters.ts`: Filters rooms by capacity and required equipment.
- `roomFilters.test.ts`: Tests for the room filters.
- `timeUtils.ts`: Formats durations such as "1 hr 30 min".
- `components/DayTimeline.tsx`: Bar showing the day's bookings and the chosen time slot.
- `components/RoomFilters.tsx`: Attendees input and equipment checkboxes.
- `components/ResultCard.tsx`: Available or Unavailable card with the reasons.
