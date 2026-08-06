const STAGES = [
  {
    id: 'johannes',
    name: 'Johannes',
    objective: 'Treffe Johannes am Weinstand.',
  },
  {
    id: 'marc',
    name: 'Marc',
    objective: 'Triff Marc am Domfreihof.',
    lines: () => [
      { speaker: 'Marc', text: 'Ich wusste doch, ihr seid wieder später dran als geplant.' },
      { speaker: 'Johannes', text: 'Wir sind pünktlich.' },
      { speaker: 'Marc', text: 'Natürlich.' },
      { speaker: 'Marc', text: 'Hier ist es wenigstens ruhig. Und der Dom sieht bei Sonnenuntergang immer so aus, als hätte er das alles geplant.' },
      { speaker: 'Johannes', text: 'Komm mit. Jürgen zeigt uns bestimmt wieder eine Ecke, die angeblich niemand kennt.' },
    ],
  },
  {
    id: 'juergen',
    name: 'Jürgen',
    objective: 'Triff Jürgen im Margaretengäßchen.',
    lines: () => [
      { speaker: 'Jürgen', text: 'Na? Habt ihr euch verlaufen?' },
      { speaker: 'Marc', text: 'Wir haben nur auf dich gewartet.' },
      { speaker: 'Jürgen', text: 'Das rede ich mir später auch ein.' },
      { speaker: 'Jürgen', text: 'Die kleinen Gassen sind besser. Da merkt man wenigstens, dass Trier nicht nur aus Blickachsen besteht.' },
      { speaker: 'Johannes', text: 'Charly ist am Kornmarkt. Falls er nicht gerade wieder jemanden kennt.' },
    ],
  },
  {
    id: 'charly',
    name: 'Charly',
    objective: 'Triff Charly am Kornmarkt.',
    lines: () => [
      { speaker: 'Charly', text: 'Na endlich. Ich dachte, ihr seid direkt im Chrome gelandet.' },
      { speaker: 'Charly', text: 'Ah, hi! Ja, später! Grüß deine Schwester!' },
      { speaker: 'Marc', text: 'Du kennst wirklich jeden, oder?' },
      { speaker: 'Charly', text: 'Nicht jeden. Aber die interessanten Leute erkennt man ja.' },
      { speaker: 'Charly', text: 'Weber sitzt in der Fleischstraße. Der beobachtet bestimmt gerade wieder das Leben und nennt es Recherche.' },
    ],
  },
  {
    id: 'weber',
    name: 'Weber',
    objective: 'Triff Weber in der Fleischstraße.',
    lines: () => [
      { speaker: 'Weber', text: 'Jetzt seid ihr endlich komplett.' },
      { speaker: 'Johannes', text: 'Eigentlich fehlst nur noch du.' },
      { speaker: 'Weber', text: 'Vielleicht.' },
      { speaker: 'Charly', text: 'Das war wieder eine komplette Weber-Antwort.' },
      { speaker: 'Weber', text: 'Dann gehen wir zurück. Ein Abend fängt erst am Weinstand richtig an.' },
    ],
  },
];

