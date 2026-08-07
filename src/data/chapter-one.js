export const CHAPTER_TITLE = 'Ein Freitagabend in Trier';

export const GROUP_CHAT = {
  title: 'SKG',
  messages: [
    { speaker: 'Johannes', text: 'Willkommen in Trier!' },
    { speaker: 'Johannes', text: 'Keine Eile. Wir sammeln uns wie immer.' },
    { speaker: 'Marc', text: 'Johannes schreibt „keine Eile“ und sitzt bestimmt seit zwanzig Minuten am Weinstand.' },
    { speaker: 'Charly', text: 'Ich bin noch unterwegs.' },
    { speaker: 'Jürgen', text: 'Ich auch.' },
    { speaker: 'Weber', text: 'Bis gleich.' },
  ],
};

export const STORY_MOMENTS = {
  arrival: { light: 0, clock: 'Freitag, 19:30' },
  porta: { light: .12, clock: 'Freitag, 19:40' },
  johannes: { light: .22, clock: 'Freitag, 19:47' },
  marc: { light: .36, clock: 'Freitag, 20:02' },
  juergen: { light: .48, clock: 'Freitag, 20:18' },
  charly: { light: .6, clock: 'Freitag, 20:35' },
  weber: { light: .7, clock: 'Freitag, 20:48' },
  wine: { light: .82, clock: 'Freitag, 21:05' },
  legend: { light: .9, clock: 'Freitag, 21:18' },
  finale: { light: 1, clock: 'Freitag, 21:31' },
};

export const STORY_STAGES = [
  {
    id: 'johannes', name: 'Johannes', place: 'Weinstand', moment: 'johannes', memory: 'Der erste SKG',
    objective: 'Triff Johannes am Weinstand auf dem Hauptmarkt.',
    opening: [
      { speaker: 'Johannes', text: 'Da bist du ja.' },
      { speaker: 'Johannes', text: 'Schön, dass du da bist. Eigentlich wollten wir schon los – aber wie immer fehlen noch fast alle.' },
    ],
    choice: {
      speaker: 'Johannes', text: 'Was sagst du?',
      choices: [
        { id: 'missing', label: 'Wer fehlt denn noch?' },
        { id: 'collect', label: 'Dann sammeln wir sie eben ein.' },
        { id: 'viez', label: 'Erst mal einen Viez?' },
      ],
      replies: {
        missing: [{ speaker: 'Johannes', text: 'Marc, Jürgen, Charly und Weber. Also eigentlich fast alle.' }],
        collect: [{ speaker: 'Johannes', text: 'Genau die richtige Einstellung.' }],
        viez: [{ speaker: 'Johannes', text: 'Endlich stellt mal jemand die wichtigen Fragen.' }],
      },
    },
    closing: [{ speaker: 'Johannes', text: 'Marc müsste am Domfreihof sein. Komm, wir drehen einen kleinen SKG.' }],
  },
  {
    id: 'marc', name: 'Marc', place: 'Domfreihof', moment: 'marc', memory: 'Sonnenuntergang am Dom',
    objective: 'Triff Marc am Domfreihof.',
    opening: [
      { speaker: 'Marc', text: 'Ich wusste doch, dass ihr wieder später dran seid als geplant.' },
      { speaker: 'Johannes', text: 'Wir sind pünktlich.' },
      { speaker: 'Marc', text: 'Natürlich.' },
    ],
    choice: {
      speaker: 'Marc', text: 'Marc schaut zum Dom hinüber.',
      choices: [
        { id: 'come', label: 'Kommst du mit?' },
        { id: 'others', label: 'Wir suchen noch die anderen.' },
        { id: 'place', label: 'Schöner Platz hier.' },
      ],
      replies: {
        come: [{ speaker: 'Marc', text: 'Offenbar. Jemand muss ja kontrollieren, dass Johannes keinen Umweg vergisst.' }],
        others: [{ speaker: 'Marc', text: 'Dann sollten wir los. Sonst werden aus fünf Minuten wieder Trierer Zeit.' }],
        place: [{ speaker: 'Marc', text: 'Man vergisst manchmal, wie schön Trier eigentlich ist. Gerade um diese Uhrzeit.' }],
      },
    },
    closing: [{ speaker: 'Johannes', text: 'Jürgen steckt bestimmt wieder irgendwo in einer kleinen Gasse.' }],
  },
  {
    id: 'juergen', name: 'Jürgen', place: 'Margaretengäßchen', moment: 'juergen', memory: 'Eine versteckte Ecke von Trier',
    objective: 'Triff Jürgen im Margaretengäßchen.',
    opening: [
      { speaker: 'Jürgen', text: 'Na? Habt ihr euch verlaufen?' },
      { speaker: 'Marc', text: 'Wir haben nur auf dich gewartet.' },
      { speaker: 'Jürgen', text: 'Das rede ich mir später auch ein.' },
    ],
    choice: {
      speaker: 'Jürgen', text: 'Die Gasse wird abends angenehm ruhig.',
      choices: [
        { id: 'come', label: 'Komm mit.' },
        { id: 'others', label: 'Wir suchen noch Charly und Weber.' },
        { id: 'hidden', label: 'Ganz schön versteckt hier.' },
      ],
      replies: {
        come: [{ speaker: 'Jürgen', text: 'Wenn ihr verspricht, nicht wieder die offensichtliche Route zu nehmen.' }],
        others: [{ speaker: 'Jürgen', text: 'Dann seid ihr ja fast schon organisiert.' }],
        hidden: [{ speaker: 'Jürgen', text: 'Die meisten laufen einfach vorbei. Dabei sind die kleinen Ecken oft die besten.' }],
      },
    },
    closing: [{ speaker: 'Johannes', text: 'Charly ist am Kornmarkt. Falls er dort nicht schon wieder jeden kennt.' }],
  },
  {
    id: 'charly', name: 'Charly', place: 'Kornmarkt', moment: 'charly', memory: 'Charly am Kornmarkt',
    objective: 'Triff Charly am Kornmarkt.',
    opening: [
      { speaker: 'Charly', text: 'Na endlich. Ich dachte schon, ihr seid direkt im Chrome gelandet.' },
      { speaker: 'Johannes', text: 'Alle Wege führen ins Chrome.' },
      { speaker: 'Marc', text: 'Aber offenbar nicht sofort.' },
    ],
    choice: {
      speaker: 'Charly', text: 'Charly winkt gleichzeitig zwei Menschen auf dem Platz zu.',
      choices: [
        { id: 'come', label: 'Komm mit.' },
        { id: 'weber', label: 'Uns fehlt noch Weber.' },
        { id: 'everyone', label: 'Kennst du hier wirklich jeden?' },
      ],
      replies: {
        come: [{ speaker: 'Charly', text: 'Sowieso. Aber ich verabschiede mich vorher noch von mindestens drei Leuten.' }],
        weber: [{ speaker: 'Charly', text: 'Der sitzt bestimmt in der Fleischstraße und beobachtet das Leben sehr ernsthaft.' }],
        everyone: [{ speaker: 'Charly', text: 'Nicht jeden.' }, { speaker: 'Passantin', text: 'Charly! Grüß dich!' }, { speaker: 'Charly', text: 'Fast jeden.' }],
      },
    },
    closing: [{ speaker: 'Charly', text: 'Weber wartet in der Fleischstraße. Dann ist die Besetzung komplett.' }],
  },
  {
    id: 'weber', name: 'Weber', place: 'Fleischstraße', moment: 'weber', memory: 'Alle sind da',
    objective: 'Triff Weber in der Fleischstraße.',
    opening: [
      { speaker: 'Weber', text: 'Jetzt seid ihr endlich komplett.' },
      { speaker: 'Johannes', text: 'Eigentlich fehlst nur noch du.' },
      { speaker: 'Weber', text: 'Vielleicht.' },
    ],
    choice: {
      speaker: 'Weber', text: 'Weber wirkt nachdenklich, aber nicht unfreundlich.',
      choices: [
        { id: 'wine', label: 'Komm mit zum Weinstand.' },
        { id: 'complete', label: 'Jetzt sind wir komplett.' },
        { id: 'waiting', label: 'Du wirkst, als würdest du auf etwas warten.' },
      ],
      replies: {
        wine: [{ speaker: 'Weber', text: 'Einverstanden. Ein Abend fängt am Weinstand erst richtig an.' }],
        complete: [{ speaker: 'Weber', text: 'Dann sollten wir das ausnutzen, bevor jemand wieder verschwindet.' }],
        waiting: [{ speaker: 'Weber', text: 'Vielleicht warte ich auch nur darauf, dass ihr endlich auftaucht.' }],
      },
    },
    closing: [{ speaker: 'Johannes', text: 'Zurück zum Weinstand. Und diesmal gehen wir wirklich direkt.' }, { speaker: 'Marc', text: 'Das glaube ich erst, wenn wir dort sitzen.' }],
  },
];

