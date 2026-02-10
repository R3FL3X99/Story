import { useEffect, useRef, useState } from 'react'

function Book({ pages, currentIndex, onNext, onPrev, response, onRespond, onYes, nudge, isLocked }) {
  const [startX, setStartX] = useState(null)
  const [dragDelta, setDragDelta] = useState(0)
  const [noPosition, setNoPosition] = useState(null)
  const finaleRef = useRef(null)
  const noButtonRef = useRef(null)

  const handlePointerDown = (event) => {
    if (isLocked) return
    setStartX(event.clientX)
  }

  const handlePointerUp = (event) => {
    if (isLocked) return
    if (startX === null) return
    const delta = startX - event.clientX
    if (delta > 50) onNext()
    if (delta < -50) onPrev()
    setStartX(null)
    setDragDelta(0)
  }

  const handlePointerMove = (event) => {
    if (isLocked) return
    if (startX === null) return
    setDragDelta(event.clientX - startX)
  }

  const shuffleNoButton = () => {
    if (isLocked) return
    const zone = finaleRef.current
    const button = noButtonRef.current
    if (!zone || !button) return

    const zoneRect = zone.getBoundingClientRect()
    const btnRect = button.getBoundingClientRect()
    const padding = 12

    const maxX = Math.max(0, zoneRect.width - btnRect.width - padding)
    const maxY = Math.max(0, zoneRect.height - btnRect.height - padding)

    const x = Math.floor(Math.random() * (maxX + 1))
    const y = Math.floor(Math.random() * (maxY + 1))

    setNoPosition({ x, y })
  }

  const flippedIndex = Math.max(currentIndex - 1, 0)
  const nudgeBend = nudge === 1 ? 8 : nudge === -1 ? -8 : 0
  const finaleIndex = pages.findIndex((page) => page.front.question)

  useEffect(() => {
    if (currentIndex !== pages.length || finaleIndex === -1) {
      setNoPosition(null)
    }
  }, [currentIndex, pages.length, finaleIndex])

  return (
    <section
      className="book"
      aria-live="polite"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className={`cover${currentIndex > 0 ? ' open' : ''}`}>
        <div className="cover-face">
          <h1 className="cover-title">
            <span>To Glow</span>
            <span>The Love of My Life</span>
          </h1>
        </div>
      </div>
      {pages.map((page, index) => (
        <div
          key={page.front.title}
          className={`page stack${index < flippedIndex ? ' flipped' : ''}`}
          data-index={index}
          style={{
            zIndex: pages.length - index,
            '--bend': `${
              index === flippedIndex && dragDelta === 0
                ? nudgeBend
                : Math.min(18, Math.max(-18, dragDelta / 8))
            }deg`,
          }}
        >
          <div className="page-face front">
            <div
              className={`page-content${page.front.signature ? ' hero' : ''}${
                page.front.question ? ' finale-question' : ''
              }${page.front.compact ? ' compact' : ''}${
                page.front.compact ? ' chapter-two' : ''
              }`}
              ref={page.front.question ? finaleRef : null}
            >
              <p className="eyebrow">{page.front.eyebrow}</p>
              {page.front.signature ? <h1>{page.front.title}</h1> : <h2>{page.front.title}</h2>}
              <p>{page.front.text}</p>
              {page.front.pill && <div className="pill">{page.front.pill}</div>}
              {page.front.signature && <div className="signature">{page.front.signature}</div>}
              {page.front.media &&
                (typeof page.front.media === 'string' ? (
                  <div className="media placeholder">{page.front.media}</div>
                ) : (
                  <div className="media frame">
                    <img
                      src={page.front.media.src}
                      alt={page.front.media.alt}
                      loading="lazy"
                    />
                  </div>
                ))}
              {page.front.question && (
                <div className="question-card">
                  <h3>Will you be my Valentine?</h3>
                  <div className="answer-row">
                    <button
                      type="button"
                      className="answer yes"
                      onClick={onYes}
                      disabled={isLocked}
                    >
                      Yes
                    </button>
                    <button
                      ref={noButtonRef}
                      type="button"
                      className={`answer no${noPosition ? ' escaped' : ''}`}
                      onPointerEnter={shuffleNoButton}
                      onPointerDown={() => {
                        shuffleNoButton()
                        onRespond('I will wait for the perfect yes.')
                      }}
                      onTouchStart={shuffleNoButton}
                      disabled={isLocked}
                      style={
                        noPosition
                          ? {
                              left: `${noPosition.x}px`,
                              top: `${noPosition.y}px`,
                            }
                          : undefined
                      }
                    >
                      No
                    </button>
                  </div>
                  <p className="response">{response}</p>
                </div>
              )}
            </div>
          </div>
          <div className="page-face back">
            <div className={`page-content${page.back.ending ? ' ending' : ''}`}>
              {page.back.eyebrow && <p className="eyebrow">{page.back.eyebrow}</p>}
              <h2>{page.back.title}</h2>
              {page.back.text && <p>{page.back.text}</p>}
              {page.back.media &&
                (typeof page.back.media === 'string' ? (
                  <div className="media placeholder">{page.back.media}</div>
                ) : (
                  <div className="media frame">
                    <img
                      src={page.back.media.src}
                      alt={page.back.media.alt}
                      loading="lazy"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

export default Book
