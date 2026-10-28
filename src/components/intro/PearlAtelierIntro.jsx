import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntroShell } from './IntroShell.jsx';

const soft = { type:'spring', stiffness:90, damping:20 };

/* Animated pearl orb canvas */
function PearlOrbs() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const orbs = Array.from({ length: 12 }, (_, i) => ({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      r: 40 + Math.random() * 90,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.03,
      opacity: 0.06 + Math.random() * 0.1,
    }));

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -10 || o.x > 110) o.vx *= -1;
        if (o.y < -10 || o.y > 110) o.vy *= -1;
        const px = (o.x / 100) * W;
        const py = (o.y / 100) * H;
        const g = ctx.createRadialGradient(px, py, 0, px, py, o.r);
        g.addColorStop(0, `rgba(200,195,188, ${o.opacity * 2})`);
        g.addColorStop(0.5, `rgba(180,170,160, ${o.opacity})`);
        g.addColorStop(1, `rgba(160,155,148, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, o.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return (
    <canvas ref={canvasRef} aria-hidden="true"
      style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0 }}/>
  );
}

export function PearlAtelierIntro({ onOpen }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <IntroShell onOpen={onOpen} exitVariants={{
      initial:{ clipPath:'inset(0% 0% 0% 0%)' },
      exit:{ clipPath:'inset(0% 0% 100% 0%)', transition:{ duration:1.0, ease:[0.7,0,0.3,1] } },
    }}>

      {/* ── Base: warm porcelain ── */}
      <div style={{ position:'absolute', inset:0,
        background:'linear-gradient(145deg, #F5F2EE 0%, #EDE8E0 40%, #E4DDD4 100%)' }}/>

      {/* ── Paper grain ── */}
      <div aria-hidden="true" style={{ position:'absolute',inset:0,pointerEvents:'none',
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)' opacity='0.055'/%3E%3C/svg%3E")`,
        opacity:0.7, zIndex:0 }}/>

      {/* ── Vignette ── */}
      <div aria-hidden="true" style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:1,
        background:'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(80,72,60,0.28) 100%)' }}/>

      {/* ── Animated pearl orb canvas ── */}
      <PearlOrbs />

      {/* ── SVG Grid geometry — full viewport ── */}
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1 }}>
        <defs>
          <style>{`
            .gl { stroke-dasharray: 200; stroke-dashoffset: 200; animation: glDraw 1.8s ease-out forwards; }
            @keyframes glDraw { to { stroke-dashoffset: 0; } }
            @media(prefers-reduced-motion:reduce) { .gl { animation:none; stroke-dashoffset:0; } }
          `}</style>
        </defs>
        {/* Corner bracket marks */}
        {/* Top-left */}
        <path className="gl" d="M 5,18 L 5,8 L 18,8" stroke="#8A8078" strokeWidth="0.18" fill="none" opacity="0.55"
          style={{ animationDelay:'0.1s' }}/>
        {/* Top-right */}
        <path className="gl" d="M 95,18 L 95,8 L 82,8" stroke="#8A8078" strokeWidth="0.18" fill="none" opacity="0.55"
          style={{ animationDelay:'0.2s' }}/>
        {/* Bottom-left */}
        <path className="gl" d="M 5,82 L 5,92 L 18,92" stroke="#8A8078" strokeWidth="0.18" fill="none" opacity="0.55"
          style={{ animationDelay:'0.3s' }}/>
        {/* Bottom-right */}
        <path className="gl" d="M 95,82 L 95,92 L 82,92" stroke="#8A8078" strokeWidth="0.18" fill="none" opacity="0.55"
          style={{ animationDelay:'0.4s' }}/>

        {/* Horizontal centre rules */}
        <line className="gl" x1="5" y1="50" x2="35" y2="50" stroke="#B0A898" strokeWidth="0.1" opacity="0.5"
          style={{ animationDelay:'0.5s' }}/>
        <line className="gl" x1="65" y1="50" x2="95" y2="50" stroke="#B0A898" strokeWidth="0.1" opacity="0.5"
          style={{ animationDelay:'0.55s' }}/>

        {/* Thin vertical side rules */}
        <line className="gl" x1="12" y1="25" x2="12" y2="75" stroke="#C0B8AE" strokeWidth="0.08" opacity="0.4"
          style={{ animationDelay:'0.6s' }}/>
        <line className="gl" x1="88" y1="25" x2="88" y2="75" stroke="#C0B8AE" strokeWidth="0.08" opacity="0.4"
          style={{ animationDelay:'0.65s' }}/>

        {/* Large decorative circle — editorial ring */}
        <circle className="gl" cx="50" cy="50" r="42" stroke="#A09890" strokeWidth="0.12" fill="none" opacity="0.3"
          style={{ animationDelay:'0.7s', strokeDasharray:265, strokeDashoffset:265 }}/>
        <circle className="gl" cx="50" cy="50" r="38" stroke="#A09890" strokeWidth="0.06" fill="none" opacity="0.18"
          style={{ animationDelay:'0.85s', strokeDasharray:240, strokeDashoffset:240 }}/>

        {/* Small tick marks on ring — 12 positions */}
        {Array.from({length:12}).map((_,i) => {
          const a = (i/12)*Math.PI*2 - Math.PI/2;
          const r1=41, r2=43;
          return <line key={i}
            x1={50+Math.cos(a)*r1} y1={50+Math.sin(a)*r1}
            x2={50+Math.cos(a)*r2} y2={50+Math.sin(a)*r2}
            stroke="#A09890" strokeWidth="0.15" opacity="0.4"
            style={{ animation:`glDraw 0.4s ${0.9+i*0.04}s ease-out forwards`,
              strokeDasharray:4, strokeDashoffset:4 }}/>;
        })}

        {/* Cross-hair centre dot */}
        <circle cx="50" cy="50" r="0.35" fill="#8A8078" opacity="0.4"
          style={{ animation:'glDraw 0.3s 1.1s ease-out forwards', strokeDasharray:4, strokeDashoffset:4 }}/>
      </svg>

      {/* ── Floating silver leaf silhouettes ── */}
      {[
        { cx:8,  cy:12, rotate:-30, scale:1.0, delay:0.6 },
        { cx:90, cy:16, rotate:45,  scale:0.8, delay:0.75 },
        { cx:6,  cy:82, rotate:120, scale:0.9, delay:0.9 },
        { cx:92, cy:80, rotate:200, scale:0.75,delay:1.0 },
        { cx:18, cy:55, rotate:-60, scale:0.6, delay:1.1 },
        { cx:83, cy:42, rotate:80,  scale:0.65,delay:1.15},
      ].map((l, i) => (
        <motion.svg key={i} aria-hidden="true"
          viewBox="0 0 40 60" width="48" height="72"
          style={{ position:'absolute', left:`${l.cx}%`, top:`${l.cy}%`,
            transform:`translate(-50%,-50%) rotate(${l.rotate}deg) scale(${l.scale})`,
            pointerEvents:'none', zIndex:1, opacity:0 }}
          animate={{ opacity: 0.14, y:[0,-6,0] }}
          transition={{ opacity:{ delay:l.delay, duration:0.8 },
            y:{ delay:l.delay, duration:5+i*0.7, repeat:Infinity, ease:'easeInOut' } }}
        >
          <path d="M20,2 C20,2 36,18 36,34 C36,46 29,56 20,58 C11,56 4,46 4,34 C4,18 20,2 20,2 Z"
            fill="none" stroke="#8A8078" strokeWidth="1.2" opacity="0.9"/>
          <line x1="20" y1="2" x2="20" y2="58" stroke="#8A8078" strokeWidth="0.5" opacity="0.6"/>
          {[12,22,34].map((y,j) => (
            <line key={j} x1={20-Math.sqrt(Math.max(0,256-(y-34)**2))*0.7} y1={y}
              x2={20+Math.sqrt(Math.max(0,256-(y-34)**2))*0.7} y2={y}
              stroke="#8A8078" strokeWidth="0.4" opacity="0.5"/>
          ))}
        </motion.svg>
      ))}

      {/* ── Top edition label ── */}
      <motion.div
        initial={{ opacity:0, y:-10 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.3, duration:0.9, ease:[0.2,0.8,0.2,1] }}
        style={{ position:'absolute', top:'8%', left:'50%', transform:'translateX(-50%)',
          fontSize:9, fontWeight:500, letterSpacing:'0.32em', color:'#8A8078',
          zIndex:3, whiteSpace:'nowrap', fontFamily:"'Jost',sans-serif", textTransform:'uppercase' }}
      >
        Personal Collection &nbsp;·&nbsp; 2027
      </motion.div>

      {/* ── Expanding reveal line top ── */}
      <motion.div
        initial={{ scaleX:0 }} animate={{ scaleX:1 }}
        transition={{ delay:0.5, duration:1.2, ease:[0.4,0,0.2,1] }}
        style={{ position:'absolute', top:'15%', left:'50%', transform:'translateX(-50%)',
          transformOrigin:'center', width:'min(520px,78vw)', height:1,
          background:'linear-gradient(to right,transparent,#9A9088 30%,#9A9088 70%,transparent)',
          zIndex:3 }}
      />

      {/* ── Main names ── */}
      <motion.div
        style={{ textAlign:'center', zIndex:3, position:'relative', marginBottom:40 }}
        initial="hidden" animate="visible"
        variants={{ visible:{ transition:{ staggerChildren:0.16, delayChildren:0.45 } } }}
      >
        {/* Issue number */}
        <motion.div
          variants={{ hidden:{ opacity:0, y:10 }, visible:{ opacity:1, y:0 } }}
          transition={{ duration:0.6 }}
          style={{ fontSize:9, letterSpacing:'0.2em', color:'#9A9088',
            marginBottom:20, fontFamily:"'Jost',sans-serif", fontWeight:400 }}
        >
          No. 01 &nbsp;—&nbsp; The Wedding Edition
        </motion.div>

        {/* Large headline */}
        <motion.h1
          variants={{ hidden:{ opacity:0, y:36, filter:'blur(12px)' }, visible:{ opacity:1, y:0, filter:'blur(0px)' } }}
          transition={{ duration:1.1, ease:[0.2,0.8,0.2,1] }}
          style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(56px,9.5vw,108px)',
            fontWeight:600, letterSpacing:'-0.04em', color:'#1A1714',
            margin:'0 0 10px', lineHeight:0.95 }}
        >
          Aarav <span className="couple-ampersand">&amp;</span> Siya
        </motion.h1>

        {/* Subtitle rule */}
        <motion.div
          variants={{ hidden:{ opacity:0, scaleX:0 }, visible:{ opacity:1, scaleX:1 } }}
          transition={{ duration:0.9, ease:[0.4,0,0.2,1] }}
          style={{ display:'flex', alignItems:'center', justifyContent:'center',
            gap:12, margin:'14px 0 12px', transformOrigin:'center' }}
        >
          <div style={{ flex:1, maxWidth:80, height:1, background:'linear-gradient(to right,transparent,#9A9088)' }}/>
          <div style={{ width:4, height:4, borderRadius:'50%', background:'#9A9088' }}/>
          <div style={{ flex:1, maxWidth:80, height:1, background:'linear-gradient(to left,transparent,#9A9088)' }}/>
        </motion.div>

        <motion.p
          variants={{ hidden:{ opacity:0, y:8 }, visible:{ opacity:1, y:0 } }}
          transition={{ duration:0.7 }}
          style={{ fontSize:10, letterSpacing:'0.3em', color:'#7A7268',
            fontFamily:"'Jost',sans-serif", fontWeight:500, margin:0 }}
        >
          WEDDING INVITATION &nbsp;·&nbsp; 17 · II · 2027
        </motion.p>
      </motion.div>

      {/* ── Invitation card ── */}
      <motion.button
        initial={{ opacity:0, y:32, rotateX:12, scale:0.95 }}
        animate={ phase>=1 ? { opacity:1, y:0, rotateX:0, scale:1 } : {} }
        transition={{ duration:1.0, ...soft }}
        whileHover={{ y:-7, rotateX:4,
          boxShadow:'0 44px 100px rgba(60,52,42,0.18), 0 8px 24px rgba(60,52,42,0.12)' }}
        whileTap={{ scale:0.98 }}
        onClick={onOpen}
        aria-label="Open invitation"
        style={{ position:'relative', zIndex:3, width:'min(400px,88vw)',
          background:'linear-gradient(145deg,#FFFFFF,#F8F4EE)',
          border:'1px solid #D8D0C8', borderRadius:3,
          padding:'36px 42px', cursor:'pointer',
          boxShadow:'0 2px 4px rgba(60,52,42,0.04), 0 20px 52px rgba(60,52,42,0.1)',
          perspective:1000, transformStyle:'preserve-3d',
          textAlign:'left', overflow:'hidden' }}
      >
        {/* Moving light sweep on card reveal */}
        <motion.div
          style={{ position:'absolute', top:0, left:'-85%', width:'50%', height:'100%',
            background:'linear-gradient(108deg,transparent 0%,rgba(255,255,255,0.78) 50%,transparent 100%)',
            pointerEvents:'none', zIndex:10 }}
          animate={ phase>=2 ? { left:'160%' } : { left:'-85%' } }
          transition={{ duration:1.1, delay:0.2, ease:'easeInOut' }}
        />

        {/* Card top ornament — engraved style */}
        <svg viewBox="0 0 320 28" style={{ width:'100%', marginBottom:20, opacity:0.55 }}>
          <path d="M 0,14 L 60,14 M 260,14 L 320,14" stroke="#9A9088" strokeWidth="0.8" fill="none"/>
          <path d="M 65,14 C 80,4 100,4 120,8 C 140,12 150,8 160,8 C 170,8 180,12 200,8 C 220,4 240,4 255,14"
            stroke="#9A9088" strokeWidth="0.8" fill="none"/>
          <circle cx="160" cy="8" r="2.5" fill="none" stroke="#9A9088" strokeWidth="0.7"/>
          <circle cx="160" cy="8" r="1" fill="#9A9088"/>
        </svg>

        <p style={{ fontSize:8, letterSpacing:'0.32em', color:'#9A9088',
          margin:'0 0 16px', fontFamily:"'Jost',sans-serif", fontWeight:500 }}>
          A WEDDING ANNOUNCEMENT
        </p>

        <p style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(22px,3.2vw,28px)',
          fontWeight:600, color:'#1A1714', margin:'0 0 4px', lineHeight:1.2 }}>
          Aarav <span className="couple-ampersand">&amp;</span> Siya
        </p>

        <p style={{ fontSize:12, color:'#6A6258', margin:'0 0 22px', lineHeight:1.9,
          fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
          invite you to witness their union<br />on the seventeenth of February
        </p>

        {/* Hairline divider with diamond */}
        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'0 0 16px' }}>
          <div style={{ flex:1, height:1, background:'#E0D8CE' }}/>
          <div style={{ width:5, height:5, transform:'rotate(45deg)', background:'#B0A898' }}/>
          <div style={{ flex:1, height:1, background:'#E0D8CE' }}/>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <p style={{ fontSize:8, letterSpacing:'0.18em', color:'#9A9088', margin:'0 0 2px',
              fontFamily:"'Jost',sans-serif", fontWeight:500 }}>
              BANGALORE, INDIA
            </p>
            <p style={{ fontSize:8, letterSpacing:'0.12em', color:'#B0A898', margin:0,
              fontFamily:"'Jost',sans-serif" }}>
              The Grand Pavilion
            </p>
          </div>
          {/* Embossed monogram circle */}
          <div style={{ width:44, height:44, borderRadius:'50%',
            border:'1.5px solid #C8C0B8',
            background:'linear-gradient(135deg,#F0ECE6,#E8E2DA)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'inset 0 1px 3px rgba(255,255,255,0.8), 0 2px 6px rgba(60,52,42,0.1)' }}>
            <span style={{ fontFamily:'var(--font-serif)', fontSize:14, fontWeight:600,
              color:'#6A6258', letterSpacing:'0.02em' }}>A<span className="couple-ampersand">&amp;</span>S</span>
          </div>
        </div>

        {/* Bottom ornament */}
        <svg viewBox="0 0 320 28" style={{ width:'100%', marginTop:18, opacity:0.55, transform:'scaleY(-1)' }}>
          <path d="M 0,14 L 60,14 M 260,14 L 320,14" stroke="#9A9088" strokeWidth="0.8" fill="none"/>
          <path d="M 65,14 C 80,4 100,4 120,8 C 140,12 150,8 160,8 C 170,8 180,12 200,8 C 220,4 240,4 255,14"
            stroke="#9A9088" strokeWidth="0.8" fill="none"/>
          <circle cx="160" cy="8" r="2.5" fill="none" stroke="#9A9088" strokeWidth="0.7"/>
          <circle cx="160" cy="8" r="1" fill="#9A9088"/>
        </svg>

        <p style={{ textAlign:'center', fontSize:8, letterSpacing:'0.18em', color:'#B0A898',
          margin:'10px 0 0', fontFamily:"'Jost',sans-serif" }}>
          Tap to open invitation
        </p>
      </motion.button>

      {/* ── Bottom rule ── */}
      <motion.div
        initial={{ scaleX:0 }} animate={{ scaleX:1 }}
        transition={{ delay:0.65, duration:1.2, ease:[0.4,0,0.2,1] }}
        style={{ position:'absolute', bottom:'15%', left:'50%', transform:'translateX(-50%)',
          transformOrigin:'center', width:'min(520px,78vw)', height:1,
          background:'linear-gradient(to right,transparent,#9A9088 30%,#9A9088 70%,transparent)',
          zIndex:3 }}
      />

      {/* ── Bottom edition note ── */}
      <motion.div
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.8, duration:0.8 }}
        style={{ position:'absolute', bottom:'8%', left:'50%', transform:'translateX(-50%)',
          fontSize:8, fontWeight:400, letterSpacing:'0.28em', color:'#9A9088',
          zIndex:3, whiteSpace:'nowrap', fontFamily:"'Jost',sans-serif", textTransform:'uppercase',
          display:'flex', alignItems:'center', gap:16 }}
      >
        <span style={{ width:28, height:1, background:'#C0B8AE', display:'inline-block' }}/>
        Aarav <span className="couple-ampersand">&amp;</span> Siya · February 2027
        <span style={{ width:28, height:1, background:'#C0B8AE', display:'inline-block' }}/>
      </motion.div>

    </IntroShell>
  );
}

export default PearlAtelierIntro;
