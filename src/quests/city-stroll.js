import {
  AMBIENT_LINES,
  CHAPTER_TITLE,
  FINALE_MEMORIES,
  GROUP_CHAT,
  HIDDEN_HINTS,
  RETURN_CONFLICT,
  SIDE_QUESTS,
  STORY_MOMENTS,
  STORY_STAGES,
} from '../data/chapter-one.js';
import {
  clearChapterOneProgress,
  createChapterOneProgress,
  loadChapterOneProgress,
  persistChapterOneProgress,
} from '../save/save-system.js';

const PORTA_ARRIVAL = { x: -2, z: 68 };

function clampStage(index) {
  return Math.max(0, Math.min(STORY_STAGES.length - 1, Number(index) || 0));
}

export class CityStrollQuest {
  constructor({ world, playerName, callbacks = {} }) {
    this.world = world;
    this.playerName = playerName;
    this.callbacks = callbacks;
    this.progress = loadChapterOneProgress();
    this.stageIndex = clampStage(this.progress.stageIndex);
    this.mode = this.progress.mode || 'arrival';
    this.talking = false;
    this.finished = Boolean(this.progress.completed);
    this.promptVisible = false;
    this.nextAmbientAt = Infinity;
    this.currentTime = 0;
    this.playerPosition = null;
    this.completedEvents = new Set(this.progress.optionalEvents);
    this.foundHints = new Set(this.progress.hints);
    this.memories = new Set(this.progress.memories);
    this.sideQuests = Object.fromEntries(SIDE_QUESTS.map(({ id }) => [id, this.progress.sideQuests?.[id] || 'available']));
    this.sideQuestTutorialSeen = Boolean(this.progress.sideQuestTutorialSeen);
    this.returnConflictPlayed = false;
    this.syncSideQuests();
  }

  get stage() {
    return STORY_STAGES[this.stageIndex] || STORY_STAGES[0];
  }

  save(extra = {}) {
    this.progress = {
      ...this.progress,
      ...extra,
      started: true,
      completed: this.finished,
      mode: this.mode,
      stageIndex: this.stageIndex,
      recruited: [...this.world.questFriends ? Object.values(this.world.questFriends)
        .filter((friend) => friend.userData.questFriend.recruited)
        .map((friend) => friend.userData.questFriend.id) : []],
      memories: [...this.memories],
      optionalEvents: [...this.completedEvents],
      sideQuests: { ...this.sideQuests },
      sideQuestTutorialSeen: this.sideQuestTutorialSeen,
      hints: [...this.foundHints],
    };
    persistChapterOneProgress(this.progress);
  }

  reset() {
    clearChapterOneProgress();
    this.progress = createChapterOneProgress();
    this.sideQuests = Object.fromEntries(SIDE_QUESTS.map(({ id }) => [id, 'available']));
    this.sideQuestTutorialSeen = false;
    this.syncSideQuests();
  }

  setMoment(id) {
    const moment = STORY_MOMENTS[id] || STORY_MOMENTS.arrival;
    this.progress.moment = id;
    this.world.setEveningProgress?.(moment.light);
    this.callbacks.onTimeOfDay?.(moment.clock);
  }

  addMemory(label) {
    if (this.memories.has(label)) return;
    this.memories.add(label);
    this.callbacks.onMemory?.(label);
    this.save();
  }

  begin(time = 0) {
    this.currentTime = time;
    this.syncSideQuests();
    if (this.progress.started && !this.progress.completed) {
      this.restoreProgress();
      return;
    }
    this.mode = 'arrival';
    this.finished = false;
    this.stageIndex = 0;
    this.setMoment('arrival');
    this.world.setQuestTarget(null);
    this.callbacks.onTutorial?.('WASD oder Klick zum Laufen · E zum Ansprechen · M für die Karte');
    this.talking = true;
    const completeChat = () => {
      this.talking = false;
      this.addMemory('Willkommen in Trier');
      this.beginRouteToPorta();
    };
    if (this.callbacks.onChat) this.callbacks.onChat(GROUP_CHAT, completeChat);
    else this.callbacks.onDialogue?.(GROUP_CHAT.messages, completeChat);
  }