const OPTIONAL_EVENTS = [
  {
    id: 'plectrum',
    point: { x: -14.1, z: 71.8 },
    prompt: 'Dem Straßenmusiker helfen',
    memory: 'Ein Lied vor der Porta',
    lines: [
      { speaker: 'Straßenmusiker', text: 'Mein Plektrum hat sich offenbar für eine eigene Stadtführung entschieden.' },
      { speaker: 'Du', text: 'Es liegt direkt neben deinem Koffer.' },
      { speaker: 'Straßenmusiker', text: 'Perfekt. Trier ist klein, aber mein Blickfeld offensichtlich kleiner.' },
    ],
  },
  {
    id: 'tourist',
    point: { x: -8.2, z: 57.9 },
    prompt: 'Einem Touristen den Weg zeigen',
    memory: 'Ein guter Weg',
    lines: [
      { speaker: 'Tourist', text: 'Entschuldigung – geht es von hier zum Dom?' },
      { speaker: 'Du', text: 'Durch die Simeonstraße zum Hauptmarkt und dann die Sternstraße entlang.' },
      { speaker: 'Tourist', text: 'Danke! Dann schaue ich mir unterwegs wohl noch viel mehr Trier an.' },
    ],
  },
  {
    id: 'dog',
    point: { x: -7.2, z: 68.2 },
    prompt: 'Den kleinen Hund begrüßen',
    memory: 'Eine neugierige Begegnung',
    lines: [
      { speaker: 'Hundebesitzerin', text: 'Milo wollte unbedingt noch die Tauben kontrollieren.' },
      { speaker: 'Du', text: 'Er nimmt seine Aufgabe offensichtlich sehr ernst.' },
      { speaker: 'Hundebesitzerin', text: 'Das ist der erste sinnvolle Plan, den er heute hatte.' },
    ],
  },
  {
    id: 'photo',
    point: { x: -5.4, z: 59.7 },
    prompt: 'Einem Fotografen helfen',
    memory: 'Blick auf die Porta',
    lines: [
      { speaker: 'Fotograf', text: 'Von wo sieht die Porta eigentlich am besten aus?' },
      { speaker: 'Du', text: 'Ein paar Schritte zurück. Dann passt der ganze Bogen ins Bild.' },
      { speaker: 'Fotograf', text: 'Genau. Manchmal braucht es nur einen Schritt weniger Eile.' },
    ],
  },
  {
    id: 'pigeons',
    point: { x: -2.7, z: 67.9 },
    prompt: 'Den Tauben zusehen',
    memory: 'Tauben am Abend',
    lines: [
      { speaker: 'Kind', text: 'Die da kennt mich schon.' },
      { speaker: 'Du', text: 'Dann bist du hier wohl Stammgast.' },
      { speaker: 'Kind', text: 'Klar. Die Porta ist unser Treffpunkt.' },
    ],
  },
];

const AMBIENT_LINES = {
  hauptbahnhof: [
    { requires: 0, speaker: 'Erinnerung', text: 'Ankommen, tief durchatmen, dann einfach loslaufen.' },
  ],
  christophstrasse: [
    { requires: 1, speaker: 'Johannes', text: 'Vom Bahnhof bis zur Porta hat Trier schon ziemlich viel Feierabend vor.' },
  ],
  porta: [
    { requires: 1, speaker: 'Johannes', text: 'An der Porta merkt man sofort: Jetzt ist man wirklich in Trier.' },
  ],
  simeonstrasse: [
    { requires: 2, speaker: 'Marc', text: 'Eine Einkaufsstraße, zwei Richtungen und trotzdem stehen alle mitten im Weg. Klassisch.' },
    { requires: 3, speaker: 'Jürgen', text: 'Da vorne gibt es das beste Eis. Das ist keine Meinung, das ist Orientierung.' },
  ],
  hauptmarkt: [
    { requires: 1, speaker: 'Johannes', text: 'Hier ist heute richtig was los. Genau so muss ein Freitag aussehen.' },
    { requires: 3, speaker: 'Jürgen', text: 'Wenn wir hier kurz stehen bleiben, findet uns Trier schon wieder.' },
  ],
  domfreihof: [
    { requires: 2, speaker: 'Marc', text: 'Der Dom sieht heute irgendwie besonders gut aus. Frech eigentlich.' },
    { requires: 2, speaker: 'Johannes', text: 'Wir haben keinen Plan. Aber wir haben einen Dom. Das zählt fast.' },
  ],
  margaretengaesschen: [
    { requires: 3, speaker: 'Jürgen', text: 'Die kleinen Gassen sind der Beweis, dass man sich ruhig mal verlaufen darf.' },
  ],
  kornmarkt: [
    { requires: 4, speaker: 'Charly', text: 'Hier treffen wir später bestimmt noch jemanden. Oder alle auf einmal.' },
    { requires: 3, speaker: 'Jürgen', text: 'Ein Brunnen macht jeden Platz automatisch so, als wäre alles geregelt.' },
  ],
  fleischstrasse: [
    { requires: 5, speaker: 'Weber', text: 'Von hier ist es nicht mehr weit. In Trier ist das eine ziemlich genaue Angabe.' },
    { requires: 4, speaker: 'Johannes', text: 'Wir bleiben zusammen. Das ist die wichtigste Regel vom SKG.' },
  ],
  brotstrasse: [
    { requires: 2, speaker: 'Marc', text: 'Brotstraße. Der Name verspricht viel und löst damit sofort Hunger aus.' },
  ],
};

