# Overview

This is a classic Pong game implemented in JavaScript with HTML5 Canvas. The game features a single-player experience where the user controls one paddle against an AI opponent. The game includes scoring, lives system, record tracking, sound effects, and visual polish with a modern purple-pink color scheme.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Single-page application** built with vanilla JavaScript, HTML5, and CSS3
- **Canvas-based rendering** using HTML5 Canvas API for smooth 60fps game graphics
- **Event-driven architecture** with mouse movement and keyboard controls (SPACE to start/restart, ESC to pause)
- **Game loop pattern** for continuous rendering and game state updates
- **Object-oriented design** with a main PongGame class encapsulating all game logic

## Game State Management
- **Persistent record tracking** using localStorage to save high scores across browser sessions
- **Real-time game state** tracking score, lives, and game active status
- **Dynamic ID generation** that updates every 300ms for visual effect
- **DateTime display** that updates every second

## Audio System
- **Web Audio API integration** with preloaded audio elements
- **Base64-encoded audio** for hit sounds, game over sounds, and background music
- **Sound effect triggers** tied to game events (paddle hits, game over)

## Visual Design
- **Responsive CSS layout** with flexbox centering and gradient backgrounds
- **Canvas-based game graphics** with custom color scheme (purple paddles, pink ball)
- **Overlay system** for instructions and game over screens with semi-transparent backgrounds
- **Custom typography** using web fonts from Google Fonts

## Game Logic
- **Physics simulation** for ball movement with collision detection
- **AI paddle behavior** that follows ball movement with realistic constraints
- **Collision system** detecting ball interactions with paddles and boundaries
- **Scoring mechanism** with lives system and game over conditions

# External Dependencies

## Web APIs
- **HTML5 Canvas API** - Core rendering and animation
- **Web Audio API** - Sound effects and background music
- **localStorage API** - Persistent record storage
- **requestAnimationFrame** - Smooth game loop timing

## External Resources
- **Google Fonts** - Arial font family for typography
- **Base64 Audio Data** - Embedded sound effects to avoid external file dependencies

## Browser Requirements
- **Modern web browser** with Canvas and Audio API support
- **Mouse input** for paddle control
- **Keyboard input** for game controls (SPACE, ESC)

Note: The repository also contains a C++ SFML version reference file, but the main implementation is the JavaScript web version.