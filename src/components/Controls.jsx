function Controls({ currentIndex, totalPages, onNext, onPrev, disabled }) {
  return (
    <nav className="controls">
      <button type="button" onClick={onPrev} aria-label="Previous page" disabled={disabled}>
        ◀
      </button>
      <span className="pager">
        {currentIndex + 1} / {totalPages}
      </span>
      <button type="button" onClick={onNext} aria-label="Next page" disabled={disabled}>
        ▶
      </button>
    </nav>
  )
}

export default Controls