const CHAPTER_TITLE = 'Ein Freitagabend in Trier';

export class CityStrollQuest {
  constructor({ world, playerName, callbacks = {} }) {
    this.world = world;
    this.playerName = playerName;
    this.callbacks = callbacks;
    this.stageIndex = 0;
    this.mode = 'arrival';
    this.talking = false;
    this.finished = false;
    this.promptVisible = false;
    this.nextAmbientAt = Infinity;
    this.quietUntil = 0;
    this.currentTime = 0;
    this.completedEvents = new Set();
  }

  begin(time = 0) {
    this.currentTime = time;
    this.mode = 'arrival';
    this.world.setQuestTarget(null);
    this.callbacks.onQuestChange?.({
      title: CHAPTER_TITLE,
      objective: 'Komm entspannt am Hauptmarkt an. Johannes wartet später am Weinstand.',
      count: 'ANKOMMEN',
      targetId: null,
    });
    this.talking = true;
    this.callbacks.onDialogue?.([
      { speaker: 'Johannes', text: `Willkommen in Trier, ${this.playerName}!` },
      { speaker: 'Johannes', text: 'Wir treffen uns später am Weinstand.' },
      { speaker: 'Johannes', text: 'Aber komm ganz entspannt. Die anderen treiben sich sowieso wieder überall herum.' },
    ], () => {
      this.talking = false;
      this.setStage(0);
      this.nextAmbientAt = this.currentTime + 55 + Math.random() * 28;
    });
  }

  get stage() {
    return STAGES[this.stageIndex] || null;
  }

  setStage(index) {
    this.stageIndex = index;
    this.mode = 'explore';
    const stage = this.stage;
    this.world.setQuestTarget(stage.id);
    this.callbacks.onQuestChange?.({ title: CHAPTER_TITLE, objective: stage.objective, count: `${index + 1}/5`, targetId: stage.id });
    this.setPrompt(null);
  }

  isNear(target, position, radius = 2.25) {
    const point = target?.position || target;
    if (!point || !position) return false;
    const dx = position.x - point.x;
    const dz = position.z - point.z;
    return dx * dx + dz * dz < radius * radius;
  }

  nearbyOptional(position) {
    return OPTIONAL_EVENTS.find((event) => !this.completedEvents.has(event.id) && this.isNear(event.point, position, 2.05));
  }

