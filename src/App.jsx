import React, { useState, useEffect } from 'react';
import DiaryMaker from './components/DiaryMaker';
import DiaryViewer from './components/DiaryViewer';

const defaultData = {
  intro: {
    title: "Hamari Kahani",
    date: "February 14, 2026",
    audioUrl: "/images/Gym Class Heroes - Cupid's Chokehold (Lyrics) (Take a look at my girlfriend) - Xernos.mp3",
    leftText: "This is for you. I’ve been working on this for some time now, and I felt like this diary deserved something real—something about us.\n\nI don’t know where to start, because the truth is, you already know most of my story. You know my flaws and the parts of me I don’t talk about. And still, you stayed.",
    poem: "Sometimes I wonder how you understand me so well, even when I don’t explain myself properly. I’m not always good with words, not always good with expressing what I feel.",
    marginalia: "Always you..."
  },
  memories: [
    {
      title: "Pehli Mulakat",
      date: "August 10, 2024",
      poem: "You are my comfort zone. You make me feel safe, and you make me want to be better. You listen when I talk nonsense, and you understand even when I don’t explain properly.",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1000",
      marginalia: "Where it began"
    },
    {
      title: "Sukoon",
      date: "December 25, 2024",
      poem: "Not every day was perfect. There were days when things felt distant. Those days mattered too. Because even in distance, I felt connected to you.",
      image: "https://images.unsplash.com/photo-1516589174184-c68d8e414c48?auto=format&fit=crop&q=80&w=1000",
      marginalia: "Mera sukoon"
    }
  ]
};

// Short key mapping for URL compression
const keyMap = {
  i: 'intro', t: 'title', d: 'date', a: 'audioUrl', l: 'leftText', p: 'poem', m: 'marginalia',
  ms: 'memories', ig: 'image'
};
const revMap = Object.fromEntries(Object.entries(keyMap).map(([k, v]) => [v, k]));

function App() {
  const [diaryData, setDiaryData] = useState(defaultData);
  const [viewMode, setViewMode] = useState('maker');

  const compressData = (data) => {
    const compact = {
      i: {
        t: data.intro.title, d: data.intro.date, a: data.intro.audioUrl,
        l: data.intro.leftText, p: data.intro.poem, m: data.intro.marginalia
      },
      ms: data.memories.map(m => ({
        t: m.title, d: m.date, p: m.poem, ig: m.image, m: m.marginalia
      }))
    };
    return compact;
  };

  const decompressData = (compact) => {
    return {
      intro: {
        title: compact.i.t, date: compact.i.d, audioUrl: compact.i.a,
        leftText: compact.i.l, poem: compact.i.p, marginalia: compact.i.m
      },
      memories: compact.ms.map(m => ({
        title: m.t, date: m.d, poem: m.p, image: m.ig, marginalia: m.m
      }))
    };
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#d=')) {
      try {
        const encodedData = hash.replace('#d=', '');
        const decodedStr = atob(decodeURIComponent(encodedData));
        const compact = JSON.parse(decodeURIComponent(escape(decodedStr)));
        setDiaryData(decompressData(compact));
        setViewMode('viewer');
      } catch (e) {
        console.error("Failed to decode diary data", e);
      }
    }
  }, []);

  const generateLink = (data) => {
    const compact = compressData(data);
    const jsonStr = JSON.stringify(compact);
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    const url = `${window.location.origin}${window.location.pathname}#d=${encoded}`;
    return url;
  };

  if (viewMode === 'viewer') {
    return <DiaryViewer data={diaryData} onBack={() => setViewMode('maker')} />;
  }

  return (
    <div className="app-container">
      <DiaryMaker
        initialData={diaryData}
        onPreview={(data) => { setDiaryData(data); setViewMode('viewer'); }}
        onGenerateLink={generateLink}
      />
    </div>
  );
}

export default App;
