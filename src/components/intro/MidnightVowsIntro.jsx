import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleField } from '../background/ParticleField.jsx';
import { IntroShell } from './IntroShell.jsx';

const soft = { type:'spring', stiffness:70, damping:16 };

export function MidnightVowsIntro({ onOpen }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1000);
    const t2 = setTimeout(() => setPhase(2), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <IntroShell onOpen={onOpen} exitVariants={{
      initial:{ opacity:1 },
      exit:{ opacity:0, transition:{ duration:1.2, ease:[0.4,0,0.2,1] } },
    }}>
      {/* Deep dark bg */}
      <motion.div style={{ position:'absolute',inset:0,
        background:'radial-gradient(ellipse at 50% 15%,#1A0A0A 0%,#0D0505 60%,#070202 100%)' }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }}
      />

      {/* Gold particles */}
      <ParticleField count={55} color="#C9A84C" mode="gold-converge" />

      {/* Wide light beam */}
      <motion.div aria-hidden="true"
        initial={{ scaleY:0, opacity:0 }}
        animate={{ scaleY:1, opacity:1 }}
        transition={{ delay:0.15, duration:1.6, ease:[0.2,0.6,0.2,1] }}
        style={{ position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',
          transformOrigin:'top center',
          width:'clamp(220px,32vw,420px)',height:'100%',
          background:'linear-gradient(180deg,rgba(201,168,76,0.16) 0%,rgba(201,168,76,0.04) 55%,transparent 100%)',
          pointerEvents:'none',zIndex:1 }}
      />
      {/* Narrow centre beam */}
      <motion.div aria-hidden="true"
        initial={{ scaleY:0, opacity:0 }}
        animate={{ scaleY:1, opacity:0.75 }}
        transition={{ delay:0.3, duration:1.4 }}
        style={{ position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',
          transformOrigin:'top center',width:2,height:'58%',
          background:'linear-gradient(180deg,rgba(201,168,76,0.85),transparent)',
          pointerEvents:'none',zIndex:2 }}
      />

      {/* Monogram halo — appears after beam */}
      <motion.div
        initial={{ opacity:0, scale:0.5, filter:'blur(14px)' }}
        animate={ phase>=1 ? { opacity:1, scale:1, filter:'blur(0px)' } : {} }
        transition={{ duration:1.2, ...soft }}
        style={{ position:'absolute',top:'18%',zIndex:3,textAlign:'center' }}
      >
        <div style={{ width:96,height:96,borderRadius:'50%',
          border:'1px solid rgba(201,168,76,0.45)',
          display:'flex',alignItems:'center',justifyContent:'center',
          margin:'0 auto',
          boxShadow:'0 0 50px rgba(201,168,76,0.12)' }}>
          <span style={{ fontFamily:'var(--font-serif)',fontSize:28,fontWeight:600,color:'#C9A84C',letterSpacing:2 }}>
            A&amp;S
          </span>
        </div>
        <motion.div style={{ position:'absolute',inset:-14,borderRadius:'50%',
          border:'1px solid rgba(201,168,76,0.2)',
          animation:'orbitSpin 22s linear infinite' }}/>
        <motion.div style={{ position:'absolute',inset:-32,borderRadius:'50%',
          border:'1px dashed rgba(201,168,76,0.1)',
          animation:'orbitSpin 38s linear infinite reverse' }}/>
      </motion.div>

      {/* Names */}
      <motion.div
        style={{ textAlign:'center',zIndex:3,position:'relative',marginBottom:34 }}
        initial="hidden"
        animate={ phase>=1 ? 'visible' : 'hidden' }
        variants={{ visible:{ transition:{ staggerChildren:0.14, delayChildren:0.1 } } }}
      >
        <motion.span
          style={{ display:'block',fontSize:8,letterSpacing:'0.3em',color:'rgba(201,168,76,0.65)',
            marginBottom:18,fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0, y:14 }, visible:{ opacity:1, y:0 } }}
          transition={{ duration:0.8 }}
        >
          THE HONOUR OF YOUR PRESENCE
        </motion.span>
        <motion.h1
          style={{ fontFamily:'var(--font-serif)',fontSize:'clamp(48px,7.5vw,86px)',
            fontWeight:600,letterSpacing:'0.06em',color:'#F5E8D0',margin:0,lineHeight:1.0,
            textTransform:'uppercase' }}
          variants={{ hidden:{ opacity:0, y:32, filter:'blur(12px)' }, visible:{ opacity:1, y:0, filter:'blur(0px)' } }}
          transition={{ duration:1.0, ease:[0.2,0.8,0.2,1] }}
        >
          Aarav <em style={{ fontStyle:'italic',color:'#C9A84C',textTransform:'none' }}>&amp;</em> Siya
        </motion.h1>
        <motion.div
          style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:12,margin:'18px 0' }}
          variants={{ hidden:{ opacity:0, scaleX:0 }, visible:{ opacity:1, scaleX:1 } }}
          transition={{ duration:0.8, ease:[0.4,0,0.2,1] }}
        >
          <div style={{ width:64,height:1,background:'linear-gradient(to right,transparent,rgba(201,168,76,0.7))' }}/>
          <div style={{ width:5,height:5,borderRadius:'50%',background:'#C9A84C' }}/>
          <div style={{ width:64,height:1,background:'linear-gradient(to left,transparent,rgba(201,168,76,0.7))' }}/>
        </motion.div>
        <motion.p
          style={{ fontSize:9,letterSpacing:'0.26em',color:'rgba(245,232,208,0.55)',margin:0,
            fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0 }, visible:{ opacity:1 } }}
          transition={{ duration:0.7 }}
        >
          REQUEST YOUR COMPANY
        </motion.p>
      </motion.div>

      {/* Velvet card */}
      <motion.button
        initial={{ opacity:0, y:50, scale:0.9 }}
        animate={ phase>=2 ? { opacity:1, y:0, scale:1 } : {} }
        transition={{ duration:1.0, ...soft }}
        whileHover={{ y:-6, boxShadow:'0 36px 80px rgba(201,168,76,0.15)' }}
        whileTap={{ scale:0.97 }}
        onClick={onOpen}
        aria-label="Open invitation"
        style={{ position:'relative',zIndex:3,width:'min(380px,88vw)',
          background:'linear-gradient(145deg,#1E0E0E,#160808)',
          border:'1px solid rgba(201,168,76,0.3)',borderRadius:3,
          padding:'32px 36px',cursor:'pointer',textAlign:'center',
          boxShadow:'0 24px 64px rgba(0,0,0,0.6),inset 0 0 0 1px rgba(201,168,76,0.08)' }}
      >
        {/* Gold corner marks */}
        {[{top:10,left:10},{top:10,right:10},{bottom:10,left:10},{bottom:10,right:10}].map((pos,i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 16 16"
            style={{ position:'absolute',...pos,opacity:0.55 }}>
            <path d={i<2 ? 'M0,0 L7,0 M0,0 L0,7' : 'M0,16 L7,16 M0,16 L0,9'}
              stroke="#C9A84C" strokeWidth="0.9" fill="none"
              transform={i===1||i===3 ? 'scale(-1,1) translate(-16,0)' : ''}/>
          </svg>
        ))}
        <div style={{ width:54,height:54,borderRadius:'50%',
          background:'radial-gradient(circle at 30% 25%,#D4B85A,#8B6A1E 65%,#5C4010)',
          border:'2px solid rgba(201,168,76,0.5)',
          margin:'0 auto 18px',display:'flex',alignItems:'center',justifyContent:'center',
          fontFamily:'var(--font-serif)',fontSize:13,fontWeight:600,color:'#F5E8D0',
          boxShadow:'0 4px 16px rgba(201,168,76,0.2)' }}>
          A&amp;S
        </div>
        <p style={{ fontSize:8,letterSpacing:'0.28em',color:'rgba(201,168,76,0.65)',margin:'0 0 10px',
          fontFamily:"'Jost',sans-serif",fontWeight:500 }}>
          17 FEBRUARY 2027
        </p>
        <p style={{ fontSize:10,color:'rgba(245,232,208,0.5)',margin:0,letterSpacing:'0.06em' }}>
          Bangalore, India — Tap to open
        </p>
      </motion.button>

      <style>{`@keyframes orbitSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </IntroShell>
  );
}

export default MidnightVowsIntro;
