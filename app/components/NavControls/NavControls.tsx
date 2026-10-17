import React from "react";
import "./nav-controls.css";

interface NavControlsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  previousAriaLabel?: string;
  nextAriaLabel?: string;
}

export default function NavControls({
  onPrevious,
  onNext,
  hasPrevious = true,
  hasNext = true,
  previousAriaLabel = "Sadurunge",
  nextAriaLabel = "Sabanjure",
}: NavControlsProps) {
  return (
    <>
      {hasPrevious && (
        <aside className="cemorosewu-nav-wrapper cemorosewu-nav-left" aria-label={previousAriaLabel}>
          <button
            type="button"
            id="btn-nav-prev"
            onClick={onPrevious}
            className="cemorosewu-nav-btn"
            aria-label={previousAriaLabel}
            title={previousAriaLabel}
          >
            <img
              src="/main_assets/previous.png"
              alt={previousAriaLabel}
              className="cemorosewu-nav-icon"
              draggable={false}
            />
          </button>
        </aside>
      )}

      {hasNext && (
        <aside className="cemorosewu-nav-wrapper cemorosewu-nav-right" aria-label={nextAriaLabel}>
          <button
            type="button"
            id="btn-nav-next"
            onClick={onNext}
            className="cemorosewu-nav-btn"
            aria-label={nextAriaLabel}
            title={nextAriaLabel}
          >
            <img
              src="/main_assets/next.png"
              alt={nextAriaLabel}
              className="cemorosewu-nav-icon"
              draggable={false}
            />
          </button>
        </aside>
      )}
    </>
  );
}
