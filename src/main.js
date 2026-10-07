import './style.css';
import { BioAcousticEngine } from './audioEngine.js';
import { BioVisionEngine } from './visionEngine.js';
import { QuestEngine } from './questEngine.js';
import { RouteEngine } from './routeEngine.js';
import { GardenEngine } from './gardenEngine.js';

// Initialize Engines
let bioAcoustic = null;
const bioVision = new BioVisionEngine();
const questEngine = new QuestEngine();
let routeEngine = null;
const gardenEngine = new GardenEngine();

let currentTab = 'quests';
let currentSpecimen = bioVision.getPresetSpecimens()[0];
let isOfflineSimulated = false;
let ambientTimerInterval = null;

// App HTML Template
const app = document.querySelector('#app');
app.innerHTML = `
  <div class="app-container">
    
    <!-- Top Navigation & Edge Status Bar -->
    <header class="glass-panel top-nav">
      <div class="brand-wrapper">
        <div class="brand-logo-icon">🌿</div>
        <div class="brand-text">
          <h1>TerraPulse AI</h1>
          <div class="brand-tagline">TOUCH GRASS // OPEN-WEIGHT EDGE TRAIL ENGINE</div>
        </div>
      </div>
      
      <div class="status-cluster">
        <div class="status-badge" id="edge-status-badge">
          <span class="pulse-dot"></span>
          <span id="edge-status-text">Edge Active: 100% Offline / Zero-Cloud</span>
        </div>
        <button class="offline-toggle-btn" id="btn-toggle-offline" title="Simulate Backcountry Trail with zero signal">
          📶 <span id="offline-btn-text">Trail Signal: Offline Mode</span>
        </button>
        <button class="btn-touch-grass-panic" id="btn-quick-grass">
          ⚡ Eject & Touch Grass
        </button>
      </div>
    </header>

    <!-- Hero Banner with Trail Statistics -->
    <section class="hero-banner glass-panel">
      <div class="hero-tag">🌲 Hacktoberfest 2026 // Week 1: Touch Grass</div>
      <h2>Make the screen the shortest part of your life.</h2>
      <p>
        An open-source, edge-native trail companion. Identify bird calls in deep valleys with zero cellular reception, scan autumn foliage pigments, build trail runs with GPX watch export, and step into the wild with 60-second micro-quests.
      </p>
      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-value">18ms</span>
          <span class="stat-label">Local Edge Latency</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">0 KB</span>
          <span class="stat-label">Data Sent to Cloud</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">$0.00</span>
          <span class="stat-label">Recurring API Cost</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">100%</span>
          <span class="stat-label">Open-Weight Autonomy</span>
        </div>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <nav class="tab-navigation">
      <button class="nav-tab-btn active" data-tab="quests">🌿 Touch Grass Quests</button>
      <button class="nav-tab-btn" data-tab="audio">🐦 BioAcoustic Ear</button>
      <button class="nav-tab-btn" data-tab="vision">🍁 BioVision Flora</button>
      <button class="nav-tab-btn" data-tab="routes">🏃 Fall Foliage Routes</button>
      <button class="nav-tab-btn" data-tab="garden">🌱 Frost & Soil Almanac</button>
      <button class="nav-tab-btn" data-tab="engine">⚡ Open AI Architecture</button>
    </nav>

    <!-- TAB 1: TOUCH GRASS QUESTS (Anti-Doomscroll Engine) -->
    <main class="module-section active" id="tab-quests">
      <div class="grid-2col">
        <!-- Active Quest Card -->
        <div class="glass-panel quest-hero-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="quest-badge-tag" id="quest-category-badge">🌲 Forest Botany</span>
            <span style="font-size:0.8rem; color:#86efac; font-family:var(--font-mono);">Est. Screen Time: <b style="color:#fde68a;">45 seconds</b></span>
          </div>
          <h3 class="quest-title" id="quest-title-text">The 5-Needle White Pine Quest</h3>
          
          <div class="quest-prompt-box" id="quest-prompt-box">
            Find an evergreen conifer tree. Pluck or inspect a needle bundle. Count how many needles grow together in each cluster (fascicle).
          </div>
          
          <div class="quest-details-grid">
            <div class="quest-metric">
              <div class="quest-metric-label">Target Environment</div>
              <div class="quest-metric-val" id="quest-env-val">Forest / Park</div>
            </div>
            <div class="quest-metric">
              <div class="quest-metric-label">Outdoor Duration</div>
              <div class="quest-metric-val" id="quest-time-val">10 Minutes</div>
            </div>
            <div class="quest-metric">
              <div class="quest-metric-label">Badge Reward</div>
              <div class="quest-metric-val" id="quest-badge-val">🌲 Pine Scout</div>
            </div>
          </div>

          <div style="background:rgba(18,38,24,0.4); padding:1rem; border-radius:var(--radius-sm); border:1px solid rgba(74,222,128,0.15);">
            <div style="font-size:0.75rem; color:#fde68a; font-weight:700; margin-bottom:0.25rem;">🌿 SENSORY MISSION:</div>
            <p id="quest-sensory-val" style="font-size:0.88rem; color:#d1fae5;">
              What does the crushed needle smell like? Pine resin, citrus, or damp earth?
            </p>
          </div>

          <div class="quest-action-row">
            <button class="btn-primary-action" id="btn-accept-quest">
              🚀 Pocket Phone & Start Outdoor Timer
            </button>
            <button class="btn-secondary-action" id="btn-reroll-quest">
              🎲 New Quest
            </button>
            <button class="btn-secondary-action" id="btn-open-log-modal">
              📝 Log Field Note
            </button>
          </div>
        </div>

        <!-- Field Journal & History -->
        <div class="glass-panel journal-panel">
          <div class="journal-header">
            <h4 style="font-family:var(--font-heading); font-size:1.15rem; color:#f0fdf4;">📖 Local Field Journal</h4>
            <span style="font-size:0.75rem; color:#86efac; font-family:var(--font-mono);">100% Private (No Cloud)</span>
          </div>
          <p style="font-size:0.85rem; color:#9ca3af;">
            Your sensory outdoor discoveries. Saved only to your local device.
          </p>
          <div id="journal-entries-container" style="display:flex; flex-direction:column; gap:0.75rem; max-height:420px; overflow-y:auto; padding-right:0.25rem;">
            <!-- Rendered by JS -->
          </div>
        </div>
      </div>
    </main>

    <!-- TAB 2: BIOACOUSTIC EAR (Bird & Wildlife Audio Identifier) -->
    <main class="module-section" id="tab-audio">
      <div class="grid-2col">
        <!-- Live Spectrogram Visualizer -->
        <div class="glass-panel" style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3 style="font-family:var(--font-heading); font-size:1.3rem;">Real-time Waterfall Spectrogram</h3>
              <p style="font-size:0.8rem; color:var(--text-dim);">Open BioAcoustics // 0Hz - 10kHz FFT Audio Feature Extraction</p>
            </div>
            <span class="status-badge">Edge AST Neural Engine</span>
          </div>

          <div class="spectrogram-box">
            <div class="spectrogram-header">
              <span>CANVAS FFT SPECTRUM ANALYZER</span>
              <span id="audio-fft-status">Status: Standby</span>
            </div>
            <canvas id="spectrogram-canvas" class="spectrogram-canvas" width="600" height="200"></canvas>
          </div>

          <div class="audio-controls-row" style="padding:0;">
            <button class="btn-primary-action" id="btn-mic-toggle">
              🎙️ Start Live Trail Mic
            </button>
            <button class="btn-secondary-action" id="btn-stop-audio">
              ⏹️ Stop Audio
            </button>
          </div>

          <!-- Soundboard Presets for Trail Simulation -->
          <div style="margin-top:0.5rem;">
            <h4 style="font-size:0.9rem; color:#fde68a; margin-bottom:0.5rem; font-family:var(--font-heading);">
              🎵 Instant Trail Audio Simulator (Test with 1-Click):
            </h4>
            <div class="species-card-grid" id="species-soundboard-grid">
              <!-- Rendered by JS -->
            </div>
          </div>
        </div>

        <!-- BioAcoustic Species Identification Result Card -->
        <div class="glass-panel" style="padding:1.5rem; display:flex; flex-direction:column; gap:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="quest-badge-tag">AI Species Classification</span>
            <span style="font-family:var(--font-mono); font-size:0.8rem; color:#4ade80;" id="audio-confidence-tag">Confidence: 94.2%</span>
          </div>

          <div style="display:flex; gap:1rem; align-items:center;">
            <img src="/images/bird_goldfinch.jpg" id="audio-species-img" alt="Bird Species" style="width:72px; height:72px; border-radius:12px; object-fit:cover; border:2px solid #4ade80;" />
            <div>
              <h3 style="font-family:var(--font-heading); font-size:1.4rem;" id="audio-species-common">American Goldfinch</h3>
              <div style="font-style:italic; font-size:0.85rem; color:#86efac;" id="audio-species-scientific">Spinus tristis</div>
            </div>
          </div>

          <div style="background:rgba(8,20,12,0.7); padding:1rem; border-radius:var(--radius-sm); border-left:3px solid #38bdf8;">
            <div style="font-size:0.75rem; color:#38bdf8; font-weight:700;">ACOUSTIC SIGNATURE & CALL CADENCE:</div>
            <p id="audio-species-pattern" style="font-size:0.88rem; color:#ecfdf5; margin-top:0.25rem;">
              Roller-coaster twittering, sweet "po-ta-to-chip" flight call with frequency modulation between 3.5kHz and 6.0kHz.
            </p>
          </div>

          <div class="quest-details-grid">
            <div class="quest-metric">
              <div class="quest-metric-label">Peak Frequency</div>
              <div class="quest-metric-val" id="audio-peak-freq">4,200 Hz</div>
            </div>
            <div class="quest-metric">
              <div class="quest-metric-label">Audio Latency</div>
              <div class="quest-metric-val">18 ms</div>
            </div>
            <div class="quest-metric">
              <div class="quest-metric-label">Conservation</div>
              <div class="quest-metric-val" id="audio-conservation">Least Concern</div>
            </div>
          </div>

          <div style="background:rgba(18,38,24,0.5); padding:1rem; border-radius:var(--radius-sm); font-size:0.85rem; color:#cbd5e1;">
            <b style="color:#fde68a;">Where to look on the trail:</b>
            <p id="audio-habitat-text" style="margin-top:0.25rem;">
              Look for yellow flitting motions around thistle patches, wild asters, and tree canopy perches.
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- TAB 3: BIOVISION FLORA & FALL FOLIAGE -->
    <main class="module-section" id="tab-vision">
      <div class="grid-2col">
        <!-- Specimen Preview & Fall Foliage Pigment Breakdown -->
        <div class="glass-panel" style="padding:1.5rem; display:flex; flex-direction:column; gap:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="font-family:var(--font-heading); font-size:1.3rem;">BioVision Botanical Scanner</h3>
            <span class="status-badge">Edge MobileNet & BioCLIP</span>
          </div>

          <div class="specimen-preview-box">
            <img id="vision-specimen-img" class="specimen-img" src="/images/fall_leaf.jpg" alt="Botanical Specimen" />
          </div>

          <!-- Pigment Spectral Meter -->
          <div style="background:rgba(8,20,12,0.8); padding:1rem; border-radius:var(--radius-md); border:1px solid rgba(74,222,128,0.15);">
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-family:var(--font-heading);">
              <span style="color:#f0fdf4;">Fall Foliage Pigment Decomposition:</span>
              <span id="foliage-phase-badge" style="color:#f59e0b; font-family:var(--font-mono); font-weight:700;">Peak Anthocyanin</span>
            </div>

            <div class="pigment-progress-bar">
              <div class="pigment-bar-part pigment-anthocyanin" id="bar-anthocyanin" style="width: 58%;" title="Anthocyanin (Red/Purple)"></div>
              <div class="pigment-bar-part pigment-carotenoid" id="bar-carotenoid" style="width: 32%;" title="Carotenoid (Yellow/Amber)"></div>
              <div class="pigment-bar-part pigment-chlorophyll" id="bar-chlorophyll" style="width: 10%;" title="Chlorophyll (Green)"></div>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-family:var(--font-mono);">
              <span style="color:#f43f5e;">● Anthocyanin: <b id="pct-anthocyanin">58%</b></span>
              <span style="color:#f59e0b;">● Carotenoid: <b id="pct-carotenoid">32%</b></span>
              <span style="color:#22c55e;">● Chlorophyll: <b id="pct-chlorophyll">10%</b></span>
            </div>
          </div>

          <!-- Specimen Switcher Buttons -->
          <div>
            <div style="font-size:0.85rem; color:#9ca3af; margin-bottom:0.5rem;">Select Field Specimen to Analyze:</div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;" id="specimen-selector-row">
              <!-- Rendered by JS -->
            </div>
          </div>
        </div>

        <!-- Specimen Ecological Profile & Foraging Caution -->
        <div class="glass-panel" style="padding:1.5rem; display:flex; flex-direction:column; gap:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="quest-badge-tag" id="vision-category-tag">Fall Foliage / Deciduous</span>
            <span style="font-family:var(--font-mono); font-size:0.8rem; color:#4ade80;" id="vision-confidence-tag">Confidence: 96%</span>
          </div>

          <div>
            <h3 style="font-family:var(--font-heading); font-size:1.6rem;" id="vision-common-name">Japanese Maple</h3>
            <div style="font-style:italic; font-size:0.9rem; color:#86efac;" id="vision-scientific-name">Acer palmatum (Family: Sapindaceae)</div>
          </div>

          <div id="vision-forage-box" style="background:rgba(8,20,12,0.8); padding:1rem; border-radius:var(--radius-sm); border-left:3px solid #22c55e;">
            <div style="font-size:0.75rem; color:#4ade80; font-weight:700;">FORAGING & BOTANICAL SAFETY:</div>
            <p id="vision-forage-text" style="font-size:0.88rem; color:#ecfdf5; margin-top:0.25rem;">
              Non-toxic, sap edible, seeds wildlife forage.
            </p>
          </div>

          <div style="background:rgba(18,38,24,0.5); padding:1rem; border-radius:var(--radius-sm); font-size:0.85rem; color:#cbd5e1;">
            <b style="color:#fde68a;">Field Observation Notes:</b>
            <p id="vision-field-notes" style="margin-top:0.25rem; line-height:1.5;">
              Palmate 5 to 7 lobed leaves with deep clefts. Brilliant autumn crimson triggered by cold autumn nights and bright sunny days trap sugars in leaf veins.
            </p>
          </div>

          <div class="quest-metric">
            <div class="quest-metric-label">Ecological Niche</div>
            <div class="quest-metric-val" id="vision-niche" style="font-size:0.85rem; font-family:var(--font-body); color:#d1fae5;">
              Canopy mid-story, acid to neutral soil, mountain streamsides
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- TAB 4: FALL FOLIAGE ROUTES (Run Club & Trail Generator) -->
    <main class="module-section" id="tab-routes">
      <div class="grid-2col">
        <!-- Interactive Leaflet Map -->
        <div class="glass-panel" style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3 style="font-family:var(--font-heading); font-size:1.3rem;">Offline Trail & Foliage Route Builder</h3>
              <p style="font-size:0.8rem; color:var(--text-dim);">Circular nature loops generated for screen-free running & hiking</p>
            </div>
            <span class="status-badge">GPX Watch Ready</span>
          </div>

          <div id="trail-map" class="map-viewport"></div>

          <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
            <button class="btn-primary-action" id="btn-export-gpx">
              📥 Export GPX to GPS Watch
            </button>
            <button class="btn-secondary-action" id="btn-regenerate-route">
              🔄 Regenerate Circuit
            </button>
          </div>
        </div>

        <!-- Route Metrics & Waypoints -->
        <div class="glass-panel" style="padding:1.5rem; display:flex; flex-direction:column; gap:1.25rem;">
          <h4 style="font-family:var(--font-heading); font-size:1.2rem; color:#f0fdf4;" id="route-title-text">
            5km Adirondack Foliage Circuit
          </h4>

          <div class="quest-details-grid">
            <div class="quest-metric">
              <div class="quest-metric-label">Loop Distance</div>
              <div class="quest-metric-val" id="route-dist-val">5.0 km</div>
            </div>
            <div class="quest-metric">
              <div class="quest-metric-label">Elevation Gain</div>
              <div class="quest-metric-val" id="route-ele-val">+165 m</div>
            </div>
            <div class="quest-metric">
              <div class="quest-metric-label">Canopy Immersion</div>
              <div class="quest-metric-val" id="route-canopy-val">88%</div>
            </div>
            <div class="quest-metric">
              <div class="quest-metric-label">Foliage Index</div>
              <div class="quest-metric-val" id="route-foliage-val" style="color:#f59e0b;">94 / 100</div>
            </div>
          </div>

          <div>
            <label style="font-size:0.8rem; color:#9ca3af; display:block; margin-bottom:0.4rem;">Select Trail Nature Reserve:</label>
            <select class="form-select" id="select-trail-location">
              <!-- Options populated by JS -->
            </select>
          </div>

          <div>
            <label style="font-size:0.8rem; color:#9ca3af; display:block; margin-bottom:0.4rem;">Target Distance (km):</label>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn-secondary-action btn-dist-select active" data-km="3">3 km</button>
              <button class="btn-secondary-action btn-dist-select" data-km="5">5 km</button>
              <button class="btn-secondary-action btn-dist-select" data-km="8">8 km</button>
              <button class="btn-secondary-action btn-dist-select" data-km="12">12 km</button>
            </div>
          </div>

          <div style="background:rgba(8,20,12,0.8); padding:1rem; border-radius:var(--radius-sm); border:1px solid rgba(74,222,128,0.15);">
            <div style="font-size:0.75rem; color:#86efac; font-weight:700; margin-bottom:0.5rem;">WAYPOINTS ALONG CIRCUIT:</div>
            <div id="route-waypoints-list" style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.85rem;">
              <!-- Rendered by JS -->
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- TAB 5: FROST & SOIL ALMANAC (Gardening Planner) -->
    <main class="module-section" id="tab-garden">
      <div class="grid-2col">
        <!-- Local Frost Dates & Micro-Season -->
        <div class="glass-panel" style="padding:1.5rem; display:flex; flex-direction:column; gap:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="font-family:var(--font-heading); font-size:1.3rem;">Frost & Soil Almanac</h3>
            <span class="status-badge">USDA Phenology Engine</span>
          </div>

          <p style="font-size:0.85rem; color:#cbd5e1;">
            Tells you what to plant, mulch, and harvest in the dirt this week based on your local hardiness frost calendar.
          </p>

          <div>
            <label style="font-size:0.8rem; color:#9ca3af; display:block; margin-bottom:0.4rem;">Select Your USDA Hardiness Zone:</label>
            <select class="form-select" id="select-usda-zone">
              <option value="3">Zone 3 (Northern Plains / Cold North) — Frost ~Sep 15</option>
              <option value="4">Zone 4 (Upper Midwest / Northern Rockies) — Frost ~Sep 25</option>
              <option value="5">Zone 5 (Midwest / New England) — Frost ~Oct 10</option>
              <option value="6" selected>Zone 6 (Mid-Atlantic / Ohio Valley) — Frost ~Oct 20</option>
              <option value="7">Zone 7 (Southeast / Coastal NW) — Frost ~Nov 5</option>
              <option value="8">Zone 8 (Deep South / Pacific NW Coast) — Frost ~Nov 25</option>
              <option value="9">Zone 9 (Coastal California / Florida) — Frost ~Dec 10</option>
            </select>
          </div>

          <div class="quest-details-grid">
            <div class="quest-metric">
              <div class="quest-metric-label">First Autumn Frost</div>
              <div class="quest-metric-val" id="frost-first-val">Oct 15 - Nov 1</div>
            </div>
            <div class="quest-metric">
              <div class="quest-metric-label">Last Spring Frost</div>
              <div class="quest-metric-val" id="frost-last-val">Apr 10 - Apr 25</div>
            </div>
            <div class="quest-metric">
              <div class="quest-metric-label">Average Minimum</div>
              <div class="quest-metric-val" id="frost-min-val">-10°F to 0°F</div>
            </div>
          </div>

          <div style="background:rgba(18,38,24,0.5); padding:1rem; border-radius:var(--radius-sm); border-left:3px solid #f59e0b;">
            <div style="font-size:0.75rem; color:#fde68a; font-weight:700;">CURRENT SOIL WINDOW:</div>
            <p style="font-size:0.88rem; color:#ecfdf5; margin-top:0.25rem;">
              Peak autumn prep. Perfect time for planting hardneck garlic cloves 4-6 weeks before ground freezes solid, gathering fallen maple leaves for fungal mulch, and cold-stratifying native milkweed seeds.
            </p>
          </div>
        </div>

        <!-- Weekly Garden Checklist -->
        <div class="glass-panel" style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 style="font-family:var(--font-heading); font-size:1.15rem; color:#f0fdf4;">🌱 This Week's Soil Tasks</h4>
            <span style="font-size:0.75rem; color:#86efac; font-family:var(--font-mono);">Hands-in-the-dirt</span>
          </div>

          <div id="garden-tasks-container" style="display:flex; flex-direction:column; gap:0.75rem; max-height:460px; overflow-y:auto; padding-right:0.25rem;">
            <!-- Rendered by JS -->
          </div>
        </div>
      </div>
    </main>

    <!-- TAB 6: OPEN AI ARCHITECTURE & WHY OPEN MATTERS -->
    <main class="module-section" id="tab-engine">
      <div class="glass-panel" style="padding:2rem; display:flex; flex-direction:column; gap:1.75rem;">
        <div>
          <span class="hero-tag">Core Technical Architecture</span>
          <h3 style="font-family:var(--font-heading); font-size:1.8rem; margin-top:0.4rem;">
            Why Open-Source AI Powers TerraPulse
          </h3>
          <p style="color:#d1fae5; font-size:1rem; max-width:820px; margin-top:0.5rem;">
            When you're three miles deep in a national forest or canyon trail, there are zero cellular towers. Closed proprietary APIs (OpenAI, Claude, Gemini Cloud) are completely useless when you have no signal. TerraPulse relies entirely on open-weight models, edge-native runtimes, and local inference.
          </p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
          <div style="background:rgba(8,20,12,0.8); border:1px solid rgba(74,222,128,0.2); padding:1.25rem; border-radius:var(--radius-md);">
            <div style="font-size:1.5rem; margin-bottom:0.5rem;">🌲 1. Zero Cell Signal Resilience</div>
            <p style="font-size:0.88rem; color:#cbd5e1; line-height:1.5;">
              Runs on laptops, phones, or Raspberry Pis in the backcountry with airplane mode enabled. Edge bioacoustic FFT and open weights run in pure WASM & WebAudio.
            </p>
          </div>

          <div style="background:rgba(8,20,12,0.8); border:1px solid rgba(74,222,128,0.2); padding:1.25rem; border-radius:var(--radius-md);">
            <div style="font-size:1.5rem; margin-bottom:0.5rem;">🍄 2. Foraging & Geolocation Privacy</div>
            <p style="font-size:0.88rem; color:#cbd5e1; line-height:1.5;">
              Foragers guard their secret morel, chanterelle, and ginseng patches fiercely. Cloud vision APIs upload GPS metadata to corporate servers. Open local models keep every coordinate 100% private.
            </p>
          </div>

          <div style="background:rgba(8,20,12,0.8); border:1px solid rgba(74,222,128,0.2); padding:1.25rem; border-radius:var(--radius-md);">
            <div style="font-size:1.5rem; margin-bottom:0.5rem;">💸 3. Zero Per-Token API Bills</div>
            <p style="font-size:0.88rem; color:#cbd5e1; line-height:1.5;">
              Analyzing continuous 48kHz audio streams through closed APIs costs hundreds of dollars in token fees. Open-source models (AST, BirdNET, MobileNet) cost exactly <b>$0.00</b> forever.
            </p>
          </div>
        </div>

        <!-- Python CLI & Backend Companion Code -->
        <div style="background:#050c07; border:1px solid rgba(74,222,128,0.25); border-radius:var(--radius-md); padding:1.25rem; overflow-x:auto;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span style="font-family:var(--font-mono); font-size:0.8rem; color:#86efac;">touchgrass_cli.py // Local Open-Weight Inference Companion</span>
            <span class="status-badge" style="font-size:0.7rem;">Python 3.10+ // HuggingFace</span>
          </div>
          <pre style="font-family:var(--font-mono); font-size:0.82rem; color:#a7f3d0; line-height:1.5;"><code># Run locally on trail laptop or edge Pi:
python touchgrass_cli.py quest --env forest --minutes 15
python touchgrass_cli.py identify-bird --audio bird_sample.wav
python touchgrass_cli.py scan-leaf --image maple_leaf.jpg
python touchgrass_cli.py gpx-route --distance 5.0 --output morning_loop.gpx</code></pre>
        </div>
      </div>
    </main>

  </div>

  <!-- MINIMALIST FIELD AMBIENT OVERLAY ("SCREEN IS THE SHORTEST PART") -->
  <div class="field-ambient-overlay" id="ambient-overlay">
    <div style="font-size:0.9rem; color:#fde68a; font-family:var(--font-mono); margin-bottom:0.5rem; letter-spacing:0.1em;">
      🌿 TOUCH GRASS // FIELD MODE ACTIVE
    </div>
    <div class="ambient-timer-large" id="ambient-timer-display">10:00</div>
    <div class="ambient-quest-title" id="ambient-title-display">The 5-Needle White Pine Quest</div>
    <div class="ambient-quote">
      "The screen was the shortest part. Put your phone in your pocket, look up into the canopy, and breathe the forest air."
    </div>
    <button class="btn-exit-ambient" id="btn-exit-ambient">
      ✕ Return to Field Journal
    </button>
  </div>

  <!-- FIELD NOTE LOG MODAL -->
  <div class="modal-overlay" id="modal-log-journal">
    <div class="modal-content">
      <h3 style="font-family:var(--font-heading); font-size:1.3rem; margin-bottom:0.5rem; color:#f0fdf4;">
        📝 Log Outdoor Discovery
      </h3>
      <p style="font-size:0.82rem; color:#9ca3af; margin-bottom:1rem;">
        What did you smell, see, touch, or hear outside?
      </p>
      
      <input type="text" class="form-input" id="journal-input-title" placeholder="Quest title (e.g. Pine needle discovery)" />
      <textarea class="form-textarea" id="journal-input-notes" rows="4" placeholder="Sensory notes (e.g. Smelled sweet citrus pine, saw a goldfinch in the high branches...)"></textarea>
      <input type="text" class="form-input" id="journal-input-weather" placeholder="Weather & Temperature (e.g. 62°F, sunny autumn breeze)" />
      
      <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
        <button class="btn-secondary-action" id="btn-cancel-modal">Cancel</button>
        <button class="btn-primary-action" id="btn-save-journal-entry">Save to Local Journal 🎉</button>
      </div>
    </div>
  </div>
`;