  restoreProgress() {
    this.stageIndex = clampStage(this.progress.stageIndex);
    this.mode = this.progress.mode || 'routeToPorta';
    this.finished = Boolean(this.progress.completed);
    this.setMoment(this.progress.moment || 'arrival');
    (this.progress.recruited || []).forEach((id) => this.world.recruitFriend(id, this.playerPosition || this.world.arrivalPoint));
    if (this.finished) {
      this.world.setQuestTarget(null);
      this.callbacks.onQuestChange?.({ title: CHAPTER_TITLE, objective: 'Kapitel abgeschlossen. Trier gehört jetzt dir.', count: 'ENDE', targetId: null });
      this.callbacks.onChapterComplete?.({ memories: [...this.memories] });
      return;
    }
    if (this.mode === 'routeToPorta') this.beginRouteToPorta(true);
    else if (this.mode === 'routeToMarket') this.beginRouteToMarket(true);
    else if (this.mode === 'explore') this.setStage(this.stageIndex, true);
    else if (this.mode === 'return') this.beginReturnToWine(true);
    else if (this.mode === 'portaReturn') this.startWalkToPorta(true);
    else this.beginRouteToPorta(true);
  }

  beginRouteToPorta(restoring = false) {
    this.mode = 'routeToPorta';
    this.world.setQuestTarget(null);
    this.callbacks.onQuestChange?.({
      title: CHAPTER_TITLE,
      objective: 'Geh Richtung Porta Nigra und anschließend zum Hauptmarkt.',
      count: 'ANKOMMEN',
      targetId: 'porta',
    });
    this.setPrompt(null);
    if (!restoring) this.save();
  }

  beginRouteToMarket(restoring = false) {
    this.mode = 'routeToMarket';
    this.setMoment('porta');
    this.world.setQuestTarget('johannes');
    this.addMemory('Erster Blick auf die Porta Nigra');
    this.callbacks.onQuestChange?.({
      title: CHAPTER_TITLE,
      objective: 'Geh weiter zum Hauptmarkt. Johannes wartet am Weinstand.',
      count: 'ANKOMMEN',
      targetId: 'johannes',
    });
    this.setPrompt(null);
    if (!restoring) this.save();
  }

  setStage(index, restoring = false) {
    this.stageIndex = clampStage(index);
    this.mode = 'explore';
    const stage = this.stage;
    this.setMoment(stage.moment);
    this.world.setQuestTarget(stage.id);
    this.callbacks.onQuestChange?.({
      title: CHAPTER_TITLE,
      objective: stage.objective,
      count: `${this.stageIndex + 1}/${STORY_STAGES.length}`,
      targetId: stage.id,
    });
    this.setPrompt(null);
    if (!restoring) this.save();
  }

  isNear(target, position, radius = 2.25) {
    const point = target?.position || target;
    if (!point || !position) return false;
    const dx = position.x - point.x;
    const dz = position.z - point.z;
    return dx * dx + dz * dz < radius * radius;
  }

  sideQuestById(id) {
    return SIDE_QUESTS.find((quest) => quest.id === id) || null;
  }

  sideQuestObjective(quest, state) {
    if (state === 'completed') return 'Abgeschlossen';
    if (state === 'active') return quest.objective;
    if (state === 'found') return 'Bring das Plektrum zurück zum Straßenmusiker.';
    return `Sprich mit ${quest.npc}.`;
  }

  sideQuestEntries() {
    return SIDE_QUESTS
      .filter((quest) => this.sideQuests[quest.id] !== 'available')
      .map((quest) => ({
        id: quest.id,
        title: quest.title,
        objective: this.sideQuestObjective(quest, this.sideQuests[quest.id]),
        state: this.sideQuests[quest.id],
      }));
  }

  syncSideQuests() {
    SIDE_QUESTS.forEach((quest) => this.world.setSideQuestState?.(quest.id, this.sideQuests[quest.id] || 'available'));
    this.callbacks.onSideQuestChange?.(this.sideQuestEntries());
  }

  discoverSideQuest(quest) {
    if (this.sideQuests[quest.id] !== 'available') return;
    this.sideQuests[quest.id] = 'discovered';
    if (!this.sideQuestTutorialSeen) {
      this.sideQuestTutorialSeen = true;
      this.callbacks.onTutorial?.('Nebenquests sind freiwillige kleine Begegnungen.');
    }
    this.syncSideQuests();
    this.save();
  }

