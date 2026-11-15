export type Language = 'hinglish' | 'hindi' | 'english';

export interface Translations {
  common: {
    appName: string;
    badge: string;
    tagline: string;
    rupee: string;
    close: string;
    cancel: string;
    ok: string;
    delete: string;
    save: string;
  };
  nav: {
    login: string;
    logout: string;
    home: string;
    openLedger: string;
    soundboxOn: string;
    soundboxMute: string;
    closingBtn: string;
    settingsTooltip: string;
    guestModeText: string;
  };
  metrics: {
    todayCash: string;
    todayCashSub: string;
    todayUdhaar: string;
    todayUdhaarSub: string;
    marketUdhaar: string;
    marketUdhaarSub: string;
    galla: string;
    recovered: string;
  };
  tabs: {
    cashTab: string;
    udhaarTab: string;
    quickAdd: string;
    cashTitle: string;
    cashEntriesCount: string;
    cashSubtitle: string;
    totalCashLabel: string;
    cashEmptyTitle: string;
    cashEmptyInstruction: string;
    udhaarTitle: string;
    udhaarPendingCount: string;
    udhaarSubtitle: string;
    filterPending: string;
    filterSettled: string;
    filterAll: string;
    searchPlaceholder: string;
    udhaarEmptyTitle: string;
    udhaarEmptyInstruction: string;
    statusPending: string;
    statusSettled: string;
    settledAtPrefix: string;
    settleBtn: string;
    settledFull: string;
    reminderBtn: string;
    phonePrompt: string;
  };
  voiceHub: {
    speakBtn: string;
    stopBtn: string;
    analyzing: string;
    subtextRecording: string;
    subtextAnalyzing: string;
    subtextIdle: string;
    tryLabel: string;
    micErrorText: string;
    samplePrompts: string[];
  };
  closingModal: {
    title: string;
    todayTitle: string;
    drawerCashLabel: string;
    drawerBreakdown: (cash: number, rec: number) => string;
    cashSalesTile: string;
    cashSalesCount: (n: number) => string;
    todayCreditTile: string;
    todayCreditCount: (n: number) => string;
    creditRecoveredTile: string;
    creditRecoveredCount: (n: number) => string;
    marketPendingTile: string;
    marketPendingSub: string;
    topDebtorsTitle: string;
    shareWhatsAppBtn: string;
    copyBtnTooltip: string;
    voiceBtnTooltip: string;
    copiedAlert: string;
    speechSummary: (cash: number, credit: number, rec: number, drawer: number) => string;
  };
  manualAddModal: {
    title: string;
    typeCash: string;
    typeCredit: string;
    amountLabel: string;
    customerNameLabel: string;
    customerNamePlaceholder: string;
    tagLabel: string;
    tagPlaceholder: string;
    phoneLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    categoryLabel: string;
    categories: {
      chai: string;
      snacks: string;
      cigarettes: string;
      beverages: string;
      grocery: string;
      other: string;
    };
    submitBtn: string;
    amountAlert: string;
    customerNameAlert: string;
  };
  settingsModal: {
    title: string;
    subtitle: string;
    profileInfo: string;
    shopNameLabel: string;
    shopNamePlaceholder: string;
    emailLabel: string;
    accountTypeLabel: string;
    guestBadge: string;
    cloudBadge: string;
    offlineBadge: string;
    offlineDesc: string;
    soundboxTestBtn: string;
    testSpeech: string;
    resetBtn: string;
    resetConfirm: string;
    saveBtn: string;
    saveSuccess: string;
    logoutBtn: string;
    loginBtn: string;
    logoutSuccess: string;
  };
  landing: {
    navLogin: string;
    navOpen: string;
    badge: string;
    heroH1Line1: string;
    heroH1Gradient: string;
    heroDesc: string;
    ctaDashboard: string;
    ctaGoogle: string;
    simTitle: string;
    simListen: string;
    simEmpty: string;
    simAnalyzing: string;
    pillarsTitle: string;
    pillarsSubtitle: string;
    p1Title: string;
    p1Desc: string;
    p2Title: string;
    p2Desc: string;
    p3Title: string;
    p3Desc: string;
    p4Title: string;
    p4Desc: string;
    compTitle: string;
    diaryTitle: string;
    diaryItems: string[];
    voiceTitle: string;
    voiceItems: string[];
    footerCtaTitle: string;
    footerCtaSubtitle: string;
    footerCtaBtn: string;
    footerCopyright: string;
  };
  login: {
    titleSignIn: string;
    titleSignUp: string;
    subSignIn: string;
    subSignUp: string;
    tabSignIn: string;
    tabSignUp: string;
    googleBtn: string;
    orEmail: string;
    shopNameLabel: string;
    shopNamePlaceholder: string;
    emailLabel: string;
    passwordLabel: string;
    btnSignIn: string;
    btnSignUp: string;
    guestBtn: string;
    footerText: string;
  };
}