// Initialize Audio Canvas & BioAcoustic
const audioCanvas = document.getElementById('spectrogram-canvas');
bioAcoustic = new BioAcousticEngine(audioCanvas);

// Setup Route Engine
setTimeout(() => {
  routeEngine = new RouteEngine('trail-map');
  routeEngine.initMap();
  populateRouteLocations();
}, 200);

// Initialize UI States
renderQuests();
renderSpeciesSoundboard();
renderSpecimens();
renderJournal();
renderGarden();

// --------------------------------------------------------------------------
// EVENT LISTENERS & INTERACTIONS
// --------------------------------------------------------------------------

// Tab Switching
document.querySelectorAll('.nav-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.module-section').forEach(m => m.classList.remove('active'));
    
    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(`tab-${tabId}`).classList.add('active');
    currentTab = tabId;

    if (tabId === 'routes' && routeEngine && routeEngine.map) {
      setTimeout(() => routeEngine.map.invalidateSize(), 150);
    }
  });
});

// Offline Simulation Toggle
document.getElementById('btn-toggle-offline').addEventListener('click', () => {
  isOfflineSimulated = !isOfflineSimulated;
  const statusBadge = document.getElementById('edge-status-badge');
  const statusText = document.getElementById('edge-status-text');
  const btnText = document.getElementById('offline-btn-text');

  if (isOfflineSimulated) {
    statusText.textContent = 'Backcountry Mode: 0 Bars / 100% Local Cache';
    statusBadge.style.background = 'rgba(245, 158, 11, 0.15)';
    statusBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    btnText.textContent = 'Trail Signal: BACKCOUNTRY (No Signal)';
  } else {
    statusText.textContent = 'Edge Active: 100% Offline / Zero-Cloud';
    statusBadge.style.background = 'rgba(16, 185, 129, 0.12)';
    statusBadge.style.borderColor = 'rgba(74, 222, 128, 0.3)';
    btnText.textContent = 'Trail Signal: Offline Mode';
  }
});

// Panic "Eject & Touch Grass" Button
document.getElementById('btn-quick-grass').addEventListener('click', () => {
  document.querySelector('.nav-tab-btn[data-tab="quests"]').click();
  startAmbientFieldMode();
});

// Quest Reroll
document.getElementById('btn-reroll-quest').addEventListener('click', () => {
  const quest = questEngine.getRandomQuest();
  displayQuest(quest);
});

// Start Ambient Outdoor Timer
document.getElementById('btn-accept-quest').addEventListener('click', () => {
  startAmbientFieldMode();
});

// Exit Ambient Overlay
document.getElementById('btn-exit-ambient').addEventListener('click', () => {
  exitAmbientFieldMode();
});

// Journal Modal
document.getElementById('btn-open-log-modal').addEventListener('click', () => {
  const currentQ = questEngine.activeQuest || questEngine.questBank[0];
  document.getElementById('journal-input-title').value = currentQ.title;
  document.getElementById('modal-log-journal').classList.add('active');
});

document.getElementById('btn-cancel-modal').addEventListener('click', () => {
  document.getElementById('modal-log-journal').classList.remove('active');
});

document.getElementById('btn-save-journal-entry').addEventListener('click', () => {
  const title = document.getElementById('journal-input-title').value.trim() || 'Outdoor Walk Reflection';
  const notes = document.getElementById('journal-input-notes').value.trim() || 'Felt the crisp air and listened to the canopy.';
  const weather = document.getElementById('journal-input-weather').value.trim() || 'Crisp autumn weather';
  
  questEngine.saveJournalEntry({
    questTitle: title,
    notes: notes,
    weather: weather,
    badge: '🌿 Trail Completed'
  });

  document.getElementById('modal-log-journal').classList.remove('active');
  renderJournal();
});

