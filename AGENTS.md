## Project
Smart Campus room availability checker; one room, fictional data.
## Constraints
Preserve AC1–AC6; no backend, login or booking creation.

AC1: reject start >= end and past requests.
AC2: reject durations longer than 120 minutes.
AC3: reject a blocked room.
AC4: reject overlaps; allow bookings touching only at endpoints.
AC5–AC6: do not mutate booking data; retain clear desktop/mobile feedback.

## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns.
Do not mutate booking fixtures; keep responsive UI feedback.
## Verification
Run existing tests and add focused regression tests.
Report changed files, rationale and test evidence.
