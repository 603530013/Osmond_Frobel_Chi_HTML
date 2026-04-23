/* =========================================================
   共用程式碼：載入所有模式都會用到的資料、圖示與 UI 元件
   會被各個 *.html 透過 <script type="text/babel" src> 引入
   ========================================================= */

// 可用的題庫清單（對應 data/*.json）
const AVAILABLE_SET_IDS = ['K1B-1', 'K1B-2'];

// Gemini API Key (留空時使用瀏覽器內建 TTS / 無造句)
const apiKey = "";

/* --- 圖示元件 (Lucide 風格 SVG) --- */
const Play = ({className, fill="none"}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const RotateCcw = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>;
const Star = ({className, fill="none", style}) => <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const Trophy = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>;
const Sparkles = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>;
const Loader2 = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>;
const X = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const Check = ({className, strokeWidth}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || "2"} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>;
const Home = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const Volume2 = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>;

/* --- 工具函式 --- */
const shuffleArray = (originalArray) => {
  const array = [...originalArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateSentenceWithGemini = async (word) => {
  try {
    if (!apiKey) return `(未設定 API Key) 這是${word}。`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `請用「${word}」這個字，造一個非常簡單、生動、適合3歲小孩聽的短句。限制15個字以內。只要回傳句子就好，不要其他文字。` }] }]
        })
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || `這是${word}。`;
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return `這是${word}。`;
  }
};

const speakText = async (text) => {
  try {
    if (!apiKey) throw new Error("No API Key");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: text }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } }
          }
        })
      }
    );
    const data = await response.json();
    const audioContent = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (audioContent) {
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.play();
    }
  } catch (error) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

