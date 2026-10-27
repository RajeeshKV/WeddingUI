import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { OrbitalRings } from '../background/OrbitalRings.jsx';
import { FloatingPetals } from '../background/FloatingPetals.jsx';
import { IntroShell } from './IntroShell.jsx';

/* spring config helpers */
const soft   = { type: 'spring', stiffness: 80,  damping: 18 };
const snappy = { type: 'spring', stiffness: 200, damping: 22 };

export function EternalBloomIntro({ onOpen }) {
  const [sealed,  setSealed]  = useState(true);
  const [opening, setOpening] = useState(false);

  const handleEnvelope = () => {
    if (sealed && !opening) {
      setSealed(false);
      setOpening(true);
      setTimeout(onOpen, 1100);
    }
  };

  return (
    <IntroShell
      onOpen={onOpen}
      exitVariants={{
        initial: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit:    { opacity: 0, scale: 1.06, filter: 'blur(6px)',
                   transition: { duration: 0.95, ease: [0.4, 0, 0.2, 1] } },
      }}
    >
      {/* ── Background ─────────────────────────── */}
      <motion.div
        style={{ position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 38%, #FDF0F8 0%, #EDD5E5 42%, #C4A0BA 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* Grain */}
      <div style={{ position:'absolute',inset:0,pointerEvents:'none',
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.06'/%3E%3C/svg%3E")`,
        opacity:0.22 }} />

      {/* ── Orbital rings ─────────────────────── */}
      <motion.div
        style={{ position:'absolute',inset:0 }}
        initial={{ opacity:0, scale:0.7 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ delay:0.2, duration:1.4, ...soft }}
      >
        <OrbitalRings rings={3} color="rgba(180,130,165,0.32)" dotColor="#C4A6B2" />
      </motion.div>

      {/* ── Falling petals ─────────────────────── */}
      <FloatingPetals count={18} color="#C4A6B2" />

      {/* ── Corner blossoms (SVG) ──────────────── */}
      {['tl','tr','bl','br'].map((pos, pi) => {
        const s = { tl:{top:0,left:0}, tr:{top:0,right:0,transform:'scaleX(-1)'},
                    bl:{bottom:0,left:0,transform:'scaleY(-1)'},
                    br:{bottom:0,right:0,transform:'scale(-1,-1)'} }[pos];
        return (
          <motion.svg key={pos} aria-hidden="true" width="160" height="160" viewBox="0 0 160 160"
            style={{ position:'absolute', ...s, pointerEvents:'none', zIndex:0, opacity:0.18 }}
            initial={{ opacity:0, scale:0.6 }}
            animate={{ opacity:0.18, scale:1 }}
            transition={{ delay: 0.1 + pi * 0.12, duration:1.2, ...soft }}
          >
            <circle cx="40" cy="40" r="55" fill="#8B6E7F"/>
            <circle cx="20" cy="65" r="35" fill="#C4A6B2"/>
            <circle cx="75" cy="18" r="25" fill="#8B6E7F"/>
          </motion.svg>
        );
      })}

      {/* ── Names ─────────────────────────────── */}
      <motion.div
        style={{ textAlign:'center', zIndex:2, position:'relative', marginBottom:28 }}
        initial="hidden"
        animate="visible"
        variants={{ visible:{ transition:{ staggerChildren:0.13, delayChildren:0.4 } } }}
      >
        {[
          { text:'TWO HEARTS. ONE BEAUTIFUL JOURNEY.', style:{ fontSize:9, fontWeight:600, letterSpacing:'0.26em', color:'#8B6E7F', fontFamily:"'Jost',sans-serif" } },
          { text:'title' },
          { text:"YOU'RE INVITED", style:{ fontSize:9, letterSpacing:'0.28em', color:'#7A5F6C', fontFamily:"'Jost',sans-serif", marginTop:6 } },
        ].map((item, i) =>
          item.text === 'title' ? (
            <motion.h1
              key="title"
              style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(46px,8vw,82px)',
                fontWeight:600, letterSpacing:'0.03em', margin:'16px 0 6px', color:'#4A2D3E', lineHeight:1.05 }}
              variants={{ hidden:{ opacity:0, y:28, filter:'blur(10px)' }, visible:{ opacity:1, y:0, filter:'blur(0px)' } }}
              transition={{ duration:0.9, ease:[0.2,0.8,0.2,1] }}
            >
              Aarav <em style={{ fontStyle:'italic', color:'#8B6E7F' }}>&amp;</em> Siya
            </motion.h1>
          ) : (
            <motion.span
              key={i}
              style={{ display:'block', ...item.style }}
              variants={{ hidden:{ opacity:0, y:14 }, visible:{ opacity:1, y:0 } }}
              transition={{ duration:0.7 }}
            >
              {item.text}
            </motion.span>
          )
        )}
      </motion.div>

      {/* ── Envelope ──────────────────────────── */}
      <motion.button
        initial={{ opacity:0, y:36, scale:0.92 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ delay:0.85, duration:0.95, ...soft }}
        whileHover={ sealed ? { y:-7, boxShadow:'0 44px 100px rgba(90,50,70,0.24)' } : {} }
        whileTap={ sealed ? { scale:0.97 } : {} }
        onClick={handleEnvelope}
        aria-label="Open wedding invitation"
        style={{ position:'relative', zIndex:2,
          width:'min(420px,88vw)', height:240,
          background:'linear-gradient(145deg,#FEF5F0,#F0DCCF)',
          border:'1px solid #DFC0B0', borderRadius:4, cursor:'pointer',
          overflow:'hidden',
          boxShadow:'0 28px 70px rgba(80,45,55,0.18),inset 0 0 32px rgba(255,245,238,0.8)',
          display:'flex', alignItems:'center', justifyContent:'center' }}
      >
        {/* V-lines */}
        <div style={{ position:'absolute',inset:0,pointerEvents:'none',
          background:'linear-gradient(32deg,transparent 49.4%,#D8B8A5 50%,transparent 50.6%),linear-gradient(-32deg,transparent 49.4%,#D8B8A5 50%,transparent 50.6%)',
          opacity:0.55 }} />

        {/* Flap */}
        <motion.div
          style={{ position:'absolute',top:0,left:0,right:0,height:'55%',
            background:'linear-gradient(150deg,#F9E8D8,#E8C8B0)',
            clipPath:'polygon(0 0,100% 0,50% 100%)',
            borderBottom:'1px solid #D4B8A2', transformOrigin:'top center', zIndex:2 }}
          animate={ opening ? { rotateX:-175, opacity:0 } : { rotateX:0, opacity:1 } }
          transition={{ duration:0.7, ease:[0.4,0,0.2,1] }}
        />

        {/* Wax seal */}
        <motion.div
          style={{ position:'relative',zIndex:3,
            width:70,height:70,borderRadius:'50%',
            background:'radial-gradient(circle at 32% 28%,#C9A0BA,#8B4A6E 60%,#5C2D4A)',
            border:'3px double #C4A6B2',
            display:'flex',alignItems:'center',justifyContent:'center',
            color:'#F8E8F0',
            boxShadow:'0 6px 20px rgba(80,30,60,0.32)',
            fontFamily:'var(--font-serif)',fontSize:17,fontWeight:600,gap:2 }}
          animate={ !sealed ? { rotate:-15, scale:0.82, opacity:0.55 } : { rotate:0, scale:1, opacity:1 } }
          transition={{ duration:0.45, ease:'easeOut' }}
        >
          A<span style={{ fontSize:11,color:'#F0D0E0' }}>&amp;</span>S
        </motion.div>

        <span style={{ position:'absolute',bottom:42,zIndex:3,
          fontSize:7,letterSpacing:'0.2em',color:'#8A5E72' }}>
          SEALED WITH LOVE
        </span>

        <div style={{ position:'absolute',bottom:0,left:0,right:0,
          padding:'12px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',
          color:'#8A6272',fontSize:8,letterSpacing:'0.13em',
          borderTop:'1px solid rgba(215,185,175,0.4)' }}>
          <span>17 · 02 · 2027</span>
          <span style={{ display:'flex',alignItems:'center',gap:6 }}>
            OPEN INVITATION <ArrowDown size={13}/>
          </span>
        </div>
      </motion.button>

      {/* ── Footer pulse ──────────────────────── */}
      <motion.p
        style={{ position:'relative',zIndex:2,marginTop:26,fontSize:8,
          letterSpacing:'0.24em',color:'#8B6E7F',fontFamily:"'Jost',sans-serif" }}
        animate={{ opacity:[0.35,0.85,0.35] }}
        transition={{ repeat:Infinity, duration:2.8, ease:'easeInOut' }}
      >
        A LITTLE SOMETHING MADE WITH LOVE
      </motion.p>
    </IntroShell>
  );
}

export default EternalBloomIntro;
