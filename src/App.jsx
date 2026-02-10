import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import TopBar from './components/TopBar'
import Book from './components/Book'
import Controls from './components/Controls'

function App() {
  const pages = useMemo(
    () => [
      {
        front: {
          eyebrow: 'A quiet little journey',
          title: 'Every page is a heartbeat.',
          text:
            'In the soft glow of February, I wrote this for you. A few moments, a few wishes, and one question that matters most.',
          pill: 'Swipe or use the arrows',
          signature: '— Yours',
        },
        back: {
          eyebrow: 'Chapter I',
          title: 'The Way You Entered My Days',
          text:
            'Placeholder for your first memory together. A sentence about how her smile changed the room, or how the world got softer the day you met.',
          media: 'Photo / GIF',
        },
      },
      {
        front: {
          eyebrow: 'Chapter II',
          title: 'The Little Things',
          compact: true,
          text: `My love ❤️
I still remember the day we met on your street and the night of our first kiss. How enchanting eyes were is something I can never forget.
Whenever I’m with you, I feel complete and at peace. I keep imagining our future together happy, married, and building a beautiful family.
I pray to God for long life and wisdom to love and care for His precious daughter, Elo Marvelous Edafeasume.`,
          media: {
            type: 'image',
            src: '/peach-cat-hug.gif',
            alt: 'Peach cat hug',
          },
        },
        back: {
          eyebrow: 'Chapter III',
          title: 'Where I Want to Be',
          text:
            'Placeholder for a future scene: a city to visit, a rainy day, a Sunday morning. A sentence about choosing her, always.',
          media: 'Favorite Quote',
        },
      },
      {
        front: {
          eyebrow: 'Chapter IV',
          title: 'The Promise',
          text: `They say promises are meant to be broken, but not ours. I choose you, every day. I’m sticking with you till the very end through the fights, through misunderstandings, through thick and thin.
You are my heart, my love, and my forever ❤️`,
          media: {
            type: 'image',
            src: '/promise.gif',
            alt: 'Promise gif',
          },
        },
        back: {
          eyebrow: 'Chapter V',
          title: 'If I Could Freeze Time',
          text:
            'Placeholder for a moment you wish could last forever. A gentle reminder that she is your favorite place.',
          media: 'A Shared Song',
        },
      },
      {
        front: {
          eyebrow: 'Finale',
          title: 'One Question',
          text:
            'If this story has a title, it is the way I feel around you. I want to make more pages together.',
          question: true,
        },
        back: {
          ending: true,
          title: 'Thank you for turning every page.',
          text: 'Add your own message here.',
        },
      },
    ],
    []
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [response, setResponse] = useState('')
  const audioRef = useRef(null)
  const [nudge, setNudge] = useState(0)
  const nudgeTimer = useRef(null)
  const [isClosing, setIsClosing] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [showStartOverlay, setShowStartOverlay] = useState(false)
  const closeTimer = useRef(null)

  const totalPages = pages.length + 1
  const isLocked = isClosing || showHearts
  const hearts = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: Math.floor(Math.random() * 100),
        duration: 5 + Math.random() * 4,
        delay: Math.random() * 3,
        size: 14 + Math.random() * 22,
      })),
    []
  )

  const flipForward = () => {
    if (isLocked) return
    setCurrentIndex((prev) => Math.min(prev + 1, pages.length))
    setNudge(1)
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current)
    nudgeTimer.current = setTimeout(() => setNudge(0), 220)
  }

  const flipBack = () => {
    if (isLocked) return
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
    setNudge(-1)
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current)
    nudgeTimer.current = setTimeout(() => setNudge(0), 220)
  }

  const handleYes = () => {
    if (isClosing) return
    setResponse('You just made this the best day ever.')
    setShowHearts(false)
    setIsClosing(true)
    if (closeTimer.current) clearInterval(closeTimer.current)
    closeTimer.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev <= 0) {
          if (closeTimer.current) {
            clearInterval(closeTimer.current)
            closeTimer.current = null
          }
          setIsClosing(false)
          setShowHearts(true)
          return 0
        }
        return prev - 1
      })
    }, 520)
  }

  const restartAndPlay = useCallback(() => {
    if (!audioRef.current) return
    const audio = audioRef.current
    audio.pause()
    audio.currentTime = 0
    audio.load()
    const playPromise = audio.play()
    if (playPromise?.then && playPromise?.catch) {
      playPromise
        .then(() => {
          setShowStartOverlay(false)
        })
        .catch(() => {
          setShowStartOverlay(true)
        })
    } else {
      setShowStartOverlay(false)
    }
  }, [])

  useEffect(() => {
    restartAndPlay()
    window.addEventListener('pageshow', restartAndPlay)

    return () => {
      window.removeEventListener('pageshow', restartAndPlay)
    }
  }, [restartAndPlay])

  useEffect(() => {
    return () => {
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current)
      if (closeTimer.current) clearInterval(closeTimer.current)
    }
  }, [])

  return (
    <>
      <div className="ambient" />
      <main className="stage">
        <TopBar />
        <Book
          pages={pages}
          currentIndex={currentIndex}
          onNext={flipForward}
          onPrev={flipBack}
          response={response}
          onRespond={setResponse}
          onYes={handleYes}
          nudge={nudge}
          isLocked={isLocked}
        />
        <Controls
          currentIndex={currentIndex}
          totalPages={totalPages}
          onNext={flipForward}
          onPrev={flipBack}
          disabled={isLocked}
        />
      </main>
      {showHearts && (
        <div className="hearts-rain" aria-hidden="true">
          {hearts.map((heart) => (
            <span
              key={heart.id}
              className="heart"
              style={{
                '--left': `${heart.left}%`,
                '--duration': `${heart.duration}s`,
                '--delay': `${heart.delay}s`,
                '--size': `${heart.size}px`,
              }}
            >
              ❤
            </span>
          ))}
        </div>
      )}
      {showStartOverlay && (
        <div className="start-overlay">
          <button type="button" className="start-overlay-btn" onClick={restartAndPlay}>
            A Love Story
          </button>
        </div>
      )}
      <audio ref={audioRef} loop autoPlay>
        <source src="/i_hear_a_symphony.m4a" type="audio/mp4" />
      </audio>
    </>
  )
}

export default App