// Live Microphone Toggle
const btnMic = document.getElementById('btn-mic-toggle');
btnMic.addEventListener('click', async () => {
  if (!bioAcoustic.isListening) {
    btnMic.textContent = '⏳ Starting Microphone...';
    const res = await bioAcoustic.startMicrophone();
    if (res.success) {
      btnMic.textContent = '🛑 Stop Microphone';
      document.getElementById('audio-fft-status').textContent = 'Listening to Live Surroundings...';
    } else {
      btnMic.textContent = '🎙️ Start Live Trail Mic';
      alert('Microphone not available or permission denied. You can still test with the 1-Click Trail Soundboard!');
    }
  } else {
    bioAcoustic.stopMicrophone();
    btnMic.textContent = '🎙️ Start Live Trail Mic';
    document.getElementById('audio-fft-status').textContent = 'Status: Standby';
  }
});

document.getElementById('btn-stop-audio').addEventListener('click', () => {
  bioAcoustic.stopMicrophone();
  btnMic.textContent = '🎙️ Start Live Trail Mic';
  document.getElementById('audio-fft-status').textContent = 'Status: Standby';
});

// Route controls
document.getElementById('btn-export-gpx').addEventListener('click', () => {
  if (routeEngine) routeEngine.exportGPX();
});

document.getElementById('btn-regenerate-route').addEventListener('click', () => {
  const locSelect = document.getElementById('select-trail-location');
  const activeDistBtn = document.querySelector('.btn-dist-select.active');
  const km = activeDistBtn ? parseInt(activeDistBtn.getAttribute('data-km')) : 5;
  if (routeEngine) {
    const route = routeEngine.generateLoopRoute(km, locSelect.value);
    displayRouteMetrics(route);
  }
});