/* --- 載入題庫 JSON --- */
const loadAllWordSets = async () => {
  const sets = {};
  for (const setId of AVAILABLE_SET_IDS) {
    try {
      const res = await fetch(`data/${setId}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      sets[setId] = data.words || [];
    } catch (e) {
      console.error(`載入 ${setId} 失敗`, e);
      sets[setId] = [];
    }
  }
  return sets;
};

/* --- 特殊視覺元件 (用於右側圖卡) --- */
const DogComparison = ({ target }) => (
  <div className="flex items-end justify-center gap-4 h-full w-full pb-2 px-1">
    <div className="relative flex items-center justify-center">
      <span className="text-3xl transform translate-y-1">🐕</span>
      {target === 'small' && (
        <div className="absolute -inset-3 border-4 border-red-500 rounded-full animate-pulse pointer-events-none"></div>
      )}
    </div>
    <div className="relative flex items-center justify-center ml-2">
      <span className="text-6xl">🐕</span>
      {target === 'big' && (
        <div className="absolute -inset-2 border-4 border-red-500 rounded-full animate-pulse pointer-events-none"></div>
      )}
    </div>
  </div>
);

const JumpVisual = () => (
  <div className="flex flex-col items-center justify-center h-full w-full">
    <div className="relative animate-bounce">
      <div className="absolute -top-6 left-0 right-0 text-center">
        <span className="text-2xl text-fuchsia-500 font-black">↑</span>
      </div>
      <span className="text-6xl">🧍</span>
    </div>
    <div className="w-12 h-1.5 bg-slate-200 rounded-full mt-1 opacity-50 scale-x-75 animate-pulse"></div>
  </div>
);

const SoilVisual = () => (
  <div className="flex flex-col items-center justify-center h-full w-full">
    <svg width="60" height="60" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
      <path d="M 4 56 C 4 56, 12 48, 32 48 C 52 48, 60 56, 60 56 Z" fill="#5C4033" />
      <path d="M 12 52 C 12 52, 20 20, 36 20 C 50 20, 54 52, 54 52 Z" fill="#8B5A2B" />
      <path d="M 22 54 C 22 54, 28 32, 44 32 C 54 32, 58 54, 58 54 Z" fill="#A0522D" />
      <circle cx="34" cy="34" r="2" fill="#3E2723" opacity="0.6"/>
      <circle cx="44" cy="42" r="2.5" fill="#3E2723" opacity="0.6"/>
      <circle cx="28" cy="46" r="1.5" fill="#3E2723" opacity="0.6"/>
      <circle cx="48" cy="48" r="1.5" fill="#3E2723" opacity="0.6"/>
      <circle cx="38" cy="50" r="2" fill="#3E2723" opacity="0.6"/>
    </svg>
  </div>
);

const RightSideVisual = ({ item }) => {
  if (item.type === 'custom-jump') return <JumpVisual />;
  if (item.type === 'custom-soil') return <SoilVisual />;
  if (item.type && item.type.includes('custom-dogs')) {
    return <DogComparison target={item.type === 'custom-dogs-small' ? 'small' : 'big'} />;
  }
  return <span className="text-5xl md:text-6xl drop-shadow-sm filter">{item.icon}</span>;
};

const AIBubble = ({ text, onClose }) => (
  <div className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-white rounded-2xl shadow-2xl border-4 border-blue-200 p-4 animate-in fade-in zoom-in duration-300">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2 text-blue-600 font-bold">
        <Sparkles className="w-5 h-5 fill-blue-500" />
        <span>AI 老師說...</span>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
        <X className="w-5 h-5" />
      </button>
    </div>
    <p className="text-xl font-medium text-slate-700 leading-relaxed text-center">
      {text}
    </p>
  </div>
);

/* --- 主選單按鈕 (右上角) --- */
const TopNav = ({ onBackHome }) => (
  <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-2 z-50">
    <button
      onClick={onBackHome}
      className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-full font-bold transition-colors shadow-sm active:scale-95"
    >
      <Home className="w-5 h-5" /> 回主選單
    </button>
  </div>
);

/* --- 共用設定畫面 (題庫選擇 + 題數) --- */
const IntroSetup = ({
  wordSets, selectedSets, toggleSet,
  questionCount, setQuestionCount, totalAvailableWords,
  onStart
}) => (
  <div className="flex flex-col items-center justify-center h-full space-y-5">
    <h2 className="text-xl font-bold text-slate-700">1. 請選擇要挑戰的題庫 (可多選)：</h2>
    <div className="flex flex-wrap justify-center gap-3 w-full max-w-md">
      {Object.keys(wordSets).map(setId => (
        <button
          key={setId}
          onClick={() => toggleSet(setId)}
          className={`flex items-center justify-center gap-2 text-lg font-bold py-2 px-4 rounded-2xl border-4 transition-all transform active:scale-95 ${
            selectedSets.includes(setId)
              ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-sm'
              : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'
          }`}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedSets.includes(setId) ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
            {selectedSets.includes(setId) && <Check className="w-3 h-3 text-white" strokeWidth="4" />}
          </div>
          {setId} ({wordSets[setId].length}字)
        </button>
      ))}
    </div>

    <div className="w-full max-w-sm h-px bg-slate-200 my-1"></div>

    <h2 className="text-xl font-bold text-slate-700">2. 選擇出題數量：</h2>
    <div className="flex flex-col items-center w-full max-w-sm bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
      <div className="text-4xl font-black text-blue-500 mb-2">
        {questionCount} <span className="text-lg text-slate-400 font-normal">/ {totalAvailableWords} 題</span>
      </div>
      <input
        type="range"
        min={Math.min(1, totalAvailableWords)}
        max={Math.max(1, totalAvailableWords)}
        value={questionCount}
        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
        disabled={totalAvailableWords === 0}
        className="w-full h-3 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <p className="text-sm text-slate-400 mt-2">將會從所選題庫中隨機出題</p>
    </div>

    <button
      onClick={onStart}
      disabled={selectedSets.length === 0 || questionCount === 0}
      className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:transform-none text-white text-2xl font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform active:scale-95 mt-2"
    >
      <Play className="w-7 h-7" fill="currentColor" /> 開始遊戲
    </button>
  </div>
);

/* --- 完成 / 失敗畫面 --- */
const FinishedScreen = ({ accuracy, stars, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
    <Trophy className="w-24 h-24 text-yellow-400 drop-shadow-lg" />
    <h2 className="text-4xl font-bold text-slate-800">太棒了！</h2>
    <p className="text-xl text-slate-600">你完成了這次的學習！</p>

    <div className="bg-slate-50 p-4 rounded-2xl w-full max-w-sm border-2 border-slate-100 my-2 shadow-sm">
      <p className="text-2xl font-black text-blue-500 mb-3">答對率：{accuracy}%</p>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((starIdx) => {
          const delay = `${(starIdx - 1) * 100}ms`;
          if (stars >= starIdx) {
            return <Star key={starIdx} fill="currentColor" className="w-10 h-10 animate-pulse text-yellow-400" style={{animationDelay: delay}} />;
          } else if (stars + 0.5 === starIdx) {
            return (
              <div key={starIdx} className="relative w-10 h-10 animate-pulse" style={{animationDelay: delay}}>
                <Star fill="none" className="absolute top-0 left-0 w-10 h-10 text-slate-200" />
                <div className="absolute top-0 left-0 h-10 overflow-hidden" style={{ width: '50%' }}>
                  <Star fill="currentColor" className="w-10 h-10 text-yellow-400" />
                </div>
              </div>
            );
          } else {
            return <Star key={starIdx} fill="none" className="w-10 h-10 animate-pulse text-slate-200" style={{animationDelay: delay}} />;
          }
        })}
      </div>
    </div>

    <button
      onClick={onRetry}
      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-3 px-8 rounded-full shadow-lg mt-4 transition-transform active:scale-95"
    >
      <RotateCcw className="w-6 h-6" /> 再玩一次
    </button>
  </div>
);

const FailedScreen = ({ correctCount, accuracy, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
    <div className="text-8xl drop-shadow-lg animate-pulse">💔</div>
    <h2 className="text-4xl font-bold text-red-500">遊戲結束</h2>
    <p className="text-xl text-slate-600">愛心用完了，再接再厲！</p>

    <div className="bg-slate-50 p-4 rounded-2xl w-full max-w-sm border-2 border-slate-100 my-2 shadow-sm">
      <p className="text-lg text-slate-600 mb-1">已打倒目標數</p>
      <p className="text-3xl font-black text-blue-500 mb-2">{correctCount} <span className="text-lg text-slate-400 font-normal">題</span></p>
      <p className="text-lg text-slate-600 mb-1">答對率</p>
      <p className="text-2xl font-black text-green-500">{accuracy}%</p>
    </div>

    <button
      onClick={onRetry}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-3 px-8 rounded-full shadow-lg mt-4 transition-transform active:scale-95"
    >
      <RotateCcw className="w-6 h-6" /> 再試一次
    </button>
  </div>
);

/* --- 分數計算 --- */
const calculateScore = (attempts) => {
  if (attempts.total === 0) return { accuracy: 0, stars: 0 };
  const rawAccuracy = attempts.correct / attempts.total;
  const accuracy = Math.round(rawAccuracy * 100);
  const rawStars = rawAccuracy * 5;
  const stars = Math.round(rawStars * 2) / 2;
  return { accuracy, stars };
};

/* --- 設置流程 Hook (題庫載入、選擇、題數) --- */
const useGameSetup = () => {
  const [wordSets, setWordSets] = React.useState({});
  const [selectedSets, setSelectedSets] = React.useState([]);
  const [questionCount, setQuestionCount] = React.useState(0);
  const [gamePool, setGamePool] = React.useState([]);
  const [loadingSets, setLoadingSets] = React.useState(true);

  React.useEffect(() => {
    loadAllWordSets().then(sets => {
      setWordSets(sets);
      setLoadingSets(false);
    });
  }, []);

  const totalAvailableWords = selectedSets.reduce(
    (sum, setId) => sum + (wordSets[setId]?.length || 0), 0
  );

  React.useEffect(() => {
    if (selectedSets.length === 0) {
      setQuestionCount(0);
    } else if (selectedSets.length === 1) {
      setQuestionCount(totalAvailableWords);
    } else {
      setQuestionCount(Math.min(20, totalAvailableWords));
    }
  }, [selectedSets, wordSets]);

  const toggleSet = (setId) => {
    if (selectedSets.includes(setId)) setSelectedSets(selectedSets.filter(id => id !== setId));
    else setSelectedSets([...selectedSets, setId]);
  };

  const buildPool = () => {
    let combined = [];
    selectedSets.forEach(setId => {
      combined = [...combined, ...(wordSets[setId] || [])];
    });
    const pool = shuffleArray(combined).slice(0, questionCount);
    setGamePool(pool);
    return pool;
  };

  return {
    wordSets, selectedSets, toggleSet,
    questionCount, setQuestionCount, totalAvailableWords,
    gamePool, buildPool, loadingSets,
  };
};
