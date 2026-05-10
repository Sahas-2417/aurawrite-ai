import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { notify } from '../toastConfig';
import { cn } from '../utils';
import logoImg from '../assets/logo.png';

// ─── Neural Particle Canvas ────────────────────────────────────────────
const NeuralCanvas = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initParticles = useCallback((width, height) => {
    const count = Math.min(Math.floor((width * height) / 7000), 140);
    const particles = [];
    const cx = width * 0.5;
    const cy = height * 0.5;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * Math.max(width, height) * 0.45;
      const isBright = Math.random() < 0.15; // 15% of nodes are "active" (brighter)
      particles.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        tx: cx + (Math.random() - 0.5) * width * 0.55,
        ty: cy + (Math.random() - 0.5) * height * 0.55,
        vx: 0,
        vy: 0,
        size: isBright ? 1.8 + Math.random() * 1.2 : 1 + Math.random() * 1.2,
        opacity: isBright ? 0.5 + Math.random() * 0.4 : 0.15 + Math.random() * 0.3,
        isBright,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.5 + Math.random() * 1.5,
        driftAngle: Math.random() * Math.PI * 2,
        driftSpeed: 0.1 + Math.random() * 0.25,
        driftRadius: 8 + Math.random() * 25,
        phase: Math.random() * Math.PI * 2,
        hue: 250 + Math.random() * 30,
        saturation: 60 + Math.random() * 30,
        lightness: isBright ? 70 + Math.random() * 15 : 55 + Math.random() * 20,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let startTime = Date.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      particlesRef.current = initParticles(rect.width, rect.height);
      startTime = Date.now();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const elapsed = (Date.now() - startTime) / 1000;
      const convergence = Math.min(elapsed / 4, 1);
      const eased = 1 - Math.pow(1 - convergence, 3);

      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;

      // Update positions
      for (const p of particles) {
        const drift = Math.sin(elapsed * p.driftSpeed + p.phase) * p.driftRadius;
        const driftX = Math.cos(p.driftAngle) * drift;
        const driftY = Math.sin(p.driftAngle) * drift;
        const targetX = p.tx + driftX;
        const targetY = p.ty + driftY;

        p.x += (targetX - p.x) * (0.008 + eased * 0.015);
        p.y += (targetY - p.y) * (0.008 + eased * 0.015);

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const mdx = p.x - mx;
        const mdy = p.y - my;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 120 && mDist > 0) {
          const force = (120 - mDist) / 120 * 1.2;
          p.x += (mdx / mDist) * force;
          p.y += (mdy / mDist) * force;
        }
      }

      // Draw connections
      const connectionDist = 85 + eased * 45;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const proximity = 1 - dist / connectionDist;
            const alpha = proximity * 0.15 * eased;
            // Brighter connections between active nodes
            const bothBright = particles[i].isBright && particles[j].isBright;
            const lineAlpha = bothBright ? alpha * 2.5 : alpha;
            const lineLightness = bothBright ? 75 : 65;

            ctx.strokeStyle = `hsla(265, 70%, ${lineLightness}%, ${lineAlpha})`;
            ctx.lineWidth = bothBright ? 0.8 : 0.4;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();

            // Traveling pulse along some bright connections
            if (bothBright && proximity > 0.5 && eased > 0.5) {
              const pulseT = (elapsed * 0.4 + i * 0.1) % 1;
              const px = particles[i].x + (particles[j].x - particles[i].x) * pulseT;
              const py = particles[i].y + (particles[j].y - particles[i].y) * pulseT;
              const pulseAlpha = Math.sin(pulseT * Math.PI) * 0.5 * eased;
              
              const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, 6);
              pulseGrad.addColorStop(0, `hsla(270, 80%, 80%, ${pulseAlpha})`);
              pulseGrad.addColorStop(1, `hsla(270, 80%, 80%, 0)`);
              ctx.fillStyle = pulseGrad;
              ctx.beginPath();
              ctx.arc(px, py, 6, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const fadeIn = Math.min(elapsed / 1.5, 1);
        // Pulsing for bright nodes
        const pulse = p.isBright 
          ? 0.7 + Math.sin(elapsed * p.pulseSpeed + p.pulsePhase) * 0.3 
          : 1;
        const alpha = p.opacity * fadeIn * pulse;
        const glowRadius = p.isBright ? p.size * 6 : p.size * 3.5;

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${alpha * 0.7})`);
        gradient.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${Math.min(p.lightness + 20, 95)}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
};

// ─── Auth Screen ───────────────────────────────────────────────────────
const AuthScreen = ({ isDarkMode }) => {
  const { signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      notify.error('Authentication Failed', 'Please try again or use another account.');
      setIsSigningIn(false);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.14, delayChildren: 0.3 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#050507] font-sans overflow-hidden selection:bg-purple-500/30">
      
      {/* ── Left Side: Neural Universe (Hidden on Mobile) ── */}
      <div className="hidden lg:block lg:w-[60%] relative overflow-hidden">
        
        {/* Deep ambient gradients — richer atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-[15%] right-[15%] w-[40%] h-[40%] bg-indigo-600/8 rounded-full blur-[160px]" />
          <div className="absolute top-[10%] right-[35%] w-[25%] h-[25%] bg-blue-600/5 rounded-full blur-[120px]" />
          {/* Subtle warm accent */}
          <div className="absolute bottom-[40%] left-[10%] w-[15%] h-[15%] bg-violet-500/4 rounded-full blur-[80px]" />
        </div>

        {/* Noise texture — very subtle grain */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }}
        />

        {/* Particle Canvas */}
        <NeuralCanvas />

        {/* Center convergence bloom */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.8, 0.6], scale: [0.6, 1.1, 1] }}
          transition={{ duration: 5, delay: 1.5, ease: "easeOut" }}
        >
          <div className="w-64 h-64 rounded-full bg-purple-500/[0.06] blur-[100px]" />
        </motion.div>

        {/* Vignette overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(5,5,7,0.7) 100%)' }}
        />

        {/* Subtle brand text at bottom */}
        <motion.div 
          className="absolute bottom-10 left-0 right-0 text-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 3.5 }}
        >
          <p className="text-white/[0.07] text-[10px] font-medium tracking-[0.35em] uppercase">
            Intelligence organizing chaos into influence
          </p>
        </motion.div>

        {/* Right border — ultra-soft glow divider */}
        <div className="absolute top-0 right-0 bottom-0 w-[2px] pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 5%, rgba(139,92,246,0.06) 30%, rgba(139,92,246,0.08) 50%, rgba(139,92,246,0.06) 70%, transparent 95%)' }} />
      </div>

      {/* ── Right Side: Authentication Panel ── */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center relative z-20 px-6 py-16 lg:px-16">
        
        {/* Right side ambient atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[30%] bg-purple-600/[0.03] rounded-full blur-[120px]" />
          {/* Mobile ambient */}
          <div className="absolute top-1/3 left-1/3 w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[100px] lg:hidden" />
        </div>

        {/* Noise texture for right side */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }}
        />

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[360px] relative z-10"
        >
          {/* Logo */}
          <motion.div variants={fadeUp} className="flex justify-center mb-14">
            <div className="relative">
              <motion.div 
                className="absolute -inset-4 bg-purple-500/8 rounded-2xl blur-xl"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative w-12 h-12 bg-white/[0.04] rounded-[12px] p-0.5 border border-white/[0.08]">
                <img src={logoImg} alt="AuraWrite" className="w-full h-full object-cover rounded-[10px]" />
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h1 className="text-[26px] sm:text-[30px] font-semibold text-white tracking-[-0.02em] leading-[1.25] mb-4">
              Turn raw ideas into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                influence.
              </span>
            </h1>
            <p className="text-[14px] text-white/40 font-normal leading-[1.7] max-w-[300px] mx-auto">
              Craft high-converting LinkedIn content powered by AI.
            </p>
          </motion.div>

          {/* Google Sign-In */}
          <motion.div variants={fadeUp} className="w-full relative group">
            {/* Hover glow */}
            <div className="absolute -inset-1 bg-white/[0.04] rounded-[14px] blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className={cn(
                "relative w-full flex items-center justify-center gap-3 px-6 py-[15px] rounded-xl font-medium text-[14px] transition-all duration-400 overflow-hidden",
                isSigningIn 
                  ? "bg-white/[0.03] text-white/30 cursor-not-allowed border border-white/[0.04]" 
                  : "bg-white text-[#1a1a1a] hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_12px_40px_rgba(0,0,0,0.12)] active:scale-[0.98] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.1)] border border-white/80"
              )}
            >
              {/* Shimmer sweep on hover */}
              {!isSigningIn && (
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.03] to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              )}
              
              {isSigningIn ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
                  <span className="text-white/40">Authenticating...</span>
                </div>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </motion.div>

          {/* Trust line */}
          <motion.div variants={fadeUp} className="mt-10 flex justify-center items-center gap-1.5">
            <Shield className="w-3 h-3 text-white/15" />
            <span className="text-[11px] text-white/20 font-medium tracking-wide">
              Secure authentication by Google
            </span>
          </motion.div>

          {/* Terms */}
          <motion.div variants={fadeUp} className="mt-5 text-center">
            <p className="text-[11px] text-white/10 leading-[1.6]">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
};

export default AuthScreen;
