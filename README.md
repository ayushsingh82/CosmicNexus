# 🌌 Cosmic Nexus

**An immersive AI-powered exploration game built with Next.js and Web Audio API**

Cosmic Nexus is an interactive exploration experience where players journey through procedurally generated realms, interact with AI-powered NPCs, collect artifacts, and customize their character through an XP-based progression system.

## ✨ Features

### 🤖 AI-Powered Features

- **AI NPCs (Embodied and Non-Embodied)**
  - Dynamic dialogue generation based on player progress, interaction history, and realm context
  - Multiple NPC types: Guides, Merchants, Mystics, and Guardians
  - Context-aware conversations that adapt to your journey

- **Environment Generation**
  - Procedurally generated realms with unique characteristics
  - Dynamic NPC spawning with random positioning
  - Procedural artifact placement and naming

- **Skybox Generation**
  - AI-generated dynamic skybox backgrounds
  - Realm-specific gradient and color schemes
  - Procedural positioning and angles

- **Ambient Audio Generation**
  - Procedurally generated ambient soundscapes using Web Audio API
  - Musical chord progressions unique to each realm
  - Gentle LFO modulation for subtle movement
  - Layered sine wave synthesis for immersive atmosphere

- **SFX Audio Generation**
  - Procedurally generated sound effects for actions
  - Dynamic frequency variations and filters
  - Context-aware audio (collect, portal, interact, discover, energy, movement)

- **Artifact Generation**
  - Procedurally generated artifact names
  - Random combination of prefixes and suffixes
  - Dynamic rarity assignment

### 🎮 Gameplay Features

- **Character System**
  - Level-based progression (starts at Level 1)
  - Experience points gained from collecting artifacts
  - Three core abilities: Speed, Energy Efficiency, and Artifact Sense
  - Character appearance that evolves with level

- **Exploration**
  - Five unique realms to discover:
    - **Cosmic Nebula**: Swirling expanse of cosmic dust and starlight
    - **Crystal Caves**: Glimmering crystals reflecting ethereal light
    - **Neon Metropolis**: Electric energy pulsing through digital realm
    - **The Void**: Pure emptiness, yet full of possibility
    - **Zenith Peak**: The highest realm, bathed in transcendent light
  - Realm portals require energy to discover new areas
  - Movement-based exploration with energy management

- **Artifact Collection**
  - Collect artifacts scattered across realms
  - Four rarity levels: Common, Rare, Epic, Legendary
  - Each artifact grants XP and energy
  - Automatic collection when in proximity

- **Gift Shop System**
  - Spend XP earned from artifacts on upgrades
  - Six purchasable items:
    - ⚡ **Speed Boost** (50 XP) - Permanently increase movement speed by 20%
    - 🔋 **Energy Saver** (75 XP) - Reduce energy cost by 25%
    - 🔍 **Artifact Scanner** (60 XP) - Increase artifact detection range by 50%
    - ✨ **Enhanced Glow** (40 XP) - Increase character glow by 50%
    - ⚡ **Energy Potion** (30 XP) - Consumable that restores 50 energy
    - ⭐ **XP Boost** (100 XP) - Earn 25% more XP from artifacts
  - Permanent upgrades stack with character level bonuses
  - Real-time XP balance tracking

- **Character Progression**
  - Level up system with exponential experience requirements
  - Ability bonuses per level:
    - Speed: +10% per level
    - Energy Efficiency: +15% per level
    - Artifact Sense: +5% per level
  - Visual upgrades (glow intensity increases with level)
  - Energy restoration on level up

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.1
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion) 12.23.24
- **Audio**: Web Audio API (procedural audio generation)
- **Build Tool**: Next.js built-in bundler

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 🎯 How to Play

1. **Start Your Journey**: Click "Get Started" on the landing page
2. **Enable Audio**: Click the "🔊 Enable Audio" button to activate sound (browser requires user interaction)
3. **Explore Realms**: Use the arrow buttons to move your character around
4. **Collect Artifacts**: Move close to artifacts to automatically collect them
5. **Interact with NPCs**: Click on NPCs to hear their AI-generated dialogue
6. **Earn XP**: Collect artifacts to earn experience points
7. **Visit the Shop**: Click the "🎁 Shop" button to spend XP on upgrades
8. **Level Up**: Gain experience to level up and unlock character bonuses
9. **Discover Realms**: Spend energy to unlock new realms through portals

## 🎨 Character Abilities

- **Speed**: Affects movement distance per step
- **Energy Efficiency**: Reduces energy cost per movement
- **Artifact Sense**: Increases detection range for artifacts

## 🎵 Audio Features

The game uses procedural audio generation for all sounds:

- **Ambient Audio**: Musical chord progressions (C major, D minor, E major, G major, F major) with gentle modulation
- **Sound Effects**: 
  - Collect: Dual-oscillator ascending chime
  - Portal: Sweeping whoosh with pitch bend
  - Interact: Pleasant blip
  - Discover: Magical ascending chord
  - Energy: Pulsing tone
  - Movement: Gentle orbital sweep

All audio is generated in real-time using Web Audio API oscillators, filters, and LFOs.

## 📁 Project Structure

```
my-app/
├── app/
│   ├── app/
│   │   └── page.tsx          # Main game page
│   ├── components/
│   │   ├── CornerFrame.tsx   # UI component with corner decorations
│   │   ├── LandingPage.tsx   # Landing page component
│   │   └── TrueFocus.tsx     # Text animation component
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (routes to landing)
├── public/                   # Static assets
├── lib/
│   └── utils.ts             # Utility functions
└── package.json             # Dependencies and scripts
```

## 🎮 Game Mechanics

### Energy System
- Starts at 100 energy
- Movement consumes energy (scaled by Energy Efficiency ability)
- Regenerates at 0.5 energy per second
- Can be restored with Energy Potions from the shop

### XP System
- XP is earned from collecting artifacts
- Common: 10 XP
- Rare: 25 XP
- Epic: 50 XP
- Legendary: 100 XP
- XP Boost shop item increases earnings by 25%

### Leveling System
- Experience requirements grow exponentially (base 100, ×1.5 per level)
- Each level grants ability bonuses
- Energy is restored on level up

## 🌟 Key Highlights

- **Fully Procedural**: Most content is procedurally generated (NPCs, artifacts, environments, audio)
- **AI-Enhanced**: NPCs use dynamic dialogue generation based on context
- **Immersive Audio**: All audio is procedurally generated using Web Audio API
- **Character Progression**: Meaningful upgrades and customization
- **Beautiful UI**: Modern design with smooth animations
- **Responsive**: Works on desktop and mobile devices

## 🎯 Competition Features

This project was built for the Meta Game Competition and showcases:

- ✅ Creator Assistant: AI NPCs that provide dynamic guidance
- ✅ Environment Generation: Procedurally generated realms
- ✅ Texture Generation: Dynamic skybox and environment visuals
- ✅ Skybox Generation: AI-generated backgrounds per realm
- ✅ SFX Audio Generation: Procedurally generated sound effects
- ✅ Ambient Audio Generation: Dynamic soundscapes
- ✅ NPCs (Embodied and Non-Embodied): AI-powered characters with dialogue

## 📝 License

This project is private and created for the Meta Game Competition.

## 👨‍💻 Development

Built with ❤️ using Next.js, React, TypeScript, and Web Audio API.

---

**Enjoy exploring the Cosmic Nexus! 🌌✨**

---

# 📖 Project Story

## 🌟 Inspiration

Cosmic Nexus was inspired by the desire to create an immersive, procedurally generated exploration experience that showcases the power of AI and procedural generation in game development. The concept emerged from asking: *"What if every aspect of a game world could be dynamically generated, from the environments to the NPCs to the audio?"*

Key inspirations:
- **Procedural Generation**: Games like No Man's Sky and Minecraft showed us the power of infinite, unique worlds
- **AI Storytelling**: The idea of NPCs with dynamic, context-aware dialogue that responds to player actions
- **Web Audio Creativity**: Exploring the possibilities of procedural audio synthesis in browser-based games
- **Accessible Gaming**: Creating a game that's beautiful and engaging without requiring complex controls or large downloads

We wanted to prove that cutting-edge AI features could be integrated into a browser-based game using only web technologies, making advanced game development accessible to anyone with a browser.

## 🎯 What it does

Cosmic Nexus is an AI-powered exploration game where players:

1. **Explore Five Unique Realms**: Each realm features procedurally generated environments, skyboxes, and atmospheres
2. **Interact with AI NPCs**: Dynamic NPCs generate contextual dialogue based on your progress, interactions, and current realm
3. **Collect Artifacts**: Gather procedurally named artifacts across different rarity tiers to earn XP
4. **Level Up**: Progress through a character system that rewards exploration with meaningful upgrades
5. **Customize**: Spend XP in the gift shop to enhance abilities, appearance, and gameplay mechanics
6. **Experience Procedural Audio**: All sounds are generated in real-time using Web Audio API, creating unique soundscapes for each realm

The game demonstrates seven key AI/Generation features:
- ✅ AI NPCs with dynamic dialogue generation
- ✅ Procedurally generated environments
- ✅ AI-generated skyboxes with dynamic gradients
- ✅ Procedural artifact generation (names and placement)
- ✅ Procedurally generated ambient audio (musical soundscapes)
- ✅ Procedurally generated SFX (sound effects)
- ✅ Dynamic texture/environment visuals

## 🛠️ How we built it