  nearbySideQuest(position) {
    for (const quest of SIDE_QUESTS) {
      const state = this.sideQuests[quest.id] || 'available';
      if (state === 'completed') continue;
      if ((state === 'available' || state === 'discovered') && this.isNear(quest.point, position, 2.35)) {
        this.discoverSideQuest(quest);
        return { type: 'npc', quest };
      }
      if (state === 'active' && quest.id === 'lost-plectrum' && this.isNear(quest.target, position, .82)) {
        return { type: 'plectrum', quest };
      }
      if (state === 'found' && quest.id === 'lost-plectrum' && this.isNear(quest.point, position, 2.25)) {
        return { type: 'return', quest };
      }
      if (state === 'active' && quest.id !== 'lost-plectrum' && this.isNear(quest.target, position, 1.45)) {
        // The companion may be a step behind the player due to collision
        // avoidance. Reaching the marked place is enough to finish the small
        // encounter; the world then settles the companion at the destination.
        return { type: 'target', quest };
      }
    }
    return null;
  }

  nearbyDiscovery(position) {
    const hint = HIDDEN_HINTS.find((item) => !this.foundHints.has(item.id) && this.isNear(item.point, position, 2.05));
    return hint ? { ...hint, type: 'hint' } : null;
  }

  update(frame) {
    if (this.finished || this.talking) return;
    const position = frame.position;
    this.playerPosition = position;
    this.currentTime = frame.time;

    if (this.mode === 'routeToPorta') {
      const atPorta = frame.location?.zone === 'porta' || this.isNear(PORTA_ARRIVAL, position, 9.5);
      if (atPorta) this.beginRouteToMarket();
      return;
    }

    const discovery = this.nearbyDiscovery(position);
    const sideQuestInteraction = ['routeToMarket', 'explore', 'return', 'portaReturn'].includes(this.mode)
      ? this.nearbySideQuest(position)
      : null;
    const sidePrompt = sideQuestInteraction?.type === 'npc'
      ? sideQuestInteraction.quest.prompt
      : sideQuestInteraction?.type === 'plectrum'
        ? 'Plektrum aufheben'
        : sideQuestInteraction?.type === 'return'
          ? 'Plektrum zurückgeben'
          : sideQuestInteraction?.type === 'target'
            ? sideQuestInteraction.quest.id === 'porta-photo'
              ? 'Den Aussichtspunkt erreichen'
              : 'Touristen zum Domfreihof begleiten'
            : null;
    // These two accompanying encounters should feel like a natural arrival,
    // not like a second button press after the player has already guided the
    // person to the clearly marked location.
    if (sideQuestInteraction?.type === 'target') {
      this.completeSideQuest(sideQuestInteraction.quest);
      return;
    }
    if (this.mode === 'routeToMarket' || this.mode === 'explore') {
      const stage = this.stage;
      const friend = this.world.questFriends[stage.id];
      this.setPrompt(this.isNear(friend, position) ? `Mit ${stage.name} sprechen` : sidePrompt || discovery?.prompt || null);
    } else if (this.mode === 'return') {
      this.setPrompt(this.isNear(this.world.wineStandPoint, position, 3) ? 'Mit der Gruppe am Weinstand zusammensitzen' : sidePrompt || discovery?.prompt || null);
      if (!this.returnConflictPlayed && frame.time >= this.nextAmbientAt) this.playReturnConflict();
    } else if (this.mode === 'portaReturn') {
      this.setPrompt(this.isNear(this.world.portaFinalePoint, position, 2.25) ? 'Den zweiten Viezporz ansehen' : sidePrompt || discovery?.prompt || null);
    }

    const canChatOnWalk = ['explore', 'return', 'portaReturn'].includes(this.mode) && this.world.recruitedCount > 0;
    if (canChatOnWalk && frame.time >= this.nextAmbientAt) this.playAmbient(frame);
  }

  setPrompt(label) {
    if (this.promptVisible === label) return;
    this.promptVisible = label;
    this.callbacks.onPrompt?.(label);
  }