document.querySelectorAll('.btn-dist-select').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.btn-dist-select').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const km = parseInt(btn.getAttribute('data-km'));
    const locSelect = document.getElementById('select-trail-location');
    if (routeEngine) {
      const route = routeEngine.generateLoopRoute(km, locSelect.value);
      displayRouteMetrics(route);
    }
  });
});

// USDA Hardiness Zone Select
document.getElementById('select-usda-zone').addEventListener('change', (e) => {
  renderGarden(e.target.value);
});

// --------------------------------------------------------------------------
// HELPER RENDER FUNCTIONS
// --------------------------------------------------------------------------

function renderQuests() {
  const quest = questEngine.questBank[0];
  displayQuest(quest);
}

function displayQuest(q) {
  questEngine.activeQuest = q;
  document.getElementById('quest-title-text').textContent = q.title;
  document.getElementById('quest-prompt-box').textContent = q.prompt;
  document.getElementById('quest-category-badge').textContent = q.badge.split(' ')[0] + ' ' + q.category;
  document.getElementById('quest-env-val').textContent = q.environment.map(e => e.toUpperCase()).join(' / ');
  document.getElementById('quest-time-val').textContent = `${q.durationMinutes} Minutes`;
  document.getElementById('quest-badge-val').textContent = q.badge;
  document.getElementById('quest-sensory-val').textContent = q.sensoryPrompt;
}