export const translations: Record<Language, Translations> = {
  hindi: {
    common: {
      appName: 'बहीखाता',
      badge: 'आवाज़',
      tagline: 'हाथ खाली, हिसाब पक्का',
      rupee: '₹',
      close: 'बंद करें',
      cancel: 'रद्द करें',
      ok: 'ठीक है',
      delete: 'हटाएं',
      save: 'सुरक्षित करें',
    },
    nav: {
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      home: 'होम',
      openLedger: 'बहीखाता खोलें',
      soundboxOn: 'साउंडबॉक्स चालू',
      soundboxMute: 'म्यूट',
      closingBtn: 'दुकान बंद',
      settingsTooltip: 'दुकानदार प्रोफ़ाइल & लॉगआउट (Profile / Logout)',
      guestModeText: 'अतिथि मोड (Guest Mode) • डेटा डिवाइस पर सुरक्षित',
    },
    metrics: {
      todayCash: 'आज की नकद कमाई',
      todayCashSub: 'नकद + ऑनलाइन बिक्री',
      todayUdhaar: 'आज का नया उधार',
      todayUdhaarSub: 'आज दिया गया उधार',
      marketUdhaar: 'कुल बाज़ार उधारी',
      marketUdhaarSub: 'बाज़ार से लेना बाकी है',
      galla: 'गल्ला (नकद हाथ में)',
      recovered: 'उधार वसूली',
    },
    tabs: {
      cashTab: 'नकद कमाई',
      udhaarTab: 'उधार खाता',
      quickAdd: 'हाथ से लिखें',
      cashTitle: 'नकद कमाई की सूची',
      cashEntriesCount: 'बिक्री',
      cashSubtitle: 'आज की कुल नकद और UPI बिक्री',
      totalCashLabel: 'कुल नकद',
      cashEmptyTitle: 'अभी कोई नकद बिक्री दर्ज नहीं हुई है',
      cashEmptyInstruction: 'नीचे माइक बटन दबाएं और बोलें, जैसे: "२ चाय बीस रुपये की"',
      udhaarTitle: 'उधार खाता (क्रेडिट बुक)',
      udhaarPendingCount: 'बाकी',
      udhaarSubtitle: 'ग्राहकों का बकाया और वसूली',
      filterPending: 'बाकी',
      filterSettled: 'जमा',
      filterAll: 'सभी',
      searchPlaceholder: 'ग्राहक का नाम या पता खोजें (उदा. Ramesh, 4th street)...',
      udhaarEmptyTitle: 'कोई उधार खाता नहीं मिला',
      udhaarEmptyInstruction: 'माइक से बोलें: "रमेश का 40 रुपये उधार लिख लो"',
      statusPending: 'बाकी',
      statusSettled: 'जमा',
      settledAtPrefix: 'जमा हुआ:',
      settleBtn: 'जमा करें (Paid)',
      settledFull: 'हिसाब चुकता',
      reminderBtn: 'तकाज़ा (WhatsApp)',
      phonePrompt: 'का 10-अंकों का WhatsApp नंबर दर्ज करें (या खाली छोड़कर OK दबाएं):',
    },
    voiceHub: {
      speakBtn: 'बोलिए',
      stopBtn: 'पूरा हुआ',
      analyzing: 'हिसाब बन रहा है...',
      subtextRecording: 'पूरा होने पर दबाएं',
      subtextAnalyzing: 'AI हिसाब का विश्लेषण कर रहा है...',
      subtextIdle: 'बटन दबाकर बोलें • जैसे: "2 चाय 20 नकद, रमेश 40 उधार"',
      tryLabel: 'बोल कर देखें:',
      micErrorText: 'माइक की अनुमति नहीं मिली। कृपया ब्राउज़र में "Allow" करें।',
      samplePrompts: [
        '2 चाय बेची 20 रुपये की, और रमेश का 40 रुपये उधार लिख लो',
        'शर्मा जी ने 150 रुपये वापस जमा कर दिए',
        '50 रुपये कैश आया सुबह के समोसे का',
        'पप्पू ऑटो वाले का 80 रुपये उधार लिखो',
      ],
    },
    closingModal: {
      title: 'दुकान बंद • आज का हिसाब',
      todayTitle: 'आज का दिन',
      drawerCashLabel: 'गल्ले में कुल नकद होना चाहिए',
      drawerBreakdown: (cash, rec) => `(नकद बिक्री ₹${cash} + वसूली ₹${rec})`,
      cashSalesTile: 'नकद बिक्री',
      cashSalesCount: (n) => `${n} ट्रांजैक्शन`,
      todayCreditTile: 'आज का उधार',
      todayCreditCount: (n) => `${n} ग्राहकों को`,
      creditRecoveredTile: 'उधार वसूली',
      creditRecoveredCount: (n) => `${n} जमा हुए`,
      marketPendingTile: 'कुल बाकी उधारी',
      marketPendingSub: 'मार्केट में फंसा हुआ',
      topDebtorsTitle: '⚠️ सबसे बड़े बकायेदार (Top Pending Accounts):',
      shareWhatsAppBtn: 'WhatsApp पर रिपोर्ट भेजें',
      copyBtnTooltip: 'रिपोर्ट कॉपी करें',
      voiceBtnTooltip: 'आवाज़ में हिसाब सुनें',
      copiedAlert: 'दुकान बंद हिसाब कॉपी हो गया!',
      speechSummary: (cash, credit, rec, drawer) =>
        `दुकान बंद हिसाब। आज की कुल नकद कमाई ₹${cash} हुई। ₹${credit} का उधार दिया गया और ₹${rec} की वसूली हुई। गल्ले में ₹${drawer} होने चाहिए।`,
    },
    manualAddModal: {
      title: 'हाथ से नया हिसाब जोड़ें',
      typeCash: '💵 नकद बिक्री (Cash)',
      typeCredit: '📝 उधार खाता (Udhaar)',
      amountLabel: 'रुपये (Amount in ₹) *',
      customerNameLabel: 'ग्राहक का नाम (Customer Name) *',
      customerNamePlaceholder: 'उदा. Ramesh, Sharma Ji',
      tagLabel: 'पहचान / पता (Tag)',
      tagPlaceholder: 'उदा. 4th street, Nukkad',
      phoneLabel: 'मोबाइल नंबर (WhatsApp)',
      descriptionLabel: 'विवरण / सामान (Items Description)',
      descriptionPlaceholder: 'उदा. 2 chai, 1 samosa',
      categoryLabel: 'कैटेगरी (Category)',
      categories: {
        chai: 'चाय (Chai / Tea)',
        snacks: 'नाश्ता (Samosa / Snacks)',
        cigarettes: 'बीड़ी / सिगरेट (Cigarettes)',
        beverages: 'पेय पदार्थ (Cold Drinks / Milk)',
        grocery: 'किराना (Grocery)',
        other: 'अन्य (Other)',
      },
      submitBtn: 'दर्ज करें (Save Entry)',
      amountAlert: 'कृपया सही राशि दर्ज करें',
      customerNameAlert: 'कृपया ग्राहक का नाम लिखें',
    },
    settingsModal: {
      title: 'दुकानदार प्रोफ़ाइल & खाता',
      subtitle: 'अपनी दुकान का विवरण देखें और खाता प्रबंधित करें',
      profileInfo: 'दुकानदार की जानकारी',
      shopNameLabel: 'दुकान का नाम (Shop Name)',
      shopNamePlaceholder: 'उदा. राजू टी स्टॉल, गुप्ता किराना',
      emailLabel: 'ईमेल / खाता पहचान',
      accountTypeLabel: 'खाता स्थिति',
      guestBadge: 'अतिथि मोड (डेटा डिवाइस पर सुरक्षित)',
      cloudBadge: 'क्लाउड खाता सक्रिय (Cloud Synced)',
      offlineBadge: 'स्थानीय डेटा सुरक्षित:',
      offlineDesc: 'आपका हिसाब-किताब इस डिवाइस पर सुरक्षित है। किसी API Key की आवश्यकता नहीं है!',
      soundboxTestBtn: 'साउंडबॉक्स आवाज़ टेस्ट करें 🔊',
      testSpeech: 'बहीखाता साउंडबॉक्स परीक्षण सफल रहा। ₹100 प्राप्त हुए।',
      resetBtn: 'सभी स्थानीय डेटा हटाएं (Reset Local Storage)',
      resetConfirm: 'क्या आप सच में सारा डेटा मिटाना चाहते हैं? यह वापस नहीं लाया जा सकेगा।',
      saveBtn: 'दुकान का नाम सुरक्षित करें',
      saveSuccess: 'दुकान का नाम सुरक्षित हो गया!',
      logoutBtn: 'खाता लॉगआउट करें (Log Out)',
      loginBtn: 'साइन इन / नया खाता बनाएं (Login)',
      logoutSuccess: 'सफलतापूर्वक लॉगआउट हो गया।',
    },
    landing: {
      navLogin: 'लॉगिन (Login)',
      navOpen: 'बहीखाता खोलें',
      badge: 'भारत के चायवालों और छोटे व्यापारियों के लिए पहला वॉइस बहीखाता',
      heroH1Line1: 'हाथ में छलनी,',
      heroH1Gradient: 'मुँह से हिसाब पक्का!',
      heroDesc: 'अब व्यस्त दुकान में गंदे या गीले हाथों से मोबाइल टाइप करने की जरूरत नहीं। सीधे हिंदी में बोलें—AI नकद बिक्री और उधारी अलग करेगा, और साउंडबॉक्स आवाज़ देकर पुष्टि करेगा!',
      ctaDashboard: 'मुफ्त में शुरू करें (डैशबोर्ड)',
      ctaGoogle: 'Google से लॉगिन करें',
      simTitle: 'लाइव टेस्ट करें (Click to Test Live AI Voice Parsing):',
      simListen: 'आवाज़ सुनें 🔊',
      simEmpty: 'ऊपर किसी भी वाक्य पर क्लिक करें और देखें कि AI कैसे एक ही वाक्य से नकद और उधार को अलग-अलग दर्ज करता है!',
      simAnalyzing: 'AI आवाज़ समझ रहा है...',
      pillarsTitle: 'छोटे दुकानदारों के लिए क्यों ज़रूरी है?',
      pillarsSubtitle: 'पारंपरिक कॉपी-किताब और जटिल ऐप्स की कमियों को दूर करने के लिए बनाया गया',
      p1Title: 'शून्य टाइपिंग (Zero Typing)',
      p1Desc: 'चाहे हाथ में चाय का बर्तन हो या समोसे का तेल, सिर्फ एक बार बोलें और हिसाब तुरंत दर्ज हो जाएगा।',
      p2Title: 'मर्चेंट साउंडबॉक्स पुष्टि',
      p2Desc: 'पेटीएम/फोनपे जैसा अलर्ट टोन और हिंदी में बोलकर पुष्टि, ताकि स्क्रीन देखने की भी ज़रूरत न पड़े।',
      p3Title: '1-टैप व्हाट्सएप तकाज़ा',
      p3Desc: 'बिना झिझक ग्राहक को सम्मानजनक रिमाइंडर भेजें। आपके सामान्य व्हाट्सएप से सीधा लिंक खुलता है।',
      p4Title: 'धूप मोड (Sunlight Mode)',
      p4Desc: 'सड़क पर सीधी तेज़ धूप में भी साफ दिखने वाला हाई-कंट्रास्ट ब्लैक और नियॉन डिस्प्ले।',
      compTitle: 'पुरानी लाल डायरी बनाम बहीखाता आवाज़',
      diaryTitle: '❌ पुरानी कागज़ की डायरी',
      diaryItems: [
        'पन्ने फटना, भीगना या खो जाने का डर',
        'भीड़ में लिखने का समय न मिलना और हिसाब भूलना',
        'शाम को घंटों बैठकर कुल जोड़ लगाना',
        'ग्राहक से तकाज़ा मांगने में संकोच होना',
      ],
      voiceTitle: '✅ बहीखाता आवाज़ (BahiKhaata Voice)',
      voiceItems: [
        'सिर्फ बोलें, २ सेकंड में हिसाब पक्का दर्ज',
        'साउंडबॉक्स तुरंत आवाज़ देकर बताएगा',
        'शाम को "दुकान बंद" दबाते ही गल्ले का सटीक हिसाब',
        '१-टैप में व्हाट्सएप पर विनम्र उधारी तकाज़ा संदेश',
      ],
      footerCtaTitle: 'आज ही अपनी दुकान का हिसाब डिजिटल करें',
      footerCtaSubtitle: 'शून्य सेटअप • किसी कठिन ट्रेनिंग की ज़रूरत नहीं • सीधा इस्तेमाल शुरू करें',
      footerCtaBtn: 'बहीखाता शुरू करें',
      footerCopyright: '© 2026 BahiKhaata Voice • मेड विद ❤️ फ़ॉर इंडियाज़ माइक्रो-इकोनॉमी',
    },
    login: {
      titleSignIn: 'दुकानदार लॉगिन',
      titleSignUp: 'नया बहीखाता बनाएं',
      subSignIn: 'अपने खाते में सुरक्षित लॉगिन करें और बोलकर हिसाब रखें',
      subSignUp: 'सिर्फ १ मिनट में अपनी दुकान का डिजिटल बहीखाता शुरू करें',
      tabSignIn: 'साइन इन (Sign In)',
      tabSignUp: 'नया खाता (Sign Up)',
      googleBtn: 'Google से जारी रखें (Continue with Google)',
      orEmail: 'या ईमेल से',
      shopNameLabel: 'दुकान का नाम (Shop Name)',
      shopNamePlaceholder: 'उदा. राजू टी स्टॉल, गुप्ता किराना',
      emailLabel: 'ईमेल (Email Address) *',
      passwordLabel: 'पासवर्ड (Password) *',
      btnSignIn: 'लॉगिन करें (Sign In)',
      btnSignUp: 'खाता बनाएं (Create Account)',
      guestBtn: 'बिना लॉगिन सीधे चलाएं (Try as Guest)',
      footerText: 'सुरक्षित • 100% स्थानीय डेटा और क्लाउड सिंक',
    },
  },

  hinglish: {
    common: {
      appName: 'BahiKhaata',
      badge: 'Awaaz',
      tagline: 'Haath Khaali, Hisab Pakka',
      rupee: '₹',
      close: 'Close Karein',
      cancel: 'Cancel',
      ok: 'Theek Hai',
      delete: 'Delete',
      save: 'Save Karein',
    },
    nav: {
      login: 'Login',
      logout: 'Logout',
      home: 'Home',
      openLedger: 'BahiKhaata Kholein',
      soundboxOn: 'Soundbox ON',
      soundboxMute: 'Mute',
      closingBtn: 'Dukaan Bandh',
      settingsTooltip: 'Merchant Profile & Logout',
      guestModeText: 'Guest Mode • Data saved locally on this device',
    },
    metrics: {
      todayCash: 'Aaj Ki Kamai',
      todayCashSub: 'Cash + Online Sales',
      todayUdhaar: 'Aaj Ka Udhaar',
      todayUdhaarSub: 'Aaj diya gaya udhaar',
      marketUdhaar: 'Kul Market Udhaar',
      marketUdhaarSub: 'Market se lena baaki hai',
      galla: 'Galla (Cash In Hand)',
      recovered: 'Wapas Aaya',
    },
    tabs: {
      cashTab: 'Cash Kamai',
      udhaarTab: 'Udhaar Book',
      quickAdd: 'Quick Add',
      cashTitle: 'Cash Kamai Ledger',
      cashEntriesCount: 'entries',
      cashSubtitle: 'Daily itemized sales & revenue',
      totalCashLabel: 'Total Cash',
      cashEmptyTitle: 'Abhi koi cash bikri nahi hui',
      cashEmptyInstruction: 'Neeche mic dabayein aur bolein: "2 chai 20 rupaye cash"',
      udhaarTitle: 'Udhaar Book (Credit Ledger)',
      udhaarPendingCount: 'baaki',
      udhaarSubtitle: 'Customer credit & settlements',
      filterPending: 'Pending',
      filterSettled: 'Settled',
      filterAll: 'All',
      searchPlaceholder: 'Search customer name or tag (e.g. Ramesh, 4th street)...',
      udhaarEmptyTitle: 'Koi udhaar entry nahi mili',
      udhaarEmptyInstruction: 'Mic se bolein: "Ramesh 4th street 40 udhaar"',
      statusPending: 'Pending',
      statusSettled: 'Settled',
      settledAtPrefix: 'Settled:',
      settleBtn: 'Settle / Paid',
      settledFull: 'Full Payment Received',
      reminderBtn: 'Taqaza (WhatsApp)',
      phonePrompt: 'ka 10-digit WhatsApp number dalein (ya blank chhodkar OK dabayein):',
    },
    voiceHub: {
      speakBtn: 'Boliye',
      stopBtn: 'Stop',
      analyzing: 'Analyzing...',
      subtextRecording: 'Tap to stop when done',
      subtextAnalyzing: 'AI is analyzing your voice note...',
      subtextIdle: 'Tap & Speak • e.g. "2 chai 20 cash, Ramesh 40 udhaar"',
      tryLabel: 'Bol Kar Dekhein:',
      micErrorText: 'Mic permission not granted. Please allow mic in address bar.',
      samplePrompts: [
        '2 chai bechi 20 rupaye ki, aur 4th street wale Ramesh ka 40 rupaye udhaar likh lo',
        'Sharma ji ne 150 rupaye wapas jama kar diye',
        '50 rupaye cash aaya subah ke samose ka',
        'Pappu auto wale ka 80 rupaye udhaar likho',
      ],
    },
    closingModal: {
      title: 'Dukaan Bandh • Daily Closing Summary',
      todayTitle: 'Today',
      drawerCashLabel: 'Net Cash In Drawer (Galla)',
      drawerBreakdown: (cash, rec) => `(Cash Sales ₹${cash} + Recovered ₹${rec})`,
      cashSalesTile: 'Cash Sales',
      cashSalesCount: (n) => `${n} transactions`,
      todayCreditTile: "Today's Credit",
      todayCreditCount: (n) => `Given to ${n} customers`,
      creditRecoveredTile: 'Credit Recovered',
      creditRecoveredCount: (n) => `${n} payments settled`,
      marketPendingTile: 'Total Market Udhaar',
      marketPendingSub: 'Pending in market',
      topDebtorsTitle: '⚠️ Top Pending Customer Accounts:',
      shareWhatsAppBtn: 'Send Summary on WhatsApp',
      copyBtnTooltip: 'Copy Report',
      voiceBtnTooltip: 'Replay Soundbox Speech',
      copiedAlert: 'Closing report copied to clipboard!',
      speechSummary: (cash, credit, rec, drawer) =>
        `Dukaan bandh hisaab. Aaj ki cash kamai ₹${cash} hui. ₹${credit} ka udhaar diya aur ₹${rec} wapas jama hua. Galle mein ₹${drawer} hone chahiye.`,
    },
    manualAddModal: {
      title: 'Quick Manual Entry',
      typeCash: '💵 Cash Sale',
      typeCredit: '📝 Udhaar Credit',
      amountLabel: 'Amount (₹) *',
      customerNameLabel: 'Customer Name *',
      customerNamePlaceholder: 'e.g. Ramesh, Sharma Ji',
      tagLabel: 'Identifier / Location (Tag)',
      tagPlaceholder: 'e.g. 4th street, Nukkad',
      phoneLabel: 'WhatsApp Number',
      descriptionLabel: 'Items Description',
      descriptionPlaceholder: 'e.g. 2 chai, 1 samosa',
      categoryLabel: 'Category',
      categories: {
        chai: 'Chai / Tea',
        snacks: 'Samosa / Snacks',
        cigarettes: 'Cigarettes / Bidi',
        beverages: 'Cold Drinks / Milk',
        grocery: 'Grocery / Kirana',
        other: 'Other',
      },
      submitBtn: 'Save Entry',
      amountAlert: 'Please enter a valid amount',
      customerNameAlert: 'Please enter customer name',
    },
    settingsModal: {
      title: 'Merchant Profile & Account',
      subtitle: 'Apni dukaan details aur account manage karein',
      profileInfo: 'Merchant Details',
      shopNameLabel: 'Dukaan Ka Naam (Shop Name)',
      shopNamePlaceholder: 'e.g. Raju Tea Stall, Gupta Kirana',
      emailLabel: 'Email / Account ID',
      accountTypeLabel: 'Account Status',
      guestBadge: 'Guest Mode (Data device par safe hai)',
      cloudBadge: 'Cloud Synced Account',
      offlineBadge: 'Local Storage Safe:',
      offlineDesc: 'Aapka hisab-kitab is device par safe hai. Kisi API key ya setup ki zaroorat nahi!',
      soundboxTestBtn: 'Test Soundbox Voice 🔊',
      testSpeech: 'BahiKhaata soundbox test successful. ₹100 praapt hue.',
      resetBtn: 'Clear All Local Data (Reset)',
      resetConfirm: 'Kya aap sach mein saara ledger data delete karna chahte hain?',
      saveBtn: 'Save Shop Name',
      saveSuccess: 'Dukaan details save ho gayi!',
      logoutBtn: 'Logout Karein (Log Out)',
      loginBtn: 'Sign In / Register',
      logoutSuccess: 'Logged out successfully.',
    },
    landing: {
      navLogin: 'Login',
      navOpen: 'Open BahiKhaata',
      badge: "India's 1st Voice Ledger for Chaiwalas & Kirana Stores",
      heroH1Line1: 'Haath Mein Chhalni,',
      heroH1Gradient: 'Munh Se Hisab Pakka!',
      heroDesc: 'No more typing with wet or busy hands. Simply speak in Hindi or Hinglish—AI separates cash sales and customer udhaar, confirmed instantly by merchant soundbox audio!',
      ctaDashboard: 'Get Started Free (Dashboard)',
      ctaGoogle: 'Continue with Google',
      simTitle: 'Test Live AI Voice Parsing:',
      simListen: 'Listen Audio 🔊',
      simEmpty: 'Click any sample prompt above to see how AI separates cash and credit automatically!',
      simAnalyzing: 'AI is analyzing voice note...',
      pillarsTitle: 'Why is it essential for shopkeepers?',
      pillarsSubtitle: 'Built specifically to eliminate messy paper diaries and complicated apps',
      p1Title: 'Zero Typing',
      p1Desc: 'Whether holding a tea kettle or handling snacks, speak once and the entry logs in 2 seconds.',
      p2Title: 'Merchant Soundbox Confirmation',
      p2Desc: 'PhonePe/Paytm style chime and clear voice confirmation so you never have to glance at the screen.',
      p3Title: '1-Tap WhatsApp Taqaza',
      p3Desc: 'Polite, respectful payment reminders with your UPI QR, sent directly via personal WhatsApp.',
      p4Title: 'Sunlight Mode (Dhoop Mode)',
      p4Desc: 'Ultra high-contrast black and neon display engineered for bright outdoor sunlight.',
      compTitle: 'Old Paper Diary vs BahiKhaata Voice',
      diaryTitle: '❌ Traditional Red Diary (Lal Bahi)',
      diaryItems: [
        'Pages tear, get wet with milk/water, or get lost',
        'Rush hours mean missed entries and lost money',
        'Hours spent every evening calculating totals',
        'Awkwardness asking customers for pending dues',
      ],
      voiceTitle: '✅ BahiKhaata Voice (आवाज़)',
      voiceItems: [
        'Speak naturally, logged accurately in 2 seconds',
        'Soundbox announces confirmation out loud',
        'One-tap "Dukaan Bandh" instant drawer closing total',
        '1-tap respectful WhatsApp reminder link',
      ],
      footerCtaTitle: 'Digitize your shop ledger today',
      footerCtaSubtitle: 'Zero setup • No training required • Works instantly',
      footerCtaBtn: 'Launch BahiKhaata',
      footerCopyright: '© 2026 BahiKhaata Voice • Made with ❤️ for micro-merchants',
    },
    login: {
      titleSignIn: 'Merchant Login',
      titleSignUp: 'Create New Ledger',
      subSignIn: 'Sign in to access your ledger across all devices',
      subSignUp: 'Set up your digital ledger in under 1 minute',
      tabSignIn: 'Sign In',
      tabSignUp: 'Sign Up',
      googleBtn: 'Continue with Google',
      orEmail: 'or with Email',
      shopNameLabel: 'Shop Name',
      shopNamePlaceholder: 'e.g. Raju Tea Stall, Gupta Kirana',
      emailLabel: 'Email Address *',
      passwordLabel: 'Password *',
      btnSignIn: 'Sign In',
      btnSignUp: 'Create Account',
      guestBtn: 'Try as Guest (Instant Access)',
      footerText: 'Secure • 100% Local Storage & Cloud Sync',
    },
  },

  english: {
    common: {
      appName: 'BahiKhaata',
      badge: 'Voice',
      tagline: 'Hands Free, Perfect Books',
      rupee: '₹',
      close: 'Close',
      cancel: 'Cancel',
      ok: 'OK',
      delete: 'Delete',
      save: 'Save',
    },
    nav: {
      login: 'Login',
      logout: 'Logout',
      home: 'Home',
      openLedger: 'Open Ledger',
      soundboxOn: 'Soundbox ON',
      soundboxMute: 'Mute',
      closingBtn: 'Day Close',
      settingsTooltip: 'Merchant Profile & Logout',
      guestModeText: 'Guest Mode • Data stored securely on this device',
    },
    metrics: {
      todayCash: "Today's Cash",
      todayCashSub: 'Cash + Online Sales',
      todayUdhaar: "Today's Credit",
      todayUdhaarSub: 'Credit given today',
      marketUdhaar: 'Total Market Credit',
      marketUdhaarSub: 'Total outstanding to collect',
      galla: 'Cash in Drawer',
      recovered: 'Credit Recovered',
    },
    tabs: {
      cashTab: 'Cash Sales',
      udhaarTab: 'Credit Ledger',
      quickAdd: 'Manual Add',
      cashTitle: 'Cash Sales Ledger',
      cashEntriesCount: 'entries',
      cashSubtitle: 'Daily itemized sales & revenue',
      totalCashLabel: 'Total Cash',
      cashEmptyTitle: 'No cash sales recorded yet today',
      cashEmptyInstruction: 'Tap the mic below and say: "2 teas 20 cash" or "50 cash"',
      udhaarTitle: 'Credit Ledger (Udhaar Book)',
      udhaarPendingCount: 'pending',
      udhaarSubtitle: 'Track customer credit, dues, and collections',
      filterPending: 'Pending',
      filterSettled: 'Settled',
      filterAll: 'All',
      searchPlaceholder: 'Search customer name or location tag (e.g. Ramesh, 4th street)...',
      udhaarEmptyTitle: 'No credit entries found',
      udhaarEmptyInstruction: 'Tap the mic and say: "Ramesh 4th street 40 credit"',
      statusPending: 'Pending',
      statusSettled: 'Settled',
      settledAtPrefix: 'Settled:',
      settleBtn: 'Mark as Paid',
      settledFull: 'Payment Settled in Full',
      reminderBtn: 'Send Reminder (WhatsApp)',
      phonePrompt: 'Enter 10-digit WhatsApp phone number (or leave blank and tap OK):',
    },
    voiceHub: {
      speakBtn: 'Speak',
      stopBtn: 'Stop',
      analyzing: 'Analyzing...',
      subtextRecording: 'Tap when finished speaking',
      subtextAnalyzing: 'AI is analyzing your transaction...',
      subtextIdle: 'Tap & Speak • e.g. "2 teas 20 cash, Ramesh 40 credit"',
      tryLabel: 'Try Saying:',
      micErrorText: 'Microphone permission needed. Please allow microphone access.',
      samplePrompts: [
        'Sold 2 teas for 20 rupees, and add 40 rupees credit for Ramesh on 4th street',
        'Sharma ji paid back 150 rupees credit',
        'Received 50 rupees cash for morning snacks',
        'Add 80 rupees credit for Pappu auto driver',
      ],
    },
    closingModal: {
      title: 'Day Close • Daily Balance Summary',
      todayTitle: 'Today',
      drawerCashLabel: 'Expected Cash in Cash Drawer',
      drawerBreakdown: (cash, rec) => `(Cash Sales ₹${cash} + Recovered ₹${rec})`,
      cashSalesTile: 'Cash Sales',
      cashSalesCount: (n) => `${n} transactions`,
      todayCreditTile: "Today's Credit Given",
      todayCreditCount: (n) => `Given to ${n} customers`,
      creditRecoveredTile: 'Credit Recovered',
      creditRecoveredCount: (n) => `${n} payments collected`,
      marketPendingTile: 'Total Outstanding Credit',
      marketPendingSub: 'Owed across all customers',
      topDebtorsTitle: '⚠️ Top Outstanding Customer Accounts:',
      shareWhatsAppBtn: 'Share Summary on WhatsApp',
      copyBtnTooltip: 'Copy Report',
      voiceBtnTooltip: 'Replay Voice Summary',
      copiedAlert: 'Day closing summary copied to clipboard!',
      speechSummary: (cash, credit, rec, drawer) =>
        `Day closing summary. Today's cash sales were ₹${cash}. ₹${credit} credit was issued, and ₹${rec} in credit was recovered. Cash drawer should contain ₹${drawer}.`,
    },
    manualAddModal: {
      title: 'Manual Entry',
      typeCash: '💵 Cash Sale',
      typeCredit: '📝 Credit Entry (Udhaar)',
      amountLabel: 'Amount (₹) *',
      customerNameLabel: 'Customer Name *',
      customerNamePlaceholder: 'e.g. Ramesh, Sharma Ji',
      tagLabel: 'Identifier / Location Tag',
      tagPlaceholder: 'e.g. 4th street, Nukkad shop',
      phoneLabel: 'WhatsApp Mobile Number',
      descriptionLabel: 'Item Description',
      descriptionPlaceholder: 'e.g. 2 teas, 1 snack',
      categoryLabel: 'Category',
      categories: {
        chai: 'Tea / Chai',
        snacks: 'Snacks / Samosa',
        cigarettes: 'Cigarettes / Tobacco',
        beverages: 'Cold Drinks / Milk',
        grocery: 'Grocery items',
        other: 'Other',
      },
      submitBtn: 'Save Entry',
      amountAlert: 'Please enter a valid amount',
      customerNameAlert: 'Please enter customer name',
    },
    settingsModal: {
      title: 'Merchant Profile & Account',
      subtitle: 'Manage your store details and session',
      profileInfo: 'Merchant Information',
      shopNameLabel: 'Shop Name',
      shopNamePlaceholder: 'e.g. Raju Tea Stall, Gupta Kirana',
      emailLabel: 'Email / Account ID',
      accountTypeLabel: 'Account Status',
      guestBadge: 'Guest Mode (Stored securely on this device)',
      cloudBadge: 'Cloud Synced Account',
      offlineBadge: 'Local Data Secure:',
      offlineDesc: 'Your ledger data is securely preserved on this device. No external API keys needed!',
      soundboxTestBtn: 'Test Soundbox Voice 🔊',
      testSpeech: 'BahiKhaata soundbox test successful. Received 100 rupees.',
      resetBtn: 'Clear All Local Data (Reset Storage)',
      resetConfirm: 'Are you sure you want to clear all ledger data? This cannot be undone.',
      saveBtn: 'Save Shop Name',
      saveSuccess: 'Store name saved successfully!',
      logoutBtn: 'Log Out of Account',
      loginBtn: 'Sign In / Register',
      logoutSuccess: 'Logged out successfully.',
    },
    landing: {
      navLogin: 'Login',
      navOpen: 'Open Ledger',
      badge: "India's 1st Voice-First Ledger for Micro-Merchants",
      heroH1Line1: 'Hands Free,',
      heroH1Gradient: 'Perfect Ledger Every Time!',
      heroDesc: 'No more typing with busy or wet hands. Speak naturally in Hindi, Hinglish, or English—AI automatically separates cash sales from customer credit, confirmed aloud by merchant soundbox audio!',
      ctaDashboard: 'Start Free (Open Ledger)',
      ctaGoogle: 'Sign In /Sign Up',
      simTitle: 'Test Live AI Voice Parsing:',
      simListen: 'Listen Audio 🔊',
      simEmpty: 'Click any sample prompt above to see how AI separates cash and credit automatically!',
      simAnalyzing: 'AI is analyzing transaction...',
      pillarsTitle: 'Why is it essential for shop owners?',
      pillarsSubtitle: 'Engineered specifically to replace messy paper notebooks and complicated accounting apps',
      p1Title: 'Zero Typing Required',
      p1Desc: 'Whether handling a kettle or serving snacks, speak once and the entry logs in 2 seconds.',
      p2Title: 'Merchant Soundbox Confirmation',
      p2Desc: 'Clear audio chime and spoken confirmation so you never have to stop and stare at the screen.',
      p3Title: '1-Tap WhatsApp Reminder',
      p3Desc: 'Polite, respectful payment reminder links with payment details, sent directly via standard WhatsApp.',
      p4Title: 'Sunlight Mode (High Contrast)',
      p4Desc: 'Ultra high-contrast black and neon display engineered for bright outdoor sunlight.',
      compTitle: 'Traditional Paper Diary vs BahiKhaata Voice',
      diaryTitle: '❌ Traditional Red Paper Notebook (Bahi)',
      diaryItems: [
        'Pages tear, get soiled with tea/oil, or get lost',
        'Busy rush hours mean forgotten transactions',
        'Hours spent late at night doing manual additions',
        'Awkwardness and hesitation when asking customers for dues',
      ],
      voiceTitle: '✅ BahiKhaata Voice (Hands-Free Ledger)',
      voiceItems: [
        'Speak naturally; recorded in 2 seconds',
        'Soundbox confirms every transaction out loud',
        'One-tap "Day Close" generates exact cash in drawer',
        '1-tap respectful WhatsApp reminder messages',
      ],
      footerCtaTitle: 'Digitize your shop ledger today',
      footerCtaSubtitle: 'Zero setup • No training required • Works instantly on mobile and desktop',
      footerCtaBtn: 'Launch BahiKhaata Voice',
      footerCopyright: '© 2026 BahiKhaata Voice • Built with ❤️ for micro-merchants',
    },
    login: {
      titleSignIn: 'Merchant Sign In',
      titleSignUp: 'Create New Ledger',
      subSignIn: 'Sign in to access your ledger across all your devices',
      subSignUp: 'Set up your digital ledger in under 1 minute',
      tabSignIn: 'Sign In',
      tabSignUp: 'Sign Up',
      googleBtn: 'Continue with Google',
      orEmail: 'or continue with Email',
      shopNameLabel: 'Shop Name',
      shopNamePlaceholder: 'e.g. Raju Tea Stall, Gupta Kirana',
      emailLabel: 'Email Address *',
      passwordLabel: 'Password *',
      btnSignIn: 'Sign In',
      btnSignUp: 'Create Account',
      guestBtn: 'Continue as Guest (Instant Access)',
      footerText: 'Secure • 100% Local Storage & Cloud Sync',
    },
  },
};
