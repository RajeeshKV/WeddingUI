import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WaveBackground } from '../background/WaveBackground.jsx';
import { IntroShell } from './IntroShell.jsx';

const soft = { type:'spring', stiffness:80, damping:17 };

export function OceanSerenadeIntro({ onOpen }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <IntroShell onOpen={onOpen} exitVariants={{
      initial:{ opacity:1, clipPath:'inset(0 0 0% 0)' },
      exit:{ opacity:0, clipPath:'inset(0 0 100% 0)', transition:{ duration:1.05, ease:[0.7,0,0.3,1] } },
    }}>
      <WaveBackground colorA="#2A7A8C" colorB="#7ABCB8" colorC="#EFF7F7" />

      {/* Shimmer line */}
      <div style={{ position:'absolute',bottom:'17%',left:0,right:0,height:'2px',
        background:'linear-gradient(to right,transparent 0%,rgba(255,255,255,0.55) 30%,rgba(255,255,255,0.85) 50%,rgba(255,255,255,0.55) 70%,transparent 100%)',
        animation:'reflectionShimmer 3s ease-in-out infinite',pointerEvents:'none',zIndex:2 }}/>

      {/* Names */}
      <motion.div
        style={{ textAlign:'center',zIndex:3,position:'relative',marginBottom:34 }}
        initial="hidden" animate="visible"
        variants={{ visible:{ transition:{ staggerChildren:0.14, delayChildren:0.35 } } }}
      >
        <motion.span
          style={{ display:'block',fontSize:9,letterSpacing:'0.28em',
            color:'rgba(224,244,248,0.82)',marginBottom:14,
            fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0, y:12 }, visible:{ opacity:1, y:0 } }}
          transition={{ duration:0.8 }}
        >
          WHERE THE TIDE MEETS FOREVER
        </motion.span>
        <motion.h1
          style={{ fontFamily:'var(--font-serif)',fontSize:'clamp(48px,8vw,84px)',
            fontWeight:600,letterSpacing:'0.04em',color:'#F0F8FF',margin:0,lineHeight:1.0,
            textShadow:'0 2px 24px rgba(10,60,80,0.45)' }}
          variants={{ hidden:{ opacity:0, y:32, filter:'blur(12px)' }, visible:{ opacity:1, y:0, filter:'blur(0px)' } }}
          transition={{ duration:1.1, ease:[0.2,0.8,0.2,1] }}
        >
          Aarav <em style={{ fontStyle:'italic',color:'#7ABCB8' }}>&amp;</em> Siya
        </motion.h1>
        <motion.div
          style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginTop:16 }}
          variants={{ hidden:{ opacity:0, scaleX:0 }, visible:{ opacity:1, scaleX:1 } }}
          transition={{ duration:0.8, ease:[0.4,0,0.2,1] }}
        >
          <div style={{ width:50,height:1,background:'linear-gradient(to right,transparent,rgba(122,188,184,0.65))' }}/>
          <div style={{ width:5,height:5,borderRadius:'50%',background:'#D4C4A8' }}/>
          <div style={{ width:50,height:1,background:'linear-gradient(to left,transparent,rgba(122,188,184,0.65))' }}/>
        </motion.div>
      </motion.div>

      {/* Invitation panel — rises from waves */}
      <motion.button
        initial={{ opacity:0, y:70 }}
        animate={ phase>=2 ? { opacity:1, y:0 } : {} }
        transition={{ duration:1.1, ...soft }}
        whileHover={{ y:-6, boxShadow:'0 32px 65px rgba(10,50,70,0.32)' }}
        whileTap={{ scale:0.98 }}
        onClick={onOpen}
        aria-label="Open invitation"
        style={{ position:'relative',zIndex:3,width:'min(360px,88vw)',
          background:'linear-gradient(145deg,rgba(240,248,252,0.93),rgba(200,230,235,0.9))',
          border:'1px solid rgba(122,188,184,0.42)',borderRadius:4,
          padding:'28px 32px',cursor:'pointer',backdropFilter:'blur(16px)',
          boxShadow:'0 22px 58px rgba(10,50,70,0.28),inset 0 0 0 1px rgba(255,255,255,0.32)',
          textAlign:'center' }}
      >
        <svg viewBox="0 0 300 20" style={{ width:'100%',marginBottom:16,opacity:0.62 }}>
          <path d="M 0,10 C 50,1 100,19 150,10 C 200,1 250,19 300,10" stroke="#2A7A8C" strokeWidth="1.1" fill="none"/>
        </svg>
        <p style={{ fontSize:8,letterSpacing:'0.28em',color:'#1A5A6A',margin:'0 0 8px',fontFamily:"'Jost',sans-serif",fontWeight:500 }}>
          17 · FEBRUARY · 2027
        </p>
        <p style={{ fontFamily:'var(--font-serif)',fontSize:'clamp(20px,3vw,25px)',fontWeight:600,color:'#0D3A4A',margin:'0 0 6px' }}>
          Aarav &amp; Siya
        </p>
        <p style={{ fontSize:9,color:'#2A7A8C',letterSpacing:'0.1em',margin:'0 0 14px',fontFamily:"'Jost',sans-serif" }}>
          Bangalore, India
        </p>
        <svg viewBox="0 0 300 20" style={{ width:'100%',opacity:0.62,transform:'scaleY(-1)' }}>
          <path d="M 0,10 C 50,1 100,19 150,10 C 200,1 250,19 300,10" stroke="#2A7A8C" strokeWidth="1.1" fill="none"/>
        </svg>
        <p style={{ fontSize:8,color:'#2A7A8C',marginTop:10,letterSpacing:'0.14em',fontFamily:"'Jost',sans-serif",fontWeight:500 }}>
          TAP TO OPEN
        </p>
      </motion.button>

      <style>{`
        @keyframes reflectionShimmer{
          0%,100%{opacity:0.4;transform:scaleX(0.85)}
          50%{opacity:1;transform:scaleX(1.08)}
        }
      `}</style>
    </IntroShell>
  );
}

export default OceanSerenadeIntro;