  interact(position) {
    if (this.finished || this.talking) return;
    const discovery = this.nearbyDiscovery(position);
    const sideQuestInteraction = this.nearbySideQuest(position);
    const canMeetFriend = this.mode === 'routeToMarket' || this.mode === 'explore';
    if (canMeetFriend) {
      const stage = this.stage;
      const friend = this.world.questFriends[stage.id];
      if (this.isNear(friend, position)) {
        this.startFriendConversation(stage);
        return;
      }
    }
    if (this.mode === 'return' && this.isNear(this.world.wineStandPoint, position, 3)) {
      this.beginWineStand();
      return;
    }
    if (this.mode === 'portaReturn' && this.isNear(this.world.portaFinalePoint, position, 2.25)) {
      this.beginPortaCliffhanger();
      return;
    }
    if (sideQuestInteraction) {
      this.interactSideQuest(sideQuestInteraction);
      return;
    }
    if (discovery) this.playDiscovery(discovery);
  }

  playDiscovery(discovery) {
    this.talking = true;
    this.setPrompt(null);
    this.callbacks.onDialogue?.(discovery.lines, () => {
      if (discovery.type === 'hint') this.foundHints.add(discovery.id);
      else this.completedEvents.add(discovery.id);
      this.addMemory(discovery.memory);
      this.talking = false;
      this.nextAmbientAt = this.currentTime + 40 + Math.random() * 24;
      this.save();
    });
  }

  interactSideQuest(interaction) {
    const { quest } = interaction;
    if (interaction.type === 'npc') {
      this.startSideQuestConversation(quest);
      return;
    }
    if (interaction.type === 'plectrum') {
      this.pickUpPlectrum(quest);
      return;
    }
    if (interaction.type === 'return' || interaction.type === 'target') this.completeSideQuest(quest);
  }

  startSideQuestConversation(quest) {
    this.talking = true;
    this.setPrompt(null);
    this.callbacks.onDialogue?.(quest.opening, () => {
      this.callbacks.onChoice?.({ speaker: quest.npc, text: 'Was sagst du?', choices: quest.choices }, (choice) => {
        if (choice === 'accept') {
          this.activateSideQuest(quest);
          return;
        }
        const reply = quest.replies?.[choice] || [];
        this.callbacks.onDialogue?.(reply, () => {
          this.talking = false;
          this.nextAmbientAt = this.currentTime + 26 + Math.random() * 18;
        });
      });
    });
  }

  activateSideQuest(quest) {
    this.sideQuests[quest.id] = 'active';
    this.syncSideQuests();
    this.save();
    this.callbacks.onDialogue?.([
      { speaker: 'Optionale Nebenquest', text: `${quest.title}: ${quest.objective}` },
    ], () => {
      this.talking = false;
      this.nextAmbientAt = this.currentTime + 38 + Math.random() * 20;
    });
  }

  pickUpPlectrum(quest) {
    this.talking = true;
    this.setPrompt(null);
    this.sideQuests[quest.id] = 'found';
    this.syncSideQuests();
    this.save();
    this.callbacks.onDialogue?.([
      { speaker: 'Du', text: 'Du hebst das Plektrum zwischen den Pflastersteinen auf.' },
    ], () => {
      this.talking = false;
      this.nextAmbientAt = this.currentTime + 24 + Math.random() * 16;
    });
  }

  completeSideQuest(quest) {
    this.talking = true;
    this.setPrompt(null);
    this.sideQuests[quest.id] = 'completed';
    this.syncSideQuests();
    this.save();
    const charlyJoins = quest.id === 'lost-plectrum' && this.world.questFriends?.charly?.userData.questFriend.recruited
      ? [{ speaker: 'Charly', text: 'Siehst du? Hat sich doch gelohnt.' }]
      : [];
    this.callbacks.onDialogue?.([...quest.completion, ...charlyJoins], () => {
      this.addMemory(quest.memory);
      this.talking = false;
      this.nextAmbientAt = this.currentTime + 42 + Math.random() * 24;
      this.save();
    });
  }

  startFriendConversation(stage) {
    this.talking = true;
    this.setPrompt(null);
    const seenTourist = stage.id === 'marc' && this.sideQuests['find-the-dom'] === 'completed'
      ? [{ speaker: 'Tourist', text: 'Danke noch einmal für den Tipp! Der Weg zum Dom war wirklich nicht zu verfehlen.' }]
      : [];
    this.callbacks.onDialogue?.([...seenTourist, ...stage.opening], () => {
      this.callbacks.onChoice?.(stage.choice, (choice) => {
        const reply = stage.choice.replies[choice] || [];
        this.callbacks.onDialogue?.([...reply, ...stage.closing], () => this.finishStage(stage));
      });
    });
  }

