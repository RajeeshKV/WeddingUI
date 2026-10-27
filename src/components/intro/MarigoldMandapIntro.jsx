import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FloatingPetals } from '../background/FloatingPetals.jsx';
import { IntroShell } from './IntroShell.jsx';

const soft = { type:'spring', stiffness:90, damping:18 };

export function MarigoldMandapIntro({ onOpen }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <IntroShell onOpen={onOpen} exitVariants={{
      initial:{ opacity:1, y:0 },
      exit:{ opacity:0, y:-40, transition:{ duration:0.9, ease:[0.4,0,0.2,1] } },
    }}>
      {/* Warm saffron */}
      <motion.div
        style={{ position:'absolute',inset:0,
          background:'radial-gradient(ellipse at 50% 28%,#FFF3D0 0%,#F5C842 35%,#E07A30 72%,#C8401A 100%)' }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }}
      />

      <FloatingPetals count={24} color="#D4A843" />
      <FloatingPetals count={10} color="#E07A30" />

      {/* SVG Arch */}
      <svg aria-hidden="true" viewBox="0 0 800 600"
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,overflow:'visible' }}>
        <defs>
          <style>{`
            .arch-draw{stroke-dasharray:1400;stroke-dashoffset:1400;animation:archReveal 2s 0.1s ease-out forwards}
            .arch-draw2{stroke-dasharray:1400;stroke-dashoffset:1400;animation:archReveal 1.8s 0.4s ease-out forwards}
            .arch-draw3{stroke-dasharray:600;stroke-dashoffset:600;animation:archReveal 1.4s 0.8s ease-out forwards}
            .dot-pop{opacity:0;animation:dotPop 0.4s ease-out forwards}
            @keyframes archReveal{to{stroke-dashoffset:0}}
            @keyframes dotPop{to{opacity:0.65}}
            @media(prefers-reduced-motion:reduce){.arch-draw,.arch-draw2,.arch-draw3{animation:none;stroke-dashoffset:0}.dot-pop{animation:none;opacity:0.65}}
          `}</style>
        </defs>
        {/* Left pillar */}
        <path className="arch-draw" d="M 55,600 L 55,210 C 55,130 130,88 210,88 C 290,88 380,145 400,175"
          stroke="#D4A843" strokeWidth="3" fill="none" opacity="0.88"/>
        {/* Right pillar */}
        <path className="arch-draw2" d="M 745,600 L 745,210 C 745,130 670,88 590,88 C 510,88 420,145 400,175"
          stroke="#D4A843" strokeWidth="3" fill="none" opacity="0.88"/>
        {/* Crown arch */}
        <path className="arch-draw3" d="M 210,88 C 270,42 340,18 400,18 C 460,18 530,42 590,88"
          stroke="#E07A30" strokeWidth="2.5" fill="none" opacity="0.72"/>
        {/* Garland dashes */}
        {[0,1,2].map(i=>(
          <path key={i} className="arch-draw"
            d={`M ${140+i*80},${108+i*8} C ${190+i*70},${138+i*6} ${230+i*50},${128+i*8} ${278+i*40},${112+i*6}`}
            stroke="#E8C840" strokeWidth="1.5" fill="none" opacity="0.5" strokeDasharray="4,3"
            style={{ animationDelay:`${0.9+i*0.2}s` }}/>
        ))}
        {/* Rangoli circles */}
        <circle className="arch-draw3" cx="400" cy="320" r="134" stroke="#D4A843" strokeWidth="1.2" fill="none" opacity="0.5"
          style={{ animationDelay:'1.2s',strokeDasharray:860 }}/>
        <circle className="arch-draw3" cx="400" cy="320" r="112" stroke="#CC4B2C" strokeWidth="0.8" fill="none" opacity="0.38"
          style={{ animationDelay:'1.45s',strokeDasharray:710 }}/>
        {/* Rangoli petal dots */}
        {Array.from({length:12}).map((_,i)=>{
          const a=(i/12)*Math.PI*2;
          return <circle key={i} className="dot-pop" cx={400+Math.cos(a)*134} cy={320+Math.sin(a)*134}
            r="3.5" fill="#D4A843" style={{ animationDelay:`${1.5+i*0.05}s` }}/>;
        })}
      </svg>

      {/* Names */}
      <motion.div
        style={{ textAlign:'center',zIndex:2,position:'relative',marginBottom:26 }}
        initial="hidden" animate="visible"
        variants={{ visible:{ transition:{ staggerChildren:0.13, delayChildren:0.5 } } }}
      >
        <motion.span
          style={{ display:'block',fontSize:9,letterSpacing:'0.26em',color:'#8B3A1A',
            marginBottom:12,fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0, y:12 }, visible:{ opacity:1, y:0 } }}
          transition={{ duration:0.7 }}
        >
          WITH BLESSINGS AND JOY
        </motion.span>
        <motion.h1
          style={{ fontFamily:'var(--font-serif)',fontSize:'clamp(44px,7.5vw,80px)',
            fontWeight:600,color:'#4A1A08',margin:0,lineHeight:1.0,letterSpacing:'0.04em' }}
          variants={{ hidden:{ opacity:0, y:28, filter:'blur(10px)' }, visible:{ opacity:1, y:0, filter:'blur(0px)' } }}
          transition={{ duration:1.0, ease:[0.2,0.8,0.2,1] }}
        >
          Aarav <em style={{ fontStyle:'italic',color:'#CC4B2C' }}>&amp;</em> Siya
        </motion.h1>
        <motion.p
          style={{ fontSize:9,letterSpacing:'0.22em',color:'#8B3A1A',marginTop:10,
            fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0 }, visible:{ opacity:1 } }}
          transition={{ duration:0.7 }}
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>
      </motion.div>

      {/* Invitation card */}
      <motion.button
        initial={{ opacity:0, scale:0.84, y:36 }}
        animate={ phase>=2 ? { opacity:1, scale:1, y:0 } : {} }
        transition={{ duration:0.9, ...soft }}
        whileHover={{ y:-6 }}
        whileTap={{ scale:0.97 }}
        onClick={onOpen}
        aria-label="Open invitation"
        style={{ position:'relative',zIndex:3,width:'min(360px,88vw)',
          background:'linear-gradient(145deg,#FFFBF0,#F5E8C0)',
          border:'2px solid rgba(212,168,67,0.65)',borderRadius:4,
          padding:'26px 28px 22px',cursor:'pointer',
          boxShadow:'0 24px 60px rgba(80,30,10,0.22)',textAlign:'center' }}
      >
        <svg viewBox="0 0 300 20" style={{ width:'100%',marginBottom:14,opacity:0.75 }}>
          <path d="M 0,10 C 30,2 60,18 90,10 C 120,2 150,18 180,10 C 210,2 240,18 270,10 C 285,5 295,10 300,10"
            stroke="#D4A843" strokeWidth="1.3" fill="none"/>
          <circle cx="150" cy="10" r="3" fill="#CC4B2C"/>
        </svg>
        <p style={{ fontSize:8,letterSpacing:'0.28em',color:'#8B4A2A',margin:'0 0 8px',fontFamily:"'Jost',sans-serif",fontWeight:500 }}>
          CORDIALLY INVITES YOU
        </p>
        <p style={{ fontFamily:'var(--font-serif)',fontSize:'clamp(18px,3vw,24px)',fontWeight:600,color:'#3A1A08',margin:'0 0 5px',lineHeight:1.4 }}>
          Aarav &amp; Siya's Wedding
        </p>
        <p style={{ fontSize:8,color:'#7A4A2A',letterSpacing:'0.15em',margin:'0 0 14px',fontFamily:"'Jost',sans-serif" }}>
          17 · 02 · 2027 · BANGALORE
        </p>
        <svg viewBox="0 0 300 20" style={{ width:'100%',marginTop:4,opacity:0.75,transform:'scaleY(-1)' }}>
          <path d="M 0,10 C 30,2 60,18 90,10 C 120,2 150,18 180,10 C 210,2 240,18 270,10 C 285,5 295,10 300,10"
            stroke="#D4A843" strokeWidth="1.3" fill="none"/>
          <circle cx="150" cy="10" r="3" fill="#CC4B2C"/>
        </svg>
      </motion.button>
    </IntroShell>
  );
}

export default MarigoldMandapIntro;
