import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IntroShell } from './IntroShell.jsx';

const soft = { type:'spring', stiffness:75, damping:17 };

export function TuscanRomanceIntro({ onOpen }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <IntroShell onOpen={onOpen} exitVariants={{
      initial:{ opacity:1, scale:1 },
      exit:{ opacity:0, scale:1.08, transition:{ duration:1.1, ease:[0.4,0,0.2,1] } },
    }}>
      {/* Animated sky */}
      <motion.div
        style={{ position:'absolute',inset:0 }}
        initial={{ background:'linear-gradient(180deg,#8B4E20 0%,#5A2A10 100%)' }}
        animate={{ background:'linear-gradient(180deg,#F0C080 0%,#E89050 28%,#D4704A 54%,#A85030 100%)' }}
        transition={{ duration:2.5, ease:'easeOut' }}
      />

      {/* SVG landscape */}
      <svg aria-hidden="true" viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice"
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1 }}>
        <defs>
          <style>{`
            .hill1{stroke-dasharray:1800;stroke-dashoffset:1800;animation:hillDraw 2.2s 0.1s ease-out forwards}
            .hill2{stroke-dasharray:1800;stroke-dashoffset:1800;animation:hillDraw 2.0s 0.5s ease-out forwards}
            .hill3{stroke-dasharray:1800;stroke-dashoffset:1800;animation:hillDraw 1.8s 0.8s ease-out forwards}
            .tree-appear{opacity:0;transform-box:fill-box;transform-origin:bottom;animation:treeGrow 0.7s ease-out forwards}
            @keyframes hillDraw{to{stroke-dashoffset:0}}
            @keyframes treeGrow{from{opacity:0;transform:scaleY(0.2)}to{opacity:0.75;transform:scaleY(1)}}
            @media(prefers-reduced-motion:reduce){.hill1,.hill2,.hill3{animation:none;stroke-dashoffset:0}.tree-appear{animation:none;opacity:0.75}}
          `}</style>
        </defs>
        {/* Sun */}
        <motion.circle cx="400" cy="500" r="58" fill="#F5C060" opacity="0.88"
          initial={{ cy:520 }} animate={ phase>=1 ? { cy:188 } : { cy:520 } }
          transition={{ duration:2.8, ease:[0.2,0.6,0.2,1] }}/>
        <motion.circle cx="400" cy="500" r="95" fill="none" stroke="#F5C060" strokeWidth="1"
          initial={{ cy:520, opacity:0 }} animate={ phase>=1 ? { cy:188, opacity:0.28 } : {} }
          transition={{ duration:2.8, ease:[0.2,0.6,0.2,1] }}/>
        {/* Hills */}
        <path className="hill1"
          d="M -10,322 C 80,245 160,262 240,252 C 320,242 380,292 450,272 C 520,252 600,232 680,257 C 740,272 780,292 810,302 L 810,500 L -10,500 Z"
          fill="#C8785A" opacity="0.52"/>
        <path className="hill2"
          d="M -10,362 C 60,302 130,322 200,312 C 280,300 340,342 420,327 C 500,312 580,297 660,317 C 720,330 770,350 810,357 L 810,500 L -10,500 Z"
          fill="#B8603A" opacity="0.72"/>
        <path className="hill3"
          d="M -10,412 C 50,377 100,392 160,387 C 240,380 300,407 380,397 C 460,387 530,372 600,387 C 660,397 730,417 810,422 L 810,500 L -10,500 Z"
          fill="#8B4A2A" opacity="0.92"/>
        {/* Cypress trees */}
        {[118,198,258,602,662,722].map((x,i)=>(
          <ellipse key={i} className="tree-appear" cx={x} cy={371+(i%2)*-10}
            rx="7" ry="28" fill="#3A2010"
            style={{ animationDelay:`${1.2+i*0.12}s` }}/>
        ))}
        {/* Olive grove dots */}
        {[308,338,368,458,488].map((x,i)=>(
          <ellipse key={`g${i}`} className="tree-appear" cx={x} cy={394+(i%2)*4}
            rx="13" ry="8" fill="#7A8C55"
            style={{ animationDelay:`${1.5+i*0.1}s` }}/>
        ))}
      </svg>

      {/* Names */}
      <motion.div
        style={{ textAlign:'center',zIndex:3,position:'relative',marginBottom:22 }}
        initial="hidden"
        animate={ phase>=1 ? 'visible' : 'hidden' }
        variants={{ visible:{ transition:{ staggerChildren:0.15, delayChildren:0.5 } } }}
      >
        <motion.span
          style={{ display:'block',fontSize:9,letterSpacing:'0.28em',
            color:'rgba(255,238,200,0.85)',marginBottom:14,
            fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0, y:12 }, visible:{ opacity:1, y:0 } }}
          transition={{ duration:0.8 }}
        >
          IN THE WARMTH OF FOREVER
        </motion.span>
        <motion.h1
          style={{ fontFamily:'var(--font-serif)',fontSize:'clamp(48px,8vw,86px)',
            fontWeight:600,color:'#FFF0D8',margin:0,lineHeight:1.0,
            textShadow:'0 3px 24px rgba(80,30,10,0.45)',letterSpacing:'0.02em' }}
          variants={{ hidden:{ opacity:0, y:30, filter:'blur(12px)' }, visible:{ opacity:1, y:0, filter:'blur(0px)' } }}
          transition={{ duration:1.1, ease:[0.2,0.8,0.2,1] }}
        >
          Aarav <em className="couple-ampersand" style={{ color:'#F0C080' }}>&amp;</em> Siya
        </motion.h1>
      </motion.div>

      {/* Editorial card */}
      <motion.button
        initial={{ opacity:0, y:32 }}
        animate={ phase>=2 ? { opacity:1, y:0 } : {} }
        transition={{ duration:0.9, ...soft }}
        whileHover={{ y:-5, boxShadow:'0 32px 65px rgba(80,30,10,0.28)' }}
        whileTap={{ scale:0.98 }}
        onClick={onOpen}
        aria-label="Open invitation"
        style={{ position:'relative',zIndex:3,width:'min(340px,88vw)',
          background:'linear-gradient(145deg,rgba(255,248,235,0.96),rgba(240,225,195,0.95))',
          border:'1px solid rgba(180,140,100,0.5)',borderRadius:3,
          padding:'24px 28px',cursor:'pointer',backdropFilter:'blur(10px)',
          boxShadow:'0 20px 52px rgba(80,30,10,0.24)',textAlign:'center' }}
      >
        <p style={{ fontSize:8,letterSpacing:'0.28em',color:'#8B5030',margin:'0 0 8px',fontFamily:"'Jost',sans-serif",fontWeight:500 }}>
          KINDLY JOIN US
        </p>
        <p style={{ fontFamily:'var(--font-serif)',fontSize:22,fontWeight:600,color:'#3A2010',margin:'0 0 6px' }}>
          17th February 2027
        </p>
        <p style={{ fontSize:9,color:'#7A5030',letterSpacing:'0.1em',margin:0,fontFamily:"'Jost',sans-serif" }}>
          The Grand Pavilion · Bangalore · Tap to open
        </p>
      </motion.button>
    </IntroShell>
  );
}

export default TuscanRomanceIntro;
