import { useState } from "react";
import { assetUrl } from "../../../lib/assetUrl";

interface ModalCarouselProps {
  images: string[];
  altText: string;
}

/**
 * Preserves styles.css:1559-1679 exactly: `.carousel-slide-bg` (blurred
 * background layer) + `.modal-hero-img` (sharp foreground image) per
 * slide, `.carousel-dot`/`.carousel-dot.active` indicators. Nav
 * buttons/indicators render only when there's more than one image
 * (the legacy code toggled `display:none`; conditional rendering here
 * is equivalent). Parent remounts this component (via `key`) when the
 * active project changes, so `index` naturally resets to 0.
 */
export function ModalCarousel({ images, altText }: ModalCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="modal-carousel-container" id="modal-carousel-container">
      <div className="modal-carousel-track" id="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((src, i) => {
          const safeSrc = assetUrl(src);
          return (
            <div className="carousel-slide" key={i}>
              <img className="carousel-slide-bg" src={safeSrc} aria-hidden="true" alt="" />
              <img className="modal-hero-img" src={safeSrc} alt={`${altText} ${i + 1}`} />
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button className="carousel-nav-btn prev-btn" id="carousel-prev" aria-label="Önceki resim" onClick={prev}>
            &#10094;
          </button>
          <button className="carousel-nav-btn next-btn" id="carousel-next" aria-label="Sonraki resim" onClick={next}>
            &#10095;
          </button>
          <div className="carousel-indicators" id="carousel-indicators">
            {images.map((_, i) => (
              <span
                key={i}
                className={`carousel-dot${i === index ? " active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