function startAmbientFieldMode() {
  const quest = questEngine.activeQuest || questEngine.questBank[0];
  questEngine.playChime();
  
  let seconds = quest.durationMinutes * 60;
  const overlay = document.getElementById('ambient-overlay');
  const timerDisplay = document.getElementById('ambient-timer-display');
  const titleDisplay = document.getElementById('ambient-title-display');
  
  titleDisplay.textContent = quest.title;
  overlay.classList.add('active');

  const updateDisplay = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    timerDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  updateDisplay();

  if (ambientTimerInterval) clearInterval(ambientTimerInterval);
  ambientTimerInterval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(ambientTimerInterval);
      questEngine.playChime();
      questEngine.triggerCelebration();
      alert('🌿 Trail Quest Complete! You touched grass. Time to log your field note.');
      exitAmbientFieldMode();
      document.getElementById('btn-open-log-modal').click();
    } else {
      updateDisplay();
    }
  }, 1000);
}

function exitAmbientFieldMode() {
  if (ambientTimerInterval) clearInterval(ambientTimerInterval);
  document.getElementById('ambient-overlay').classList.remove('active');
}

function renderSpeciesSoundboard() {
  const container = document.getElementById('species-soundboard-grid');
  const speciesList = bioAcoustic.getSpeciesList();

  container.innerHTML = speciesList.map(s => `
    <button class="species-test-btn" data-species="${s.id}">
      <span class="species-name-bold">${s.commonName}</span>
      <span class="species-latin">${s.scientificName}</span>
      <span style="font-family:var(--font-mono); font-size:0.7rem; color:#fde68a;">Freq: ${s.peakFreq} Hz</span>
    </button>
  `).join('');

  container.querySelectorAll('.species-test-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.species-test-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const speciesId = btn.getAttribute('data-species');
      const result = bioAcoustic.synthesizeBirdCall(speciesId);
      displayBioAcousticResult(result);
    });
  });
}

