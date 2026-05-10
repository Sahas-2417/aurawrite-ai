import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo.png';

// ─── Particle System ──────────────────────────────────────────────────
const Particle = ({ delay, duration, x, y, size, opacity }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: `radial-gradient(circle, rgba(168,85,247,${opacity}) 0%, rgba(139,92,246,0) 70%)`,
      filter: 'blur(1px)',
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, opacity, opacity * 0.6, opacity, 0],
      scale: [0, 1, 1.2, 0.8, 0],
      y: [0, -30, -60, -90, -120],
      x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
    }}
    transition={{
      duration: duration,
      delay: delay,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: Math.random() * 2,
    }}
  />
);

// ─── Fog Layer ────────────────────────────────────────────────────────
const FogLayer = ({ delay = 0 }) => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.15, 0.08, 0.12, 0.06] }}
    transition={{ duration: 8, delay, ease: 'easeInOut', repeat: Infinity }}
    style={{
      background: 'radial-gradient(ellipse at 50% 60%, rgba(139,92,246,0.12) 0%, rgba(88,28,135,0.05) 40%, transparent 70%)',
      filter: 'blur(40px)',
    }}
  />
);

// ─── Energy Trail ──────────────────────────────────────────────────────
const EnergyTrail = ({ startDelay }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{
      width: '200px',
      height: '3px',
      background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.8), rgba(192,132,252,0.9), rgba(168,85,247,0.4), transparent)',
      filter: 'blur(1px)',
      boxShadow: '0 0 15px rgba(168,85,247,0.6), 0 0 30px rgba(139,92,246,0.3)',
      top: '50%',
      left: '-200px',
      borderRadius: '2px',
    }}
    initial={{ left: '-200px', opacity: 0 }}
    animate={{
      left: ['−200px', '110%'],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: 1.2,
      delay: startDelay,
      ease: [0.25, 0.1, 0.25, 1],
    }}
  />
);

