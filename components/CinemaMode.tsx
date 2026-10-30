'use client';
import React, { useState, useEffect, useRef } from 'react';

export interface CinemaSlide {
  src: string;
  cap?: string;
  pageIdx: number;
  eraTitle?: string;
  eraYrs?: string;
  classTitle?: string;
  classYrs?: string;
  slotIdx: number;
}

interface CinemaModeProps {
  slides: CinemaSlide[];
  initialIdx?: number;
  onClose: () => void;
  onGoPage: (pageIdx: number) => void;
  musicPlaying: boolean;
  onToggleMusic: () => void;
  bgMusicTitle?: string;
  onOpenMusicSettings?: () => void;
  canEdit?: boolean;
}

export default function CinemaMode({
  slides,
  initialIdx = 0,
  onClose,
  onGoPage,
  musicPlaying,
  onToggleMusic,
  bgMusicTitle,
  onOpenMusicSettings,
  canEdit
}: CinemaModeProps) {
  const [curIdx, setCurIdx] = useState(
    Math.max(0, Math.min(slides.length - 1, initialIdx))
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const timerRef = useRef<any>(null);

  const slide = slides[curIdx] || slides[0];

  // Auto advance every 10 seconds (100 ticks of 100ms)
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurIdx(i => (i + 1) % slides.length);
          return 0;
        }
        return prev + 1; // 1% every 100ms = 10,000ms = 10s
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, slides.length]);

  // Reset progress and animation trigger on slide change
  useEffect(() => {
    setProgress(0);
    setImgLoaded(false);
  }, [curIdx]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length]);

  const nextSlide = () => {
    setProgress(0);
    setCurIdx(i => (i + 1) % slides.length);
  };

  const prevSlide = () => {
    setProgress(0);
    setCurIdx(i => (i - 1 + slides.length) % slides.length);
  };

  if (!slide) return null;

  const badgeText = [
    slide.eraTitle,
    slide.classTitle ? `› ${slide.classTitle}` : '',
    slide.classYrs || slide.eraYrs ? `(${slide.classYrs || slide.eraYrs})` : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="cinema-overlay" onClick={e => e.stopPropagation()}>
      <style>{`
        .cinema-overlay {
          position: fixed;
          inset: 0;
          z-index: 120;
          background: #090604;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          user-select: none;
          animation: cinemaFadeIn 0.5s ease-out;
        }
        @keyframes cinemaFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .cinema-backdrop {
          position: absolute;
          inset: -30px;
          background-size: cover;
          background-position: center;
          filter: blur(45px) brightness(0.22) saturate(1.2);
          transform: scale(1.08);
          opacity: 0.85;
          pointer-events: none;
          transition: background-image 0.8s ease-in-out;
        }
        .cinema-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(10,7,4,0.3) 0%, rgba(5,3,2,0.85) 75%, rgba(0,0,0,0.98) 100%);
          pointer-events: none;
        }
        .cinema-topbar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%);
          color: #f7ecd2;
          font-family: 'Cinzel', serif;
        }
        .cinema-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cinema-badge-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle, #e2c079, #9d6d24);
          color: #2b1807;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          box-shadow: 0 0 12px rgba(226,192,121,0.4);
        }
        .cinema-heading {
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #e8c782;
          font-weight: 700;
          text-shadow: 0 2px 8px rgba(0,0,0,0.8);
        }
        .cinema-top-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cinema-counter {
          font-family: 'Lora', serif;
          font-size: 13.5px;
          color: #f2dec0;
          background: rgba(40,25,10,0.7);
          padding: 5px 14px;
          border-radius: 999px;
          border: 1px solid rgba(226,192,121,0.3);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .cinema-music-btn {
          all: unset;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(40,25,10,0.75);
          color: #f6e7bd;
          border: 1px solid rgba(201,164,92,0.45);
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 12.5px;
          transition: all 0.25s;
        }
        .cinema-music-btn:hover {
          background: rgba(70,45,15,0.9);
          border-color: #f6e7bd;
          box-shadow: 0 0 14px rgba(201,164,92,0.4);
        }
        .cinema-music-btn.playing {
          border-color: #f6e7bd;
          box-shadow: 0 0 10px rgba(201,164,92,0.35);
        }
        .cinema-close-btn {
          all: unset;
          cursor: pointer;
          background: rgba(60,25,20,0.85);
          color: #f9ded7;
          border: 1px solid rgba(255,140,120,0.4);
          padding: 5px 16px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .cinema-close-btn:hover {
          background: rgba(120,30,20,0.95);
          color: #fff;
          transform: scale(1.04);
        }
        .cinema-progress-line {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.12);
        }
        .cinema-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #d4af37, #f6e7bd, #e2c079);
          box-shadow: 0 0 8px rgba(212,175,55,0.8);
          transition: width 0.1s linear;
        }
        .cinema-stage {
          position: relative;
          z-index: 5;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 24px 8px;
          min-height: 0;
        }
        .cinema-frame-wrap {
          position: relative;
          max-width: 90vw;
          max-height: 68vh;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 8px;
          background: #fffdf5;
          box-shadow: 0 24px 70px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,164,92,0.4);
          animation: cinemaSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes cinemaSlideIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .cinema-img {
          max-width: calc(90vw - 16px);
          max-height: calc(68vh - 16px);
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 4px;
          display: block;
          transition: transform 10s ease-out;
        }
        .cinema-img.kenburns {
          transform: scale(1.045);
        }
        .cinema-bottom-panel {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 10px 24px 22px;
          background: linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 80%, transparent 100%);
        }
        .cinema-caption-box {
          text-align: center;
          max-width: 780px;
          margin: 0 auto;
        }
        .cinema-class-badge {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #d4af37;
          text-transform: uppercase;
          background: rgba(35,22,8,0.75);
          padding: 3px 12px;
          border-radius: 999px;
          border: 1px solid rgba(212,175,55,0.35);
          margin-bottom: 5px;
        }
        .cinema-cap-text {
          font-family: 'Lora', Georgia, serif;
          font-size: 16.5px;
          color: #f7ecd2;
          font-style: italic;
          line-height: 1.4;
          text-shadow: 0 2px 10px rgba(0,0,0,0.95);
          min-height: 1.4em;
        }
        .cinema-controls {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 4px;
        }
        .cinema-ctrl-btn {
          all: unset;
          cursor: pointer;
          background: rgba(45,30,12,0.85);
          color: #f6e7bd;
          border: 1px solid rgba(201,164,92,0.45);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.5);
          transition: all 0.2s;
        }
        .cinema-ctrl-btn:hover {
          background: rgba(75,50,20,0.95);
          border-color: #f6e7bd;
          transform: scale(1.08);
          box-shadow: 0 6px 18px rgba(201,164,92,0.4);
        }
        .cinema-ctrl-btn.play-btn {
          width: 44px;
          height: 44px;
          font-size: 18px;
          background: radial-gradient(circle, #c9a45c, #8f5f1c);
          color: #fff;
          border-color: #f6e7bd;
        }
        .cinema-ctrl-btn.play-btn:hover {
          background: radial-gradient(circle, #e2c079, #ad7322);
          transform: scale(1.1);
        }
        .cinema-book-jump {
          all: unset;
          cursor: pointer;
          background: rgba(30,20,8,0.7);
          color: #c9a45c;
          border: 1px solid rgba(201,164,92,0.3);
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 12px;
          transition: all 0.2s;
        }
        .cinema-book-jump:hover {
          background: rgba(50,32,12,0.9);
          color: #f6e7bd;
          border-color: #f6e7bd;
        }
      `}</style>

      {/* Blurred atmospheric backdrop */}
      <div
        className="cinema-backdrop"
        style={{ backgroundImage: `url(${slide.src})` }}
      />
      <div className="cinema-vignette" />

      {/* Top Header */}
      <div className="cinema-topbar">
        <div className="cinema-title-wrap">
          <div className="cinema-badge-icon">🎬</div>
          <div>
            <div className="cinema-heading">THƯỚC PHIM KÝ ỨC 60 NĂM</div>
            <div style={{ fontSize: 11, opacity: 0.7, color: '#e6cda0' }}>
              Trường THPT Quế Võ số 1 · 1966 — 2026
            </div>
          </div>
        </div>

        <div className="cinema-top-right">
          <button
            type="button"
            className={`cinema-music-btn ${musicPlaying ? 'playing' : ''}`}
            onClick={onToggleMusic}
            title={musicPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
          >
            <span>{musicPlaying ? '🎵' : '🔇'}</span>
            <span>{musicPlaying ? (bgMusicTitle || 'Đang phát nhạc') : 'Bật nhạc'}</span>
          </button>
          {canEdit && onOpenMusicSettings && (
            <button
              type="button"
              className="cinema-music-btn"
              onClick={onOpenMusicSettings}
              title="Đổi link YouTube nhạc nền"
              style={{ padding: '5px 10px' }}
            >
              ⚙ Đổi nhạc
            </button>
          )}
          <div className="cinema-counter">
            {curIdx + 1} / {slides.length}
          </div>
          <button
            type="button"
            className="cinema-close-btn"
            onClick={onClose}
            title="Thoát chế độ xem phim (phím Esc)"
          >
            ✕ Thoát
          </button>
        </div>
      </div>

      {/* 10s Countdown Progress Line */}
      <div className="cinema-progress-line">
        <div
          className="cinema-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Center Image Stage */}
      <div className="cinema-stage" onClick={nextSlide} title="Bấm để chuyển ảnh tiếp theo">
        <div className="cinema-frame-wrap" onClick={e => e.stopPropagation()}>
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.cap || 'Kỷ niệm Quế Võ 1'}
            className={`cinema-img ${imgLoaded ? 'kenburns' : ''}`}
            onLoad={() => setImgLoaded(true)}
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Panel: Caption & Playback Controls */}
      <div className="cinema-bottom-panel">
        <div className="cinema-caption-box">
          {badgeText && (
            <div className="cinema-class-badge">{badgeText}</div>
          )}
          <div className="cinema-cap-text">
            {slide.cap && slide.cap !== 'Chú thích ký ức…' && slide.cap !== 'Chú thích…'
              ? slide.cap
              : 'Những khoảnh khắc tự hào và đong đầy yêu thương dưới mái trường Quế Võ số 1.'}
          </div>
        </div>

        <div className="cinema-controls">
          <button
            type="button"
            className="cinema-ctrl-btn"
            onClick={prevSlide}
            title="Ảnh trước (phím Mũi tên trái)"
          >
            ⏮
          </button>

          <button
            type="button"
            className="cinema-ctrl-btn play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Tạm dừng tự động (mỗi 10s)' : 'Tiếp tục tự động trình chiếu'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            type="button"
            className="cinema-ctrl-btn"
            onClick={nextSlide}
            title="Ảnh tiếp theo (phím Mũi tên phải hoặc Space)"
          >
            ⏭
          </button>

          <button
            type="button"
            className="cinema-book-jump"
            onClick={() => onGoPage(slide.pageIdx)}
            title="Mở ngay trang này trong cuốn sách lật"
          >
            📖 Mở trang {slide.pageIdx + 1} trong sách
          </button>
        </div>
      </div>
    </div>
  );
}