function displayBioAcousticResult(res) {
  const s = res.species;
  document.getElementById('audio-species-common').textContent = s.commonName;
  document.getElementById('audio-species-scientific').textContent = s.scientificName;
  document.getElementById('audio-species-pattern').textContent = s.pattern;
  document.getElementById('audio-peak-freq').textContent = `${s.peakFreq.toLocaleString()} Hz`;
  document.getElementById('audio-confidence-tag').textContent = `Confidence: ${(res.confidence * 100).toFixed(1)}%`;
  document.getElementById('audio-conservation').textContent = s.conservation;
  document.getElementById('audio-habitat-text').textContent = s.habitat;
  document.getElementById('audio-fft-status').textContent = `Inferred: ${s.commonName} (${(res.confidence * 100).toFixed(0)}%)`;
}

function renderSpecimens() {
  const container = document.getElementById('specimen-selector-row');
  const specimens = bioVision.getPresetSpecimens();

  container.innerHTML = specimens.map(s => `
    <button class="btn-secondary-action btn-specimen-select ${s.id === currentSpecimen.id ? 'active' : ''}" data-specimen="${s.id}">
      ${s.commonName.split(' ')[0]}
    </button>
  `).join('');

  container.querySelectorAll('.btn-specimen-select').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.btn-specimen-select').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.getAttribute('data-specimen');
      currentSpecimen = bioVision.getSpecimenById(id);
      displaySpecimen(currentSpecimen);
    });
  });

  displaySpecimen(currentSpecimen);
}

