/**
 * TerraPulse Frost & Soil Almanac
 * Local Frost Dates, Micro-Seasons & Dirt-First Action Engine
 */

export class GardenEngine {
  constructor() {
    this.storageKey = 'terrapulse_garden_checklist';

    // USDA Hardiness Zones Frost Calendars
    this.zoneProfiles = {
      '3': { name: 'Zone 3 (Northern Plains / Cold North)', firstFrost: 'Sep 15 - Oct 1', lastFrost: 'May 15 - Jun 1', avgMinTemp: '-40°F to -30°F' },
      '4': { name: 'Zone 4 (Upper Midwest / Northern Rockies)', firstFrost: 'Sep 20 - Oct 5', lastFrost: 'May 1 - May 15', avgMinTemp: '-30°F to -20°F' },
      '5': { name: 'Zone 5 (Midwest / New England)', firstFrost: 'Oct 5 - Oct 20', lastFrost: 'Apr 20 - May 5', avgMinTemp: '-20°F to -10°F' },
      '6': { name: 'Zone 6 (Mid-Atlantic / Ohio Valley)', firstFrost: 'Oct 15 - Nov 1', lastFrost: 'Apr 10 - Apr 25', avgMinTemp: '-10°F to 0°F' },
      '7': { name: 'Zone 7 (Southeast / Mid-South / Coastal NW)', firstFrost: 'Oct 25 - Nov 15', lastFrost: 'Apr 1 - Apr 15', avgMinTemp: '0°F to 10°F' },
      '8': { name: 'Zone 8 (Deep South / Pacific NW Coast)', firstFrost: 'Nov 10 - Dec 5', lastFrost: 'Mar 15 - Apr 1', avgMinTemp: '10°F to 20°F' },
      '9': { name: 'Zone 9 (Coastal California / Florida / Texas Coast)', firstFrost: 'Dec 1 - Dec 20', lastFrost: 'Feb 15 - Mar 1', avgMinTemp: '20°F to 30°F' }
    };

    this.seasonalDatabase = [
      {
        id: 'garlic',
        name: 'Hardneck Garlic (Music, German Extra Hardy)',
        category: 'Planting',
        icon: '🧄',
        depth: '2-3 inches deep, pointy end up',
        spacing: '6 inches apart in composted soil',
        timing: '4 to 6 weeks before ground freezes solid',
        soilAction: 'Tuck cloves into soil, cover with 4 inches of straw or shredded maple leaf mulch to protect from winter freeze-thaw heaving.',
        frostSensitivity: 'Extremely Frost Hardy (Requires winter cold vernalization to form heads)'
      },
      {
        id: 'spinach_winter',
        name: 'Winter Savory Spinach & Mache',
        category: 'Planting',
        icon: '🥬',
        depth: '1/2 inch deep',
        spacing: '3-4 inches apart',
        timing: 'Late autumn under low tunnel or cold frame',
        soilAction: 'Direct sow. Young leaves develop natural cryogenic sugars to survive freezing temperatures.',
        frostSensitivity: 'Survives sub-freezing temps down to 15°F with mulch cover'
      },
      {
        id: 'winter_rye',
        name: 'Winter Rye & Hairy Vetch Cover Crop',
        category: 'Soil Regeneration',
        icon: '🌾',
        depth: 'Broadcast and lightly rake',
        spacing: 'Dense living mulch broadcast',
        timing: 'Mid-to-late autumn',
        soilAction: 'Living roots prevent soil compaction, feed mycorrhizal fungi networks, and fix free atmospheric nitrogen for spring brassicas.',
        frostSensitivity: 'Overwinters green, till or terminate in April'
      },
      {
        id: 'root_sweetening',
        name: 'Frost-Sweetened Carrots & Parsnips',
        category: 'Harvesting',
        icon: '🥕',
        depth: 'Gently loosen with garden fork',
        spacing: 'Harvest as needed through winter',
        timing: 'After first 2-3 light frosts',
        soilAction: 'Cold temperatures trigger root vegetables to convert starches into sucrose as natural anti-freeze, making them peak sweetness.',
        frostSensitivity: 'Can remain in ground under 6 inches of straw until ground frozen hard'
      },
      {
        id: 'leaf_mulch',
        name: 'Shredded Fallen Leaf Mulch Bed Blanket',
        category: 'Soil Care',
        icon: '🍂',
        depth: '3 to 5 inches thick layer',
        spacing: 'Cover all bare raised bed soil',
        timing: 'Right now as deciduous trees drop leaves',
        soilAction: 'Never send autumn leaves to landfills! Shred with mower or rake directly onto garden beds. Earthworms and fungi convert it into rich fungal humus.',
        frostSensitivity: 'Insulates soil microbes from harsh frost'
      },
      {
        id: 'native_stratification',
        name: 'Native Milkweed & Coneflower Cold Stratification',
        category: 'Biodiversity',
        icon: '🌸',
        depth: 'Surface scatter onto scratched soil',
        spacing: 'Wildflower meadow scatter',
        timing: 'Late autumn before first snow',
        soilAction: 'Native wildflower seeds require 60-90 days of moist cold temperatures (stratification) to break seed coat dormancy for spring pollinator bloom.',
        frostSensitivity: 'Requires freezing temperatures to germinate in spring'
      }
    ];
  }

  getTasksForZone(zone = '6') {
    const profile = this.zoneProfiles[zone] || this.zoneProfiles['6'];
    const checked = this.getCheckedTasks();

    return {
      zone,
      profile,
      tasks: this.seasonalDatabase.map(task => ({
        ...task,
        isCompleted: !!checked[task.id]
      }))
    };
  }

  toggleTask(taskId) {
    const checked = this.getCheckedTasks();
    checked[taskId] = !checked[taskId];
    localStorage.setItem(this.storageKey, JSON.stringify(checked));
    return checked;
  }

  getCheckedTasks() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : { leaf_mulch: true };
    } catch (e) {
      return {};
    }
  }
}