  update(frame) {
    if (this.finished || this.talking) return;
    const position = frame.position;
    this.playerPosition = position;
    this.currentTime = frame.time;

    if (this.mode === 'quiet') {
      if (frame.time >= this.quietUntil) this.startMemoryRound();
      return;
    }

    const optional = this.nearbyOptional(position);
    if (this.mode === 'explore') {
      const stage = this.stage;
      const friend = this.world.questFriends[stage.id];
      this.setPrompt(this.isNear(friend, position) ? `Mit ${stage.name} sprechen` : optional?.prompt || null);
    } else if (this.mode === 'return') {
      this.setPrompt(this.isNear(this.world.wineStandPoint, position, 3) ? 'Mit der Gruppe am Weinstand zusammensitzen' : optional?.prompt || null);
    } else if (this.mode === 'portaReturn') {
      this.setPrompt(this.isNear(this.world.portaFinalePoint, position, 2.25) ? 'Den alten Viezporz ansehen' : optional?.prompt || null);
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
    const optional = this.nearbyOptional(position);

    if (this.mode === 'explore') {
      const stage = this.stage;
      const friend = this.world.questFriends[stage.id];
      if (this.isNear(friend, position)) {
        this.talking = true;
        this.setPrompt(null);
        if (stage.id === 'johannes') this.startJohannesConversation(stage);
        else this.callbacks.onDialogue?.(stage.lines(this.playerName), () => this.finishStage(stage));
        return;
      }
      if (optional) this.playOptional(optional);
      return;
    }

    if (this.mode === 'return' && this.isNear(this.world.wineStandPoint, position, 3)) {
      this.beginWineStand();
      return;
    }
    if (this.mode === 'portaReturn' && this.isNear(this.world.portaFinalePoint, position, 2.25)) {
      this.beginPortaCliffhanger();
      return;
    }
    if (optional) this.playOptional(optional);
  }

  playOptional(event) {
    this.talking = true;
    this.setPrompt(null);
    this.callbacks.onDialogue?.(event.lines, () => {
      this.completedEvents.add(event.id);
      this.callbacks.onMemory?.(event.memory);
      this.talking = false;
      this.nextAmbientAt = this.currentTime + 38 + Math.random() * 22;
    });
  }

  startJohannesConversation(stage) {
    const opening = [
      { speaker: 'Johannes', text: `Da bist du ja, ${this.playerName}.` },
      { speaker: 'Johannes', text: 'Perfektes Timing.' },
      { speaker: 'Johannes', text: 'Eigentlich wollten wir schon los … aber wie immer fehlen noch fast alle.' },
    ];
    this.callbacks.onDialogue?.(opening, () => {
      this.callbacks.onChoice?.({
        speaker: 'Johannes',
        text: 'Was sagst du?',
        choices: [
          { id: 'missing', label: 'Wer fehlt denn?' },
          { id: 'collect', label: 'Dann sammeln wir sie eben ein.' },
          { id: 'viez', label: 'Erst mal einen Viez?' },
        ],
      }, (choice) => {
        const replies = {
          missing: 'Marc, Jürgen, Charly und Weber. Also praktisch alle, die behauptet haben, sie wären gleich da.',
          collect: 'Das ist die richtige Einstellung. Trier ist klein genug, wir finden sie schon.',
          viez: 'Verlockend. Aber wenn wir jetzt anfangen, kommen wir morgen noch nicht am Dom an.',
        };
        this.callbacks.onDialogue?.([
          { speaker: 'Johannes', text: replies[choice] || replies.collect },
          { speaker: 'Johannes', text: 'Komm. Marc wartet bestimmt wieder am Dom.' },
        ], () => this.finishStage(stage, 'Der erste SKG'));
      });
    });
  }

  finishStage(stage, memory = null) {
    this.world.recruitFriend(stage.id, this.playerPosition);
    if (memory) this.callbacks.onMemory?.(memory);
    if (stage.id === 'weber') this.callbacks.onMemory?.('Alle sind da');
    this.callbacks.onProgress?.(false);
    this.talking = false;
    this.nextAmbientAt = (this.currentTime || 0) + 48 + Math.random() * 34;
    if (this.stageIndex < STAGES.length - 1) {
      this.setStage(this.stageIndex + 1);
      return;
    }
    this.mode = 'return';
    this.world.setQuestTarget(null);
    this.callbacks.onQuestChange?.({ title: CHAPTER_TITLE, objective: 'Geht gemeinsam zurück zum Weinstand am Hauptmarkt.', count: '5/5', targetId: 'return' });
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
    this.setPrompt(null);
    this.world.seatFriendsAtWine();
    this.callbacks.onWineMoment?.();
    this.callbacks.onDialogue?.([
      { speaker: 'Johannes', text: 'So. Jetzt sind wir wirklich alle da.' },
      { speaker: 'Charly', text: 'Die wichtige Frage: Was trinken wir?' },
    ], () => {
      this.callbacks.onChoice?.({
        speaker: 'Weinstand',
        text: 'Du bestellst:',
        choices: [
          { id: 'viez', label: 'Viez' },
          { id: 'bier', label: 'Bier' },
          { id: 'schorle', label: 'Schorle' },
        ],
      }, (choice) => this.startQuietMoment(choice));
    });
  }

  startQuietMoment(choice) {
    const drinks = {
      viez: 'Viez. Ehrensache.',
      bier: 'Ein Bier. Johannes nickt anerkennend.',
      schorle: 'Eine Schorle. Marc behauptet, das sei vernünftig.',
    };
    this.callbacks.onDialogue?.([{ speaker: this.playerName, text: drinks[choice] || drinks.viez }], () => {
      this.talking = false;
      this.mode = 'quiet';
      this.quietUntil = (this.currentTime || 0) + 6.2;
      this.callbacks.onQuestChange?.({ title: CHAPTER_TITLE, objective: 'Genießt für einen Moment den Abend.', count: '5/5', targetId: null });
    });
  }

  startMemoryRound() {
    this.mode = 'memories';
    this.talking = true;
    this.callbacks.onDialogue?.([
      { speaker: 'Johannes', text: 'Mein bester Trier-Moment? Wenn alle sagen, sie sind gleich da – und wir trotzdem irgendwann komplett sind.' },
      { speaker: 'Marc', text: 'Der Dom nach einem langen Tag. Mehr Pathos kriege ich nicht hin.' },
      { speaker: 'Jürgen', text: 'Eine Gasse, in der niemand weiß, wohin er wollte. Das ist sehr Trier.' },
      { speaker: 'Charly', text: 'Wenn ich auf dem Kornmarkt fünf Leute grüße und drei davon wirklich kenne.' },
      { speaker: 'Weber', text: 'Wenn ein Abend einfach gut bleibt, ohne dass man erklären muss warum.' },
    ], () => this.startLegend());
  }

  startLegend() {
    this.mode = 'legend';
    this.talking = true;
    this.callbacks.onDialogue?.([
      { speaker: 'Charly', text: 'Bitte erzähl jetzt nicht schon wieder diese Geschichte.' },
      { speaker: 'Weber', text: 'Warum eigentlich?' },
      { speaker: 'Johannes', text: 'Weil jedes Mal etwas anderes passiert.' },
      { speaker: 'Weber', text: 'Genau deshalb.' },
      { speaker: 'Weber', text: 'Vor vielen Jahren traf sich hier jede Woche dieselbe Gruppe von Freunden.' },
      { speaker: 'Weber', text: 'Sie trafen sich immer am Weinstand. Sie lachten, tranken und zogen gemeinsam durch Trier.' },
      { speaker: 'Weber', text: 'Eines Abends verschwand einer von ihnen.' },
      { speaker: 'Weber', text: 'Wochen später behaupteten Menschen, sie hätten ihn mit einem goldenen Viezporz durch Trier laufen sehen.' },
      { speaker: 'Weber', text: 'Seitdem erzählt man sich: Der Goldene Viezporz erscheint nur Menschen, die gemeinsam unterwegs sind.' },
      { speaker: 'Weber', text: 'Niemand weiß, ob diese Geschichte wahr ist.' },
    ], () => this.startWalkToPorta());
  }

  startWalkToPorta() {
    this.world.releaseFriendsFromWine?.();
    this.callbacks.onWineMomentEnd?.();
    this.callbacks.onMemory?.('Die Legende vom Goldenen Viezporz');
    this.mode = 'portaReturn';
    this.talking = false;
    this.nextAmbientAt = this.currentTime + 52 + Math.random() * 24;
    this.callbacks.onQuestChange?.({ title: CHAPTER_TITLE, objective: 'Geht gemeinsam Richtung Porta Nigra.', count: 'Abendspaziergang', targetId: 'porta' });
  }

  beginPortaCliffhanger() {
    this.mode = 'cliffhanger';
    this.talking = true;
    this.setPrompt(null);
    this.world.revealGoldenLight();
    this.callbacks.onProgress?.(true);
    this.callbacks.onDialogue?.([
      { speaker: 'Johannes', text: 'Der lag eben noch nicht da …' },
      { speaker: 'Marc', text: 'Bitte sag, das war nicht nur der Viez.' },
      { speaker: 'Jürgen', text: 'Das ist keine Straßenlaterne.' },
      { speaker: 'Weber', text: 'Ich habe gehofft, dass wir ihn nie finden würden …' },
    ], () => {
      this.callbacks.onMemory?.('Ein Sommerabend');
      this.finished = true;
      this.callbacks.onCinematic?.(this.world.portaFinalePoint || this.world.goldenLightPosition, 5.6);
    });
  }
}