async function displaySpecimen(s) {
  const imgEl = document.getElementById('vision-specimen-img');
  imgEl.src = s.image;

  document.getElementById('vision-common-name').textContent = s.commonName;
  document.getElementById('vision-scientific-name').textContent = `${s.scientificName} (Family: ${s.family})`;
  document.getElementById('vision-category-tag').textContent = s.category;
  document.getElementById('vision-confidence-tag').textContent = `Confidence: ${(s.confidence * 100).toFixed(0)}%`;
  document.getElementById('vision-forage-text').textContent = s.foragingStatus + (s.safetyWarning ? `\n\n⚠️ ${s.safetyWarning}` : '');
  document.getElementById('vision-field-notes').textContent = s.fieldNotes;
  document.getElementById('vision-niche').textContent = s.ecologicalNiche;

  // Run real pixel analysis
  const analysis = await bioVision.analyzeImagePixels(imgEl);
  document.getElementById('bar-anthocyanin').style.width = `${analysis.pigments.anthocyanin}%`;
  document.getElementById('bar-carotenoid').style.width = `${analysis.pigments.carotenoid}%`;
  document.getElementById('bar-chlorophyll').style.width = `${analysis.pigments.chlorophyll}%`;

  document.getElementById('pct-anthocyanin').textContent = `${analysis.pigments.anthocyanin}%`;
  document.getElementById('pct-carotenoid').textContent = `${analysis.pigments.carotenoid}%`;
  document.getElementById('pct-chlorophyll').textContent = `${analysis.pigments.chlorophyll}%`;
  document.getElementById('foliage-phase-badge').textContent = analysis.foliageStage;
}

function renderJournal() {
  const container = document.getElementById('journal-entries-container');
  const entries = questEngine.getJournalEntries();

  if (entries.length === 0) {
    container.innerHTML = `<div style="font-size:0.85rem; color:#9ca3af;">No field entries yet. Complete a quest and step outside!</div>`;
    return;
  }

  container.innerHTML = entries.map(e => `
    <div class="journal-entry-card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="journal-title">${e.badge || '🌿'} ${e.questTitle}</span>
        <span class="journal-date">${e.displayDate || 'Recently'}</span>
      </div>
      <p class="journal-notes">${e.notes}</p>
      ${e.weather ? `<div style="font-size:0.75rem; color:#86efac; font-family:var(--font-mono);">🌤️ ${e.weather}</div>` : ''}
    </div>
  `).join('');
}

function populateRouteLocations() {
  if (!routeEngine) return;
  const select = document.getElementById('select-trail-location');
  const locs = routeEngine.getLocations();

  select.innerHTML = locs.map(l => `<option value="${l.name}">${l.name} (${l.state})</option>`).join('');

  select.addEventListener('change', () => {
    const activeDistBtn = document.querySelector('.btn-dist-select.active');
    const km = activeDistBtn ? parseInt(activeDistBtn.getAttribute('data-km')) : 5;
    const route = routeEngine.generateLoopRoute(km, select.value);
    displayRouteMetrics(route);
  });

  if (routeEngine.currentRoute) {
    displayRouteMetrics(routeEngine.currentRoute);
  }
}

function displayRouteMetrics(r) {
  document.getElementById('route-title-text').textContent = r.name;
  document.getElementById('route-dist-val').textContent = `${r.distanceKm.toFixed(1)} km`;
  document.getElementById('route-ele-val').textContent = `+${r.elevationGainM} m`;
  document.getElementById('route-canopy-val').textContent = `${r.canopyPct}%`;
  document.getElementById('route-foliage-val').textContent = `${r.foliageScore} / 100`;

  const wpList = document.getElementById('route-waypoints-list');
  wpList.innerHTML = r.waypoints.map(wp => `
    <div style="display:flex; gap:0.5rem; align-items:flex-start;">
      <span>${wp.icon}</span>
      <div>
        <b style="color:#f0fdf4;">${wp.name}</b>
        <div style="color:#9ca3af; font-size:0.75rem;">${wp.note}</div>
      </div>
    </div>
  `).join('');
}

function renderGarden(zone = '6') {
  const data = gardenEngine.getTasksForZone(zone);
  
  document.getElementById('frost-first-val').textContent = data.profile.firstFrost;
  document.getElementById('frost-last-val').textContent = data.profile.lastFrost;
  document.getElementById('frost-min-val').textContent = data.profile.avgMinTemp;

  const container = document.getElementById('garden-tasks-container');
  container.innerHTML = data.tasks.map(t => `
    <div style="background:rgba(8,20,12,0.7); border:1px solid ${t.isCompleted ? 'rgba(74,222,128,0.4)' : 'rgba(74,222,128,0.1)'}; padding:0.85rem; border-radius:var(--radius-sm); display:flex; gap:0.75rem; align-items:flex-start;">
      <input type="checkbox" class="task-checkbox" data-id="${t.id}" ${t.isCompleted ? 'checked' : ''} style="margin-top:0.25rem; accent-color:#22c55e; width:18px; height:18px; cursor:pointer;" />
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-family:var(--font-heading); font-size:0.95rem; font-weight:700; color:${t.isCompleted ? '#86efac' : '#f0fdf4'}; text-decoration:${t.isCompleted ? 'line-through' : 'none'};">
            ${t.icon} ${t.name}
          </span>
          <span style="font-size:0.7rem; font-family:var(--font-mono); color:#fde68a;">${t.category}</span>
        </div>
        <p style="font-size:0.82rem; color:#cbd5e1; margin-top:0.25rem;">${t.soilAction}</p>
        <div style="font-size:0.72rem; color:#86efac; font-family:var(--font-mono); margin-top:0.25rem;">🕒 Depth: ${t.depth} // ${t.timing}</div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.task-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.getAttribute('data-id');
      gardenEngine.toggleTask(id);
      renderGarden(zone);
    });
  });
}
