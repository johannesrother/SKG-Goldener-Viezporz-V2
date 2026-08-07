const SAVE_KEY = 'skg-goldener-viezporz-v1';
const CHAPTER_ONE_KEY = 'skg-chapter-one-progress-v2';

export function createFreshSave(profile) {
  return {
    version: 1,
    profile: {
      name: profile.name?.trim().slice(0, 20) || 'Gast',
      outfit: profile.outfit || 'wald',
      hair: profile.hair || 'dunkel',
    },
    storyStep: 0,
    companions: [],
    inventory: [],
    memories: [],
    settings: { volume: 0.45, quality: 'auto' },
    player: { x: -16.5, z: -0.3 },
    completed: false,
  };
}

export function loadSave() {
  try {
    const value = localStorage.getItem(SAVE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value);
    if (parsed?.version !== 1 || !parsed.profile) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function persist(save) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

// The story has a deliberately small, standalone save payload. It is kept
// separate from the character profile so new chapters can add their own
// progress without invalidating a player's appearance or settings.
export function createChapterOneProgress() {
  return {
    version: 2,
    started: false,
    completed: false,
    mode: 'arrival',
    stageIndex: 0,
    recruited: [],
    memories: [],
    optionalEvents: [],
    sideQuests: {},
    sideQuestTutorialSeen: false,
    hints: [],
    drink: null,
    moment: 'arrival',
  };
}

export function loadChapterOneProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(CHAPTER_ONE_KEY) || 'null');
    if (!value || value.version !== 2) return createChapterOneProgress();
    return {
      ...createChapterOneProgress(),
      ...value,
      recruited: Array.isArray(value.recruited) ? value.recruited : [],
      memories: Array.isArray(value.memories) ? value.memories : [],
      optionalEvents: Array.isArray(value.optionalEvents) ? value.optionalEvents : [],
      sideQuests: value.sideQuests && typeof value.sideQuests === 'object' ? value.sideQuests : {},
      sideQuestTutorialSeen: Boolean(value.sideQuestTutorialSeen),
      hints: Array.isArray(value.hints) ? value.hints : [],
    };
  } catch {
    return createChapterOneProgress();
  }
}

export function persistChapterOneProgress(progress) {
  localStorage.setItem(CHAPTER_ONE_KEY, JSON.stringify({
    ...createChapterOneProgress(),
    ...progress,
    version: 2,
  }));
}

export function clearChapterOneProgress() {
  localStorage.removeItem(CHAPTER_ONE_KEY);
}