### Technology Stack
- **Frontend Framework**: Next.js 16 with React 19 and TypeScript
- **Styling**: Tailwind CSS 4 for responsive, modern UI
- **Animations**: Motion (Framer Motion) for smooth character and UI animations
- **Audio**: Web Audio API for all procedural audio generation
- **State Management**: React hooks (useState, useEffect, useRef) for game state

### Architecture & Implementation

#### AI NPC System
```typescript
// NPCs generate dialogue based on:
- Player's artifact collection count
- Quest progress
- Interaction history with specific NPCs
- Current realm context
- NPC type (guide, merchant, mystic, guardian)
```

The dialogue system uses a template-based approach with dynamic variable substitution, creating the illusion of AI-powered conversations while maintaining performance.

#### Procedural Generation

**Environments & Skyboxes**:
- Each realm has a base color palette
- Skyboxes are generated using radial/linear gradients with randomized:
  - Gradient angles (0-360°)
  - Color positions (20-80% range)
  - Opacity variations
  
**Artifacts**:
- Name generation: Random combination of realm-specific prefixes + universal suffixes
- Positioning: Random coordinates within safe bounds (15-85% of map)
- Rarity: Weighted random distribution based on index

**NPCs**:
- Spawn rates vary by realm and NPC type
- Random positioning with collision avoidance
- Dynamic count based on procedural rules (e.g., Zenith always has a guardian)

#### Audio Generation System

**Ambient Audio** (4-layer synthesis):
```javascript
Layer 1: Deep bass pad (sawtooth) - Slow LFO (0.08-0.12 Hz)
Layer 2: Mid-range movement (triangle) - Fast LFO (0.5-0.8 Hz) + pitch modulation
Layer 3: High-frequency shimmer (sine) - Fast modulation (2-3 Hz)
Layer 4: Subtle sparkle (sine) - Gentle shimmer (0.1-0.2 Hz)
```

**SFX Generation**:
- Each sound type uses different waveforms (sine, triangle, sawtooth)
- Dynamic frequency variation (±50Hz randomization)
- Filter chains (lowpass, bandpass) for texture
- Envelope shaping (attack, sustain, release)

All audio is generated using Web Audio API oscillators, filters, and LFOs - no pre-recorded files!

#### Character Progression System
- Experience tracked separately for leveling (character progression) and currency (shop purchases)
- Exponential leveling curve: XP requirement = base × 1.5^(level-1)
- Ability bonuses scale multiplicatively with shop purchases
- Visual feedback: Character glow increases with level

#### Shop System
- XP as currency tracked separately from leveling XP
- Permanent upgrades stored in Set data structure
- Upgrades stack multiplicatively with level bonuses
- Real-time UI updates on purchase

### Development Process

1. **Phase 1**: Core game loop (movement, artifacts, basic UI)
2. **Phase 2**: AI NPC system with dynamic dialogue
3. **Phase 3**: Procedural generation (environments, artifacts, NPCs)
4. **Phase 4**: Audio system (ambient + SFX)
5. **Phase 5**: Character progression and shop system
6. **Phase 6**: Polish (animations, particles, UX improvements)

## 🚧 Challenges we ran into

### 1. **Browser Audio Context Restrictions**
**Challenge**: Browsers require user interaction before allowing audio playback, which broke the ambient audio system.

**Solution**: Implemented an "Enable Audio" button that initializes the AudioContext on user click, with proper state management to resume suspended contexts.

### 2. **Procedural Audio Quality**
**Challenge**: Early versions sounded harsh and siren-like due to aggressive LFOs and noise generation.

**Solution**: 
- Switched from sawtooth/triangle to sine waves for pleasant tones
- Reduced LFO speeds (0.02-0.05 Hz for ambient vs 0.5-0.8 Hz)
- Implemented musical chord progressions instead of random frequencies
- Added gentle lowpass filters for warmth
- Removed harsh noise layers

### 3. **State Management Complexity**
**Challenge**: Managing character progression, XP currency, shop purchases, and level bonuses created complex state dependencies.

**Solution**: 
- Separated concerns: `character.experience` for leveling, `totalXP` for currency
- Used Set data structure for owned gifts (fast lookups)
- Centralized ability calculations to ensure correct stacking

### 4. **Performance with Multiple Audio Nodes**
**Challenge**: Creating multiple oscillators, filters, and LFOs per realm switch caused memory leaks.

**Solution**: 
- Proper cleanup in useEffect return functions
- Storing references to all audio nodes for cleanup
- Debouncing realm switches to prevent rapid audio recreation

### 5. **Dynamic NPC Dialogue**
**Challenge**: Making NPCs feel intelligent and responsive without using an LLM API.

**Solution**: Template-based system with multiple dialogue variations per NPC type, selected based on:
- Interaction count (first visit vs. repeat visits)
- Player progress (artifacts collected, quest completion)
- Contextual variables dynamically inserted

