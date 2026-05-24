import { useState, useCallback, useRef } from 'react';
import { BrainCircuit, RotateCcw } from 'lucide-react';

const EMOJI_SET = ['🍎', '🚗', '🐶', '🎈', '⭐', '🦋', '🧸', '🌞'];

interface CardData {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createInitialCards(): CardData[] {
  const cardPairs = [...EMOJI_SET, ...EMOJI_SET];
  const shuffled = shuffleArray(cardPairs);
  return shuffled.map((emoji, index) => ({
    id: index,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export default function GamesView() {
  const [cards, setCards] = useState<CardData[]>(createInitialCards);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(() => {
    const saved = localStorage.getItem('mumaa_gameBestScore');
    return saved ? parseInt(saved) : null;
  });
  const [gameWon, setGameWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const lockRef = useRef(false);

  const initGame = useCallback(() => {
    setCards(createInitialCards());
    setFlippedIds([]);
    setMoves(0);
    setGameWon(false);
    setIsChecking(false);
    lockRef.current = false;
  }, []);

  const handleCardClick = (id: number) => {
    if (lockRef.current) return;

    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (flippedIds.length >= 2) return;

    const newFlippedIds = [...flippedIds, id];
    setFlippedIds(newFlippedIds);

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );

    if (newFlippedIds.length === 2) {
      const newMoves = moves + 1;
      setMoves(newMoves);
      setIsChecking(true);
      lockRef.current = true;

      const [firstId, secondId] = newFlippedIds;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
          )
        );
        setFlippedIds([]);
        setIsChecking(false);
        lockRef.current = false;

        const totalMatched =
          cards.filter((c) => c.matched).length + 2;
        if (totalMatched === EMOJI_SET.length * 2) {
          setGameWon(true);
          if (bestScore === null || newMoves < bestScore) {
            setBestScore(newMoves);
            localStorage.setItem('mumaa_gameBestScore', newMoves.toString());
          }
        }
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, flipped: false }
                : c
            )
          );
          setFlippedIds([]);
          setIsChecking(false);
          lockRef.current = false;
        }, 1000);
      }
    }
  };

  const matchedCount = cards.filter((c) => c.matched).length;
  const totalPairs = EMOJI_SET.length;

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar bg-transparent pb-16">
      <div className="max-w-3xl mx-auto px-4 py-5 md:px-6 md:py-7 text-center">
        <div className="bg-white rounded-2xl min-[854px]:rounded-[2rem] p-4 min-[854px]:p-6 border border-stone-100 mb-6 soft-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 min-[854px]:h-2 gradient-lavender"></div>

          {/* Header */}
          <div className="mb-5 min-[854px]:mb-6 mt-1">
            <div className="flex items-center justify-center gap-2 min-[854px]:gap-3 mb-2">
              <div className="p-2 min-[854px]:p-2.5 bg-purple-50 text-purple-500 rounded-xl shadow-sm border border-white">
                <BrainCircuit className="w-5 h-5 min-[854px]:w-6 min-[854px]:h-6" />
              </div>
              <h2 className="text-xl min-[854px]:text-2xl font-bold text-stone-800 tracking-tight">
                Memory Match
              </h2>
            </div>
            <p className="text-xs min-[854px]:text-sm font-medium text-stone-500">
              A gentle cognitive exercise. Play together!
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5 sm:mb-6 bg-stone-50 p-3 sm:p-4 rounded-xl min-[854px]:rounded-[1.5rem] border border-stone-100">
            <div className="flex flex-wrap justify-center gap-4 min-[854px]:gap-6">
              <div className="text-center">
                <div className="text-[10px] min-[854px]:text-[11px] text-stone-400 uppercase tracking-widest font-bold mb-0.5">
                  Moves
                </div>
                <div className="text-xl min-[854px]:text-2xl font-bold text-stone-800">{moves}</div>
              </div>
              <div className="w-px bg-stone-200"></div>
              <div className="text-center">
                <div className="text-[10px] min-[854px]:text-[11px] text-stone-400 uppercase tracking-widest font-bold mb-0.5">
                  Best
                </div>
                <div className="text-xl min-[854px]:text-2xl font-bold text-purple-500">
                  {bestScore !== null ? bestScore : '--'}
                </div>
              </div>
              <div className="w-px bg-stone-200"></div>
              <div className="text-center">
                <div className="text-[10px] min-[854px]:text-[11px] text-stone-400 uppercase tracking-widest font-bold mb-0.5">
                  Pairs
                </div>
                <div className="text-xl min-[854px]:text-2xl font-bold text-emerald-500">
                  {matchedCount / 2}/{totalPairs}
                </div>
              </div>
            </div>
            <button
              onClick={initGame}
              className="w-full sm:w-auto bg-white hover:bg-stone-50 text-stone-700 px-4 py-2 min-[854px]:px-5 min-[854px]:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-stone-200 shadow-sm flex items-center justify-center gap-1.5 btn-press"
            >
              <RotateCcw className="w-3.5 h-3.5 min-[854px]:w-4 min-[854px]:h-4" /> Restart
            </button>
          </div>

          {/* Memory Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mx-auto w-full max-w-[400px] p-3 sm:p-4 bg-stone-50 rounded-2xl min-[854px]:rounded-[2.5rem] border border-stone-100">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={isChecking}
                className="memory-card aspect-square cursor-pointer disabled:cursor-default rounded-2xl overflow-hidden"
                style={{ perspective: '1000px' }}
              >
                <div
                  className={`memory-card-inner relative w-full h-full text-center transition-transform duration-500 ease-out will-change-transform ${
                    card.flipped || card.matched ? 'rotate-y-180' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform:
                      card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front (hidden side) */}
                  <div
                    className="memory-card-front absolute inset-0 rounded-2xl flex items-center justify-center bg-white border-2 border-stone-100 hover:border-purple-200 transition-colors shadow-sm"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <BrainCircuit className="w-5 h-5 min-[854px]:w-6 min-[854px]:h-6 text-purple-100" />
                  </div>
                  {/* Back (emoji side) */}
                  <div
                    className={`memory-card-back absolute inset-0 rounded-2xl flex items-center justify-center text-2xl min-[854px]:text-3xl shadow-md border-2 border-white ${
                      card.matched
                        ? 'gradient-lavender ring-2 min-[854px]:ring-4 ring-white/50'
                        : 'gradient-lavender'
                    }`}
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {card.emoji}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Win Message */}
          {gameWon && (
            <div className="mt-5 min-[854px]:mt-6 gradient-lavender border border-white rounded-xl min-[854px]:rounded-[1.5rem] p-5 min-[854px]:p-6 shadow-lg animate-fade-in">
              <div className="text-3xl min-[854px]:text-4xl mb-2 animate-bounce">🎉</div>
              <h3 className="text-xl min-[854px]:text-2xl font-bold text-purple-900 mb-1">Wonderful!</h3>
              <p className="text-xs min-[854px]:text-sm font-medium text-purple-700 mb-4">
                You matched all the pairs perfectly.
              </p>
              <button
                onClick={initGame}
                className="bg-white text-purple-700 px-5 py-2 min-[854px]:px-6 min-[854px]:py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md btn-press border border-purple-100"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}