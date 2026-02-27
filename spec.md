# Specification

## Summary
**Goal:** Build a simple 2D tap/click mobile game called "Tap Blitz" with a 30-second countdown, random shrinking targets, score tracking, and a persistent high score stored on the backend.

**Planned changes:**
- Create a 2D game screen with a dark neon-themed background where circular targets appear at random positions, shrink over ~2 seconds, and disappear if not tapped
- Each successful tap increments the score by 1 with a visible tap feedback effect (burst or color flash)
- Display a live countdown timer (starting at 30s) and current score prominently in the HUD
- Show the all-time high score on both the game HUD and the game-over screen
- On game end, display a game-over screen with the final score, high score, and a restart button
- Backend actor with a query to get the high score and an update to set a new high score, persisted across refreshes
- After each game, if the final score exceeds the stored high score, update it automatically
- Arcade-style neon visual theme: dark background, bold neon accent colors, smooth CSS scale-down animations for targets, large rounded touch-friendly targets
- Layout optimized for mobile portrait screens (375px–430px wide)

**User-visible outcome:** Players can open the game on mobile, tap appearing neon targets to score points within 30 seconds, see their score and high score in real time, and view their final score on a game-over screen with the option to restart. The all-time high score persists across sessions.