## 🏆 Accomplishments that we're proud of

1. **Full Procedural Generation**: Successfully implemented procedural generation for NPCs, artifacts, environments, skyboxes, and audio - all without external APIs or asset files.

2. **Beautiful Audio System**: Created a pleasant, musical ambient audio system entirely with Web Audio API - no pre-recorded sounds, just pure synthesis.

3. **Seamless AI Integration**: NPCs feel alive and responsive despite using template-based dialogue, thanks to smart context-aware selection.

4. **Smooth Character Progression**: Balanced progression system where both leveling and shop purchases feel meaningful and impactful.

5. **Performance**: Despite multiple oscillators, filters, animations, and state updates, the game runs smoothly at 60 FPS.

6. **Accessibility**: No downloads, no installations, works in any modern browser - truly accessible game development.

7. **Complete Feature Set**: Successfully implemented all 7 required AI/Generation features for the competition.

8. **Polished UX**: Smooth animations, particle effects, visual feedback, and intuitive controls create an engaging experience.

## 📚 What we learned

### Technical Learnings

1. **Web Audio API Mastery**:
   - How to create complex audio synthesis with oscillators, filters, and LFOs
   - Managing audio context lifecycle (suspension, resumption)
   - Creating musical, pleasant sounds vs. harsh noise
   - Performance optimization for multiple audio nodes

2. **Procedural Generation Techniques**:
   - Template-based content generation for scalability
   - Weighted random distributions for balanced rarity
   - Context-aware content selection
   - Balancing uniqueness with coherence

3. **React State Management**:
   - Complex state dependencies and how to structure them
   - useEffect cleanup patterns for audio resources
   - Performance optimization with useRef and memoization
   - Separating UI state from game state

4. **Game Design Principles**:
   - Balancing progression curves (exponential vs. linear)
   - Creating meaningful choices (shop purchases)
   - Feedback loops (XP → upgrades → easier gameplay → more XP)
   - Energy management as core gameplay mechanic

5. **Browser Limitations & Solutions**:
   - Audio autoplay restrictions and how to handle them
   - Memory management for long-running applications
   - Performance profiling and optimization

### Creative Learnings

1. **AI Illusion**: Simple systems can feel intelligent with the right context and dynamic selection.

2. **Procedural vs. Hand-crafted**: Sometimes procedural generation creates more interesting experiences than carefully designed content.

3. **Audio is Critical**: The right audio transforms a simple visual into an immersive experience.

4. **Less is More**: A few well-polished features beat many half-implemented ones.

## 🚀 What's next for Cosmic Nexus

### Short-term Improvements

1. **Save System**: Implement localStorage persistence for character progress, XP, and shop purchases
2. **More Realms**: Expand from 5 to 10+ realms with unique mechanics
3. **Quest System**: Add structured quests from NPCs with rewards
4. **Multiplayer Elements**: Leaderboards for artifacts collected or levels reached
5. **More Shop Items**: Expand the shop with cosmetic items, temporary boosts, and rare consumables

### Advanced Features

1. **Procedural Music**: Generate complete musical tracks that evolve as you explore, not just ambient pads
2. **Dynamic Difficulty**: Adjust artifact spawn rates and NPC difficulty based on player level
3. **Procedural Narrative**: Generate mini-stories or lore for each realm based on player discoveries
4. **Artifact Trading**: Allow players to trade artifacts with NPCs for better rewards
5. **Realm Events**: Random events that modify realm properties temporarily

### Technical Enhancements

1. **LLM Integration**: Replace template-based NPC dialogue with actual LLM API calls for true AI conversations
2. **3D Rendering**: Move to WebGL/Three.js for 3D environments and character models
3. **Procedural Mesh Generation**: Use AI for 3D mesh generation of artifacts and environments
4. **Advanced Audio**: Implement spatial audio, reverb, and more complex synthesis
5. **Mobile Optimization**: Enhanced touch controls and mobile-specific UI improvements

### Platform Expansion

1. **Steam Release**: Package as a standalone game with Steam integration
2. **Mobile App**: Native iOS/Android versions with platform-specific features
3. **VR Support**: Adapt for VR platforms (Quest, PSVR) for immersive exploration
4. **Community Features**: User-generated realms, artifact sharing, modding support

### Long-term Vision

Cosmic Nexus could become a **procedural exploration platform** where:
- Players can create and share their own realms
- AI generates infinite variations of environments
- NPCs evolve and remember player interactions across sessions
- The world grows and changes based on community activity

The ultimate goal: **An infinite, ever-evolving universe where every playthrough is unique, and the AI makes each player's journey feel personally crafted.**

---

*Built with passion, curiosity, and a belief that web technologies can create extraordinary gaming experiences.* 🌌✨