export const tlTranslation = {
  common: {
    appName: "Sulat Baybayin",
    back: "Bumalik",
    backToHome: "Bumalik sa Home",
    backToDashboard: "Bumalik sa Dashboard",
    backToLearn: "Bumalik sa Pag-aaral",
    loading: "Naglo-load...",
    save: "I-save",
    cancel: "Kanselahin",
    close: "Isara",
    clear: "Burahin",
    copy: "Kopyahin",
    copied: "Nakopya!",
    search: "Maghanap",
    noResults: "Walang nakitang resulta",
    tryAgain: "Subukan Muli",
    reset: "I-reset",
    change: "Palitan",
    next: "Susunod",
    submit: "Ipasa",
    settings: "Mga Setting",
    help: "Sentro ng Tulong",
    signOut: "Mag-sign Out",
    profile: "Profile",
    space: "espasyo",
    delete: "Burahin",
    tip: "Tip",
  },
  navigation: {
    learn: "Mag-aral",
    transliterate: "Magsalin",
  },
  alphabet: {
    title: "Alpabetong Baybayin",
    subtitle:
      "Tuklasin ang kumpletong hanay ng mga karakter ng Baybayin. Bawat karakter ay kumakatawan sa isang pantig na binubuo ng isang katinig at isang patinig.",
    howItWorks: {
      title: "Paano Gumagana ang Baybayin",
      description:
        'Ang Baybayin ay isang abugida na sistema ng pagsulat kung saan bawat karakter ay kumakatawan sa isang katinig na may likas na "a" na patinig. Upang baguhin ang tunog ng patinig, nagdaragdag ng mga diacritical mark (kudlit) sa itaas o ibaba ng karakter.',
    },
    search: "Maghanap ng mga karakter...",
    categories: {
      all: "Lahat",
      vowels: "Mga Patinig",
      consonants: "Mga Katinig",
      special: "Espesyal",
    },
    showing: "Ipinapakita ang {{count}} karakter",
    showing_plural: "Ipinapakita ang {{count}} mga karakter",
    pronunciation: "Pagbigkas",
    examples: "Mga Halimbawa",
    copyCharacter: "Kopyahin ang karakter",
    playPronunciation: "I-play ang pagbigkas",

    // Character data
    characters: {
      a: {
        description: 'Ang patinig na "A"',
        examples: ["aso", "araw"],
      },
      i: {
        description: 'Ang patinig na "I/E"',
        examples: ["isda", "elepante"],
      },
      u: {
        description: 'Ang patinig na "U/O"',
        examples: ["ulan", "oso"],
      },
      ba: {
        description: "Ba",
        examples: ["bata", "bahay"],
      },
      ka: {
        description: "Ka",
        examples: ["kamay", "kape"],
      },
      da: {
        description: "Da/Ra",
        examples: ["dagat", "damit"],
      },
      ga: {
        description: "Ga",
        examples: ["gatas", "guro"],
      },
      ha: {
        description: "Ha",
        examples: ["halaman", "hangin"],
      },
      la: {
        description: "La",
        examples: ["lalaki", "langit"],
      },
      ma: {
        description: "Ma",
        examples: ["mata", "mahal"],
      },
      na: {
        description: "Na",
        examples: ["nanay", "niyog"],
      },
      nga: {
        description: "Nga",
        examples: ["ngayon", "ngalan"],
      },
      pa: {
        description: "Pa",
        examples: ["pamilya", "puno"],
      },
      sa: {
        description: "Sa",
        examples: ["saging", "saya"],
      },
      ta: {
        description: "Ta",
        examples: ["tatay", "tubig"],
      },
      wa: {
        description: "Wa",
        examples: ["walo", "wika"],
      },
      ya: {
        description: "Ya",
        examples: ["yaman", "yakap"],
      },
      virama: {
        description: "Nagkakansela ng patinig",
        examples: [],
      },
      kudlit_i: {
        description: "Marka sa itaas",
        examples: [],
      },
      kudlit_u: {
        description: "Marka sa ibaba",
        examples: [],
      },
    },
  },
  learn: {
    welcome: "Maligayang pagbabalik",
    title: "Matuto ng Baybayin",
    subtitle:
      "Mahasa ang sinaunang script ng Pilipinas sa pamamagitan ng interactive na mga aralin at pagsasanay",
    quickActions: "Mabilis na Aksyon",
    yourProgress: "Iyong Progreso",
    lettersLearned: "Mga titik na natutunan",
    practiceCompleted: "Nakumpletong sesyon ng pagsasanay",
    options: {
      alphabetTable: {
        title: "Talahanayan ng Alpabeto",
        description:
          "Kumpletong mga karakter ng Baybayin na may mga tunog at halimbawa",
        action: "Tingnan ang Alpabeto",
      },
      practiceWriting: {
        title: "Magsanay Sumulat",
        description:
          "Alamin ang pagkakasunod-sunod ng stroke na may real-time na feedback",
        action: "Magsimulang Sumulat",
      },
      baybayinToLatin: {
        title: "Baybayin patungong Latin",
        description: "Isalin ang tekstong Baybayin sa alpabetong Latin",
        action: "Magsimulang Magsanay",
      },
      latinToBaybayin: {
        title: "Latin patungong Baybayin",
        description: "Isalin ang tekstong Latin sa sulat Baybayin",
        action: "Magsimulang Magsanay",
      },
    },
  },
  writing: {
    title: "Magsanay Sumulat",
    guidedMode: "May Gabay na Mode",
    blindMode: "Blind Mode",
    blindPractice: "Pagsasanay na Walang Gabay",
    writeThisCharacter: "Isulat ang karakter na ito",
    progress: "Progreso",
    strokes: "{{current}}/{{total}} na stroke",
    overallAccuracy: "Kabuuang Katumpakan",
    strokeDetails: "Mga Resulta ng Stroke",
    stroke: "Stroke",
    resetPractice: "I-reset ang Pagsasanay",
    strokeGuide: "Gabay sa Stroke",
    strokeOf: "Stroke {{current}} ng {{total}}",
    direction: "Direksyon",
    characterComplete: "Kumpleto na ang Karakter",
    accuracyMessage: "Kabuuang katumpakan: {{accuracy}}%",
    character: "Karakter",
    writingCanvas: "Canvas ng Pagsusulat",
    blind: "Blind",
    switchToGuided: "Lumipat sa may gabay na mode",
    switchToBlind: "Lumipat sa blind mode",
    writeFromMemory: "Isulat mula sa memorya",
    strokeTooInaccurate:
      "Masyadong hindi tumpak ang stroke - inuulit ang karakter",
    startOver: "Magsimula muli sa umpisa",
    willRestart: "Magsisimula muli ang karakter mula sa umpisa",
    restartingCharacter: "Sinisimulang muli ang karakter...",
    followGuide:
      "Sundan ang naka-highlight na gabay na stroke (min {{min}}% katumpakan)",
  },
  practice: {
    difficulty: {
      title: "Pumili ng Kahirapan",
      beginner: {
        label: "Baguhan",
        description: "Mga indibidwal na karakter",
      },
      intermediate: {
        label: "Intermediate",
        description: "Kumpletong mga salita",
      },
      advanced: {
        label: "Advanced",
        description: "Buong mga parirala",
      },
    },
    exercise: {
      score: "Puntos",
      accuracy: "Katumpakan",
      attempts: "{{count}} subok",
      attempts_plural: "{{count}} mga subok",
      changeDifficulty: "Palitan",
      checkAnswer: "Suriin ang Sagot",
      nextExercise: "Susunod",
      showHint: "Magpakita ng Pahiwatig",
      pressEnter: "Pindutin ang Enter upang {{action}}",
      continue: "magpatuloy",
      check: "suriin ang sagot",
      correct: "Tama! Magaling!",
      incorrect: "Hindi pa tama. Patuloy na subukan!",
      hint: "Pahiwatig:",
      convertDirection: "Isalin ang {{from}} patungong {{to}}:",
      yourAnswer: "Ang Iyong Sagot",
      typeAnswer: "I-type ang katumbas sa {{script}}...",
      noExercises: "Walang Magagamit na Ehersisyo",
      noExercisesMessage:
        "Walang nakitang ehersisyo para sa antas ng kahirapan na ito.",
      correctAnswer: "Ang tamang sagot ay",
    },
    progress: {
      title: "Iyong Progreso",
      correct: "Tama",
      accuracy: "Katumpakan",
      totalAttempts: "Kabuuang mga Subok",
    },
  },
  transliteration: {
    baybayinKeyboard: "Keyboard ng Baybayin",
    keyboardTip:
      "Mag-type muna ng katinig, pagkatapos ay magdagdag ng diacritic upang baguhin ang tunog ng patinig",
    title: "Magsalin",
    subtitle: "Isalin ang teksto sa pagitan ng Latin at Baybayin",
    latinToBaybayin: "Latin → Baybayin",
    baybayinToLatin: "Baybayin → Latin",
    latinText: "Tekstong Latin",
    baybayinText: "Tekstong Baybayin",
    baybayinOutput: "Output na Baybayin",
    latinOutput: "Output na Latin",
    typeHere: "I-type ang tekstong {{script}} dito...",
    translationPlaceholder: "Ang salin sa {{script}} ay lalabas dito...",
    characters: "{{count}} karakter",
    characters_plural: "{{count}} mga karakter",
    swapDirection: "Pagpalitin ang direksyon",
    copyToClipboard: "Kopyahin sa clipboard",
    listenPronunciation: "Pakinggan ang pagbigkas",
    aboutTitle: "Tungkol sa Pagsasalin ng Baybayin",
    aboutDescription:
      'Ang Baybayin ay isang abugida kung saan bawat karakter ay kumakatawan sa isang katinig na may likas na "a" na patinig. Ang karakter na "ᜊ" ay binabasa bilang "ba". Upang baguhin ang patinig, magdagdag ng kudlit (diacritic) sa itaas para sa "i/e" o sa ibaba para sa "u/o". Ang krus na virama (᜔) ay nag-aalis ng patinig, naiiwan lamang ang katinig.',
    note: "Tandaan",
    noteDescription:
      'Ang sulat Baybayin ay may likas na kalabuan sa patinig. Ang karakter na "ᜁ" ay kumakatawan sa parehong "i" at "e", habang ang "ᜂ" ay kumakatawan sa parehong "u" at "o". Ang pagsasalin sa Latin ay gumagamit ng karaniwang anyong "i" at "u", ngunit ang nilalayong pagbigkas ay maaaring mag-iba batay sa konteksto.',
  },
};