  finishStage(stage) {
    this.world.recruitFriend(stage.id, this.playerPosition);
    this.addMemory(stage.memory);
    this.talking = false;
    this.nextAmbientAt = this.currentTime + 48 + Math.random() * 34;
    if (this.stageIndex < STORY_STAGES.length - 1) {
      this.setStage(this.stageIndex + 1);
      return;
    }
    this.beginReturnToWine();
  }

  beginReturnToWine(restoring = false) {
    this.mode = 'return';
    this.setMoment('weber');
    this.world.setQuestTarget(null);
    this.addMemory('Alle sind da');
    this.callbacks.onQuestChange?.({ title: CHAPTER_TITLE, objective: 'Kehrt gemeinsam zum Weinstand am Hauptmarkt zurück.', count: '5/5', targetId: 'return' });
    this.nextAmbientAt = this.currentTime + 38 + Math.random() * 22;
    this.setPrompt(null);
    if (!restoring) this.save();
  }

  playReturnConflict() {
    this.returnConflictPlayed = true;
    this.talking = true;
    this.setPrompt(null);
    this.callbacks.onDialogue?.(RETURN_CONFLICT, () => {
      this.talking = false;
      this.nextAmbientAt = this.currentTime + 58 + Math.random() * 32;
    });
  }

  playAmbient(frame) {
    const candidates = (AMBIENT_LINES[frame.location?.zone] || []).filter((line) => line.requires <= this.world.recruitedCount);
    this.nextAmbientAt = frame.time + 50 + Math.random() * 40;
    if (!candidates.length || this.talking) return;
    const line = candidates[Math.floor(Math.random() * candidates.length)];
    this.talking = true;
    this.setPrompt(null);
    this.callbacks.onDialogue?.([{ speaker: line.speaker, text: line.text }], () => { this.talking = false; });
  }

  beginWineStand() {
    this.mode = 'wine';
    this.talking = true;
    this.setMoment('wine');
    this.setPrompt(null);
    this.world.seatFriendsAtWine();
    this.callbacks.onWineMoment?.();
    this.callbacks.onDialogue?.([
      { speaker: 'Johannes', text: 'So. Jetzt sind wir wirklich alle da.' },
      { speaker: 'Johannes', text: 'Was darf es sein?' },
    ], () => {
      this.callbacks.onChoice?.({
        speaker: 'Weinstand', text: 'Du bestellst:',
        choices: [{ id: 'viez', label: 'Viez' }, { id: 'bier', label: 'Bier' }, { id: 'schorle', label: 'Schorle' }],
      }, (choice) => this.startQuietMoment(choice));
    });
  }

  startQuietMoment(choice) {
    const drinks = {
      viez: 'Sehr vernünftig.',
      bier: 'Auch akzeptabel.',
      schorle: 'Dann bleibt wenigstens einer von uns aufmerksam.',
    };
    this.progress.drink = choice;
    this.callbacks.onDialogue?.([{ speaker: 'Johannes', text: drinks[choice] || drinks.viez }], () => {
      this.mode = 'quiet';
      this.talking = false;
      this.callbacks.onQuestChange?.({ title: CHAPTER_TITLE, objective: 'Genießt für einen Moment den Abend.', count: '5/5', targetId: null });
      this.save();
      // The pause is intentional but never blocks the player for long.
      window.setTimeout(() => this.startMemoryRound(), 2200);
    });
  }

  startMemoryRound() {
    if (this.mode !== 'quiet') return;
    this.mode = 'memories';
    this.talking = true;
    this.callbacks.onDialogue?.([
      { speaker: 'Johannes', text: 'Ich mag eigentlich genau solche Abende. Kein Plan. Einfach loslaufen und schauen, was passiert.' },
      { speaker: 'Marc', text: 'Am besten sind sowieso die Abende, an denen man angeblich nur kurz bleibt.' },
      { speaker: 'Jürgen', text: 'Und am Ende steht man irgendwo, wo man gar nicht hinwollte.' },
      { speaker: 'Charly', text: 'Aber meistens kennt dort jemand jemanden.' },
      { speaker: 'Weber', text: '…' },
    ], () => this.startLegend());
  }