// These are deliberately the only three side quests in chapter one.  They
// share the story world but have their own state, icon language and quest-log
// section so they never compete with the evening's main walk.
export const SIDE_QUESTS = [
  {
    id: 'porta-photo',
    title: 'DER BESTE BLICK AUF DIE PORTA',
    shortTitle: 'Der beste Blick auf die Porta',
    npc: 'Fotografin',
    point: { x: -8.3, z: 60.2 },
    target: { x: -5.8, z: 76.2 },
    memory: 'Der beste Blick auf die Porta',
    objective: 'Führe die Fotografin zu einem guten Aussichtspunkt.',
    prompt: 'Optionale Nebenquest: Der beste Blick auf die Porta',
    opening: [
      { speaker: 'Fotografin', text: 'Entschuldigung.' },
      { speaker: 'Fotografin', text: 'Ich versuche seit zehn Minuten ein vernünftiges Foto von der Porta zu machen.' },
      { speaker: 'Fotografin', text: 'Aber entweder läuft jemand durchs Bild oder ich stehe komplett falsch.' },
    ],
    choices: [
      { id: 'accept', label: 'Ich kenne einen guten Platz.' },
      { id: 'hint', label: 'Versuch es etwas weiter hinten.' },
      { id: 'later', label: 'Tut mir leid, ich muss weiter.' },
    ],
    replies: {
      hint: [{ speaker: 'Fotografin', text: 'Weiter hinten? Das ist immerhin genauer als meine bisherige Strategie.' }],
      later: [{ speaker: 'Fotografin', text: 'Kein Problem. Die Porta läuft mir hoffentlich nicht weg.' }],
    },
    completion: [
      { speaker: 'Fotografin', text: 'Ja.' },
      { speaker: 'Fotografin', text: 'Genau so. Danke dir.' },
      { speaker: 'Fotografin', text: 'Jetzt sieht die Porta endlich so aus, wie sie sich anfühlt.' },
    ],
  },
  {
    id: 'lost-plectrum',
    title: 'DAS VERLORENE PLEKTRUM',
    shortTitle: 'Das verlorene Plektrum',
    npc: 'Straßenmusiker',
    point: { x: 1.15, z: 39.4 },
    target: { x: -2.15, z: 34.15 },
    memory: 'Das verlorene Plektrum',
    objective: 'Suche in der Nähe des Straßenmusikers.',
    prompt: 'Optionale Nebenquest: Das verlorene Plektrum',
    opening: [
      { speaker: 'Straßenmusiker', text: 'Mist.' },
      { speaker: 'Straßenmusiker', text: 'Mein Plektrum ist irgendwo runtergefallen.' },
      { speaker: 'Straßenmusiker', text: 'Ohne das Ding klingt das alles nur halb so gut.' },
    ],
    choices: [
      { id: 'accept', label: 'Ich suche kurz danach.' },
      { id: 'hint', label: 'Vielleicht liegt es direkt hier.' },
      { id: 'later', label: 'Ich muss weiter.' },
    ],
    replies: {
      hint: [{ speaker: 'Straßenmusiker', text: 'Wenn es direkt hier läge, hätte ich schon wieder angefangen zu spielen.' }],
      later: [{ speaker: 'Straßenmusiker', text: 'Verstehe ich. Mein Plektrum hat offenbar mehr Zeit als wir beide.' }],
    },
    completion: [
      { speaker: 'Straßenmusiker', text: 'Da ist es ja.' },
      { speaker: 'Straßenmusiker', text: 'Dann bekommt ihr jetzt wenigstens ein vernünftiges Lied.' },
    ],
  },
  {
    id: 'find-the-dom',
    title: 'WO IST DER DOM?',
    shortTitle: 'Wo ist der Dom?',
    npc: 'Touristenpaar',
    point: { x: 6.2, z: 8.0 },
    target: { x: -45.5, z: 7.0 },
    memory: 'Der Weg zum Dom',
    objective: 'Bringe die Touristen zum Domfreihof.',
    prompt: 'Optionale Nebenquest: Wo ist der Dom?',
    opening: [
      { speaker: 'Touristin', text: 'Entschuldigung.' },
      { speaker: 'Tourist', text: 'Wir suchen den Dom.' },
      { speaker: 'Touristin', text: 'Irgendwie laufen wir immer wieder im Kreis.' },
    ],
    choices: [
      { id: 'accept', label: 'Ich kann euch den Weg zeigen.' },
      { id: 'hint', label: 'Durch die Sternstraße.' },
      { id: 'later', label: 'Ich bin selbst gerade erst angekommen.' },
    ],
    replies: {
      hint: [{ speaker: 'Tourist', text: 'Sternstraße. Das klingt schon deutlich weniger nach Kreis.' }],
      later: [{ speaker: 'Touristin', text: 'Dann sind wir wenigstens nicht die Einzigen, die sich orientieren müssen.' }],
    },
    completion: [
      { speaker: 'Touristin', text: 'Da ist er ja!' },
      { speaker: 'Tourist', text: 'Danke. Ohne dich wären wir wahrscheinlich wieder an der Porta gelandet.' },
    ],
  },
];

