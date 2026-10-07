/**
 * TerraPulse Touch Grass Quest Engine
 * The Anti-Doomscroll Engine: Making the screen the shortest part of your day.
 */

import confetti from 'canvas-confetti';

export class QuestEngine {
  constructor() {
    this.storageKey = 'terrapulse_field_journal';
    this.audioCtx = null;
    this.activeQuest = null;
    this.questTimerId = null;
    this.remainingSeconds = 0;
    this.totalSeconds = 0;
    this.isFieldModeActive = false;

    this.questBank = [
      {
        id: 'conifer_fascicle',
        title: 'The 5-Needle White Pine Quest',
        category: 'Forest Botany',
        durationMinutes: 10,
        difficulty: 'Easy',
        environment: ['forest', 'park', 'backyard'],
        prompt: 'Find an evergreen conifer tree. Pluck or inspect a needle bundle. Count how many needles grow together in each cluster (fascicle).',
        objective: 'Count the needles. If exactly 5, you found an Eastern White Pine (W-H-I-T-E = 5 letters). Inhale the resinous scent of crushed needles.',
        sensoryPrompt: 'What does the crushed needle smell like? Pine resin, citrus, or damp earth?',
        badge: '🌲 Pine Scout'
      },
      {
        id: 'acoustic_chorus',
        title: 'Binaural Canopy Silence',
        category: 'BioAcoustics',
        durationMinutes: 5,
        difficulty: 'Gentle',
        environment: ['forest', 'park', 'mountain', 'wetland'],
        prompt: 'Stand completely still under tree branches for 3 minutes. Close your eyes and listen in 360 degrees.',
        objective: 'Count how many distinct bird pitches or natural sounds you can isolate before looking at your phone.',
        sensoryPrompt: 'Where was the furthest sound coming from? High in the canopy or low in the shrubs?',
        badge: '🦉 Forest Ear'
      },
      {
        id: 'pigment_detective',
        title: 'The Anthocyanin Leaf Blush',
        category: 'Fall Foliage',
        durationMinutes: 8,
        difficulty: 'Easy',
        environment: ['forest', 'park', 'backyard', 'campus'],
        prompt: 'Search the ground beneath deciduous trees for a leaf in active transition.',
        objective: 'Find a leaf that is partly green (chlorophyll) and partly red or purple (anthocyanin). Observe how sugars get trapped in sunny leaf cells during crisp autumn nights.',
        sensoryPrompt: 'Notice how the veins stay green longer than the leaf margins.',
        badge: '🍁 Foliage Tracker'
      },
      {
        id: 'tactile_grounding',
        title: 'The 3-Texture Grounding Ritual',
        category: 'Mindfulness & Earth',
        durationMinutes: 6,
        difficulty: 'Gentle',
        environment: ['forest', 'park', 'backyard', 'mountain'],
        prompt: 'Locate three distinct natural surfaces without looking at any device.',
        objective: 'Feel rough tree bark, damp velvet moss, and a cold stone with bare fingers. Notice temperature and moisture differences.',
        sensoryPrompt: 'Which surface was the coldest? Why do moss cushions retain moisture so long?',
        badge: '🌿 Grounded Wanderer'
      },
      {
        id: 'fungal_recycler',
        title: 'Decomposer Log Inspection',
        category: 'Mycology & Soil',
        durationMinutes: 12,
        difficulty: 'Moderate',
        environment: ['forest', 'park'],
        prompt: 'Find a fallen decaying log or stump off the main beaten path.',
        objective: 'Inspect the underside for bracket fungi, mycelial white threads, or moss colonies. Witness nature’s silent recycling engine.',
        sensoryPrompt: 'Smell the damp rich humus beneath the wood. That aroma is geosmin and actinobacteria.',
        badge: '🍄 Mycelium Watcher'
      },
      {
        id: 'shadow_sundial',
        title: 'The Golden Hour Shadow Walk',
        category: 'Celestial & Light',
        durationMinutes: 15,
        difficulty: 'Easy',
        environment: ['park', 'open', 'campus', 'trail'],
        prompt: 'Step out into an open field or trail clearing. Cast your gaze down at your own shadow.',
        objective: 'Compare your shadow height to your actual height. Estimate the sun’s elevation angle. Walk 200 paces facing directly away from the sun.',
        sensoryPrompt: 'Feel the warmth of low-angled sunlight on the back of your neck.',
        badge: '☀️ Solar Pilgrim'
      }
    ];
  }

  getRandomQuest(environment = 'all', duration = 15) {
    let filtered = this.questBank;
    if (environment !== 'all') {
      filtered = filtered.filter(q => q.environment.includes(environment));
      if (filtered.length === 0) filtered = this.questBank;
    }
    const idx = Math.floor(Math.random() * filtered.length);
    return filtered[idx];
  }

  playChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      // Gentle resonant Tibetan singing bowl style chime
      const freqs = [528, 792, 1056]; // 528Hz Solfeggio frequency + harmonics
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.2 / (i + 1), now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 3.6);
      });
    } catch (e) {
      console.warn('Audio chime failed:', e);
    }
  }

  saveJournalEntry(entry) {
    const list = this.getJournalEntries();
    list.unshift({
      id: 'entry_' + Date.now(),
      date: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      ...entry
    });
    localStorage.setItem(this.storageKey, JSON.stringify(list));
    this.triggerCelebration();
    return list;
  }

  getJournalEntries() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        // Pre-populate with one inspirational seed entry
        return [
          {
            id: 'seed_1',
            date: new Date(Date.now() - 86400000 * 2).toISOString(),
            displayDate: 'Yesterday, 4:15 PM',
            questTitle: 'The 5-Needle White Pine Quest',
            notes: 'Found a 40-foot Eastern White Pine near the bend in the north trail. Crushed needles had a wonderful crisp citrus aroma. Put my phone away for 25 minutes.',
            badge: '🌲 Pine Scout',
            timeSpentMin: 25,
            weather: 'Crisp autumn breeze, 58°F'
          }
        ];
      }
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  triggerCelebration() {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#22c55e', '#f59e0b', '#fb923c', '#38bdf8']
      });
    } catch (e) {
      // safe fallback
    }
  }
}