  startLegend() {
    this.mode = 'legend';
    this.talking = true;
    this.setMoment('legend');
    this.world.revealWebersPorz?.();
    this.addMemory('Webers alter Viezporz');
    this.callbacks.onDialogue?.([
      { speaker: 'Charly', text: 'Bitte erzähl jetzt nicht schon wieder diese Geschichte.' },
      { speaker: 'Weber', text: 'Warum eigentlich?' },
      { speaker: 'Johannes', text: 'Weil jedes Mal etwas anderes passiert.' },
      { speaker: 'Weber', text: 'Genau deshalb.' },
      { speaker: 'Weber', text: 'Den Porz habe ich von meinem Großvater bekommen. Er hat immer behauptet, es gäbe noch einen zweiten.' },
      { speaker: 'Marc', text: 'Natürlich.' },
      { speaker: 'Weber', text: 'Einen Goldenen.' },
      { speaker: 'Marc', text: 'Jetzt wird es langsam besser.' },
      { speaker: 'Weber', text: 'Vor vielen Jahren traf sich hier am Weinstand jedes Wochenende dieselbe Gruppe von Freunden.' },
      { speaker: 'Weber', text: 'Sie lachten. Sie tranken. Sie zogen gemeinsam durch Trier.' },
      { speaker: 'Weber', text: 'Eines Abends verschwand einer von ihnen.' },
      { speaker: 'Weber', text: 'Wochen später behaupteten Menschen, sie hätten ihn mit einem goldenen Viezporz durch Trier laufen sehen.' },
      { speaker: 'Weber', text: 'Seitdem erzählt man sich, dass es zwei Porze gibt. Diesen hier. Und den Goldenen.' },
      { speaker: 'Weber', text: 'Mein Großvater sagte immer: Wenn beide wieder zusammenkommen, beginnt eine Geschichte, die besser vergessen geblieben wäre.' },
      { speaker: 'Marc', text: 'Du hast gerade noch gesagt, du hättest ihm nicht geglaubt.' },
      { speaker: 'Weber', text: 'Habe ich auch nicht.' },
    ], () => this.startWalkToPorta());
  }

  startWalkToPorta(restoring = false) {
    this.world.releaseFriendsFromWine?.();
    this.callbacks.onWineMomentEnd?.();
    this.addMemory('Die Legende vom Goldenen Viezporz');
    this.mode = 'portaReturn';
    this.talking = false;
    this.nextAmbientAt = this.currentTime + 52 + Math.random() * 24;
    this.callbacks.onQuestChange?.({ title: CHAPTER_TITLE, objective: 'Geht gemeinsam Richtung Porta Nigra.', count: 'Abendspaziergang', targetId: 'porta' });
    this.setPrompt(null);
    if (!restoring) this.save();
  }

  beginPortaCliffhanger() {
    this.mode = 'cliffhanger';
    this.talking = true;
    this.setMoment('finale');
    this.setPrompt(null);
    this.world.revealGoldenLight();
    this.callbacks.onProgress?.(true);
    this.callbacks.onDialogue?.([
      { speaker: 'Johannes', text: 'Lag der eben schon da?' },
      { speaker: 'Marc', text: 'Nein.' },
      { speaker: 'Charly', text: 'Ganz sicher nicht.' },
      { speaker: 'Jürgen', text: 'Das ist doch derselbe.' },
      { speaker: 'Weber', text: 'Nein. Meiner ist hier.' },
      { speaker: 'Erzählung', text: 'Für zwei Sekunden schimmert der zweite Porz warm golden. Ein kurzes Klirren. Dann ist es wieder still.' },
      { speaker: 'Weber', text: '…das kann nicht sein.' },
      { speaker: 'Weber', text: 'Wir sollten morgen wiederkommen.' },
    ], () => {
      this.addMemory('Ein Sommerabend');
      this.addMemory('Der zweite Porz');
      FINALE_MEMORIES.forEach((memory) => this.addMemory(memory));
      this.finished = true;
      this.save({ completed: true, mode: 'complete' });
      this.callbacks.onChapterComplete?.({ memories: [...this.memories], drink: this.progress.drink });
      this.callbacks.onCinematic?.(this.world.portaFinalePoint || this.world.goldenLightPosition, 5.6);
    });
  }
}