// ─── Ambient Particle (post-reveal) ──────────────────────────────────
const AmbientParticle = ({ index }) => {
  const randomX = useMemo(() => Math.random() * 100, []);
  const randomY = useMemo(() => Math.random() * 100, []);
  const randomSize = useMemo(() => Math.random() * 4 + 2, []);
  const randomDelay = useMemo(() => Math.random() * 3, []);
  const randomDuration = useMemo(() => 3 + Math.random() * 4, []);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: randomSize,
        height: randomSize,
        left: `${randomX}%`,
        top: `${randomY}%`,
        background: 'rgba(168,85,247,0.6)',
        boxShadow: '0 0 6px rgba(168,85,247,0.4)',
      }}
      animate={{
        opacity: [0, 0.7, 0.3, 0.6, 0],
        y: [0, -20, -40],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// ─── Main Intro Animation ──────────────────────────────────────────────
const IntroAnimation = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  // 0: black + particles fade in
  // 1: logo ghost outline
  // 2: feather streak + logo activation
  // 3: bloom + text reveal
  // 4: hold + ambient
  // 5: fade out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),     // Particles visible → show ghost logo
      setTimeout(() => setPhase(2), 2000),     // Ghost logo → feather streak
      setTimeout(() => setPhase(3), 3200),     // Streak done → bloom + text
      setTimeout(() => setPhase(4), 4800),     // Text visible → hold
      setTimeout(() => setPhase(5), 6200),     // Hold → fade out
      setTimeout(() => onComplete(), 7200),    // Fully faded → mount app
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Generate particles data once
  const particles = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 30 + Math.random() * 50,
      size: Math.random() * 6 + 2,
      opacity: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 4,
    })), []
  );

  const ambientParticles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({ id: i })), []
  );

  return (
    <AnimatePresence>
      {phase < 5 ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: '#000000' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ── Fog Layers ──────────────────────────────────────── */}
          <FogLayer delay={0.3} />
          <FogLayer delay={1.5} />

          {/* ── Floating Particles ──────────────────────────────── */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 0 ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          >
            {particles.map((p) => (
              <Particle key={p.id} {...p} />
            ))}
          </motion.div>

          {/* ── Central Stage ──────────────────────────────────── */}
          <div className="relative flex flex-col items-center justify-center">

            {/* Outer Glow Ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '280px',
                height: '280px',
                background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: phase >= 1 ? [0, 0.6, 0.3, 0.5] : 0,
                scale: phase >= 2 ? [0.8, 1.1, 1] : 0.5,
              }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />

            {/* Logo Container */}
            <motion.div
              className="relative"
              style={{ width: '160px', height: '160px' }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{
                scale: phase >= 3 ? 1 : phase >= 1 ? 0.9 : 0.85,
                opacity: phase >= 1 ? 1 : 0,
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Ghost Outline Logo (Phase 1) */}
              <motion.img
                src={logoImg}
                alt=""
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  filter: phase < 2
                    ? 'brightness(0.3) saturate(0.5) drop-shadow(0 0 20px rgba(168,85,247,0.2))'
                    : 'brightness(1) saturate(1.2) drop-shadow(0 0 30px rgba(168,85,247,0.6))',
                  transition: 'filter 1s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 1 ? 1 : 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />

              {/* Neon Bloom Layer (Phase 2+) */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={logoImg}
                  alt=""
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'brightness(1.5) saturate(2) blur(8px)',
                    opacity: 0.5,
                    mixBlendMode: 'screen',
                  }}
                />
              </motion.div>

              {/* Pulse Glow (Phase 3+) */}
              <motion.div
                className="absolute inset-[-20px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 60%)',
                  filter: 'blur(15px)',
                }}
                animate={phase >= 3 ? {
                  opacity: [0.3, 0.7, 0.3],
                  scale: [0.95, 1.05, 0.95],
                } : { opacity: 0 }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* ── Feather Energy Streak (Phase 2) ─────────────── */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
              }}
            >
              {/* Main Streak */}
              <motion.div
                className="absolute"
                style={{
                  width: '300px',
                  height: '4px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.3) 10%, rgba(192,132,252,0.9) 40%, rgba(255,255,255,0.95) 50%, rgba(192,132,252,0.9) 60%, rgba(168,85,247,0.3) 90%, transparent 100%)',
                  filter: 'blur(1px)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(139,92,246,0.4), 0 0 60px rgba(168,85,247,0.2)',
                  top: '50%',
                  borderRadius: '4px',
                  transformOrigin: 'center',
                }}
                initial={{ left: '-350px', opacity: 0, scaleX: 1.5 }}
                animate={phase >= 2 ? {
                  left: ['-350px', '50%', '110%'],
                  opacity: [0, 1, 1, 0],
                  scaleX: [1.5, 1, 0.6],
                } : {}}
                transition={{
                  duration: 1.0,
                  ease: [0.25, 0.1, 0.25, 1],
                  times: [0, 0.4, 1],
                }}
              />

              {/* Secondary trail */}
              <motion.div
                className="absolute"
                style={{
                  width: '200px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.6), rgba(168,85,247,0.3), transparent)',
                  filter: 'blur(2px)',
                  boxShadow: '0 0 10px rgba(168,85,247,0.4)',
                  top: 'calc(50% + 8px)',
                  borderRadius: '2px',
                }}
                initial={{ left: '-250px', opacity: 0 }}
                animate={phase >= 2 ? {
                  left: ['-250px', '55%', '115%'],
                  opacity: [0, 0.7, 0],
                } : {}}
                transition={{
                  duration: 1.1,
                  delay: 0.08,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />

              {/* Spark burst at impact point */}
              <motion.div
                className="absolute"
                style={{
                  width: '80px',
                  height: '80px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(192,132,252,0.5) 30%, transparent 60%)',
                  borderRadius: '50%',
                  filter: 'blur(3px)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={phase >= 2 ? {
                  opacity: [0, 0, 1, 0],
                  scale: [0, 0, 1.5, 2.5],
                } : {}}
                transition={{
                  duration: 1.2,
                  times: [0, 0.35, 0.45, 1],
                  ease: 'easeOut',
                }}
              />
            </motion.div>

            {/* ── Camera Zoom Effect ─────────────────────────── */}
            <motion.div
              className="absolute inset-0"
              animate={phase >= 3 ? { scale: [1, 1.02, 1.01] } : {}}
              transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* ── Text Reveal ────────────────────────────────── */}
            <motion.div
              className="mt-10 flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Brand Name */}
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white"
                style={{
                  textShadow: '0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(139,92,246,0.2)',
                }}
                initial={{ opacity: 0, y: 15, letterSpacing: '0.1em' }}
                animate={phase >= 3 ? {
                  opacity: 1,
                  y: 0,
                  letterSpacing: '-0.02em',
                } : {}}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                AuraWrite{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #c084fc, #e9d5ff, #a855f7)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'intro-text-shine 3s ease infinite',
                  }}
                >
                  AI
                </span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                className="text-sm sm:text-base md:text-lg font-medium tracking-wide"
                style={{
                  color: 'rgba(192,132,252,0.7)',
                  textShadow: '0 0 20px rgba(168,85,247,0.2)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Turn Ideas Into Influence
              </motion.p>

              {/* Subtle divider line */}
              <motion.div
                style={{
                  width: '60px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)',
                  borderRadius: '1px',
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={phase >= 3 ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
              />
            </motion.div>

            {/* ── Ambient Particles (Phase 4) ────────────────── */}
            {phase >= 4 && (
              <motion.div
                className="absolute inset-[-100px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {ambientParticles.map((p) => (
                  <AmbientParticle key={p.id} index={p.id} />
                ))}
              </motion.div>
            )}
          </div>

          {/* ── Vignette Overlay ──────────────────────────────── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          {/* ── Optional: Cinematic Swoosh Sound ─────────────── */}
          {/* 
            To add cinematic audio, uncomment below and place a 
            swoosh.mp3 file in /public/audio/:
            
            {phase === 2 && (
              <audio autoPlay>
                <source src="/audio/swoosh.mp3" type="audio/mpeg" />
              </audio>
            )}
          */}
        </motion.div>
      ) : (
        /* Fade-out complete — render nothing, app takes over */
        null
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