export const HIDDEN_HINTS = [
  { id: 'postcard', point: { x: -69, z: 91 }, prompt: 'Eine alte Postkarte ansehen', memory: 'Seltsame Postkarte', lines: [{ speaker: 'Notiz', text: 'Auf der vergilbten Karte ist ein kleines goldenes Gefäß neben der Porta skizziert.' }] },
  { id: 'mural', point: { x: -34, z: 88 }, prompt: 'Ein Wandbild betrachten', memory: 'Ein verblasstes Wandbild', lines: [{ speaker: 'Notiz', text: 'Zwischen den Farben zeichnet sich ein Porz ab. Wahrscheinlich Zufall. Vielleicht auch nicht.' }] },
  { id: 'graffiti', point: { x: 29, z: 68 }, prompt: 'Das Graffiti lesen', memory: 'Eine alte Gravur', lines: [{ speaker: 'Graffiti', text: 'ZWEI PORZE · EIN ABEND · KEINE EILE' }] },
  { id: 'reflection', point: { x: -9.5, z: -26.5 }, prompt: 'Einen goldenen Reflex ansehen', memory: 'Goldener Reflex', lines: [{ speaker: 'Du', text: 'Ein Fenster fängt die Abendsonne ein. Für einen Moment sieht es aus wie Gold.' }] },
];

export const AMBIENT_LINES = {
  christophstrasse: [{ requires: 0, speaker: 'Erinnerung', text: 'Ankommen, tief durchatmen, dann einfach loslaufen.' }],
  porta: [{ requires: 0, speaker: 'Erinnerung', text: 'An der Porta merkt man sofort: Jetzt ist man wirklich in Trier.' }],
  simeonstrasse: [{ requires: 1, speaker: 'Johannes', text: 'Marc steht bestimmt wieder irgendwo rum und behauptet, er hätte auf uns gewartet.' }, { requires: 3, speaker: 'Jürgen', text: 'Da vorne gibt es das beste Eis. Das ist keine Meinung, das ist Orientierung.' }],
  hauptmarkt: [{ requires: 1, speaker: 'Johannes', text: 'Hier ist heute richtig was los. Genau so muss ein Freitag aussehen.' }, { requires: 3, speaker: 'Jürgen', text: 'Wenn wir hier kurz stehen bleiben, findet uns Trier schon wieder.' }],
  domfreihof: [{ requires: 2, speaker: 'Marc', text: 'Der Dom sieht heute irgendwie besonders gut aus. Frech eigentlich.' }],
  margaretengaesschen: [{ requires: 3, speaker: 'Jürgen', text: 'Die kleinen Gassen sind der Beweis, dass man sich ruhig mal verlaufen darf.' }],
  kornmarkt: [{ requires: 4, speaker: 'Charly', text: 'Hier treffen wir später bestimmt noch jemanden. Oder alle auf einmal.' }],
  fleischstrasse: [{ requires: 5, speaker: 'Weber', text: 'Von hier ist es nicht mehr weit. In Trier ist das eine ziemlich genaue Angabe.' }],
};

export const RETURN_CONFLICT = [
  { speaker: 'Charly', text: 'Nur noch fünf Minuten am Kornmarkt.' },
  { speaker: 'Marc', text: 'Das sind bei dir mindestens zwanzig.' },
  { speaker: 'Jürgen', text: 'Wir könnten abstimmen.' },
  { speaker: 'Weber', text: 'Oder einfach weiterlaufen.' },
  { speaker: 'Johannes', text: 'Weinstand zuerst. Danach darf wieder völlig ohne Plan weitergelaufen werden.' },
];

export const FINALE_MEMORIES = [
  'Willkommen in Trier', 'Erster Blick auf die Porta Nigra', 'Der erste SKG', 'Alle sind da',
  'Ein Sommerabend', 'Webers alter Viezporz', 'Die Legende vom Goldenen Viezporz', 'Der zweite Porz',
];
