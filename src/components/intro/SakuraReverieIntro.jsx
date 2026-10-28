import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FloatingPetals } from '../background/FloatingPetals.jsx';
import { BotanicalFrame } from '../background/BotanicalFrame.jsx';
import { IntroShell } from './IntroShell.jsx';

const soft = { type:'spring', stiffness:85, damping:18 };

export function SakuraReverieIntro({ onOpen }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <IntroShell onOpen={onOpen} exitVariants={{
      initial:{ opacity:1 },
      exit:{ opacity:0, transition:{ duration:0.9 } },
    }}>
      {/* Cream-pink gradient */}
      <motion.div
        style={{ position:'absolute',inset:0,
          background:'linear-gradient(160deg,#FDF5F7 0%,#F8E8EC 45%,#EDD5DC 100%)' }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }}
      />

      {/* Three petal depth layers */}
      <div style={{ position:'absolute',inset:0,opacity:0.45,transform:'scale(1.2)',transformOrigin:'top',pointerEvents:'none' }}>
        <FloatingPetals count={10} color="#F0C0CC" />
      </div>
      <FloatingPetals count={16} color="#D4889A" />
      <div style={{ position:'absolute',inset:0,opacity:0.28,transform:'scale(0.88)',pointerEvents:'none' }}>
        <FloatingPetals count={8} color="#8B4D6B" />
      </div>

      <BotanicalFrame variant="sakura" color="#D4889A" accentColor="#F0C0CC" />

      {/* Names */}
      <motion.div
        style={{ textAlign:'center',zIndex:2,position:'relative',marginBottom:30 }}
        initial="hidden" animate="visible"
        variants={{ visible:{ transition:{ staggerChildren:0.14, delayChildren:0.4 } } }}
      >
        <motion.span
          style={{ display:'block',fontSize:9,letterSpacing:'0.28em',color:'#8B4D6B',
            marginBottom:14,fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0, y:12 }, visible:{ opacity:1, y:0 } }}
          transition={{ duration:0.75 }}
        >
          WHERE PETALS FALL AND HEARTS MEET
        </motion.span>
        <motion.h1
          style={{ fontFamily:'var(--font-serif)',fontSize:'clamp(46px,8vw,82px)',
            fontWeight:600,letterSpacing:'0.03em',color:'#3D1F2D',margin:0,lineHeight:1.05 }}
          variants={{ hidden:{ opacity:0, y:30, filter:'blur(10px)' }, visible:{ opacity:1, y:0, filter:'blur(0px)' } }}
          transition={{ duration:1.0, ease:[0.2,0.8,0.2,1] }}
        >
          Aarav <em className="couple-ampersand" style={{ color:'#D4889A' }}>&amp;</em> Siya
        </motion.h1>
        <motion.p
          style={{ fontSize:9,letterSpacing:'0.24em',color:'#8B4D6B',marginTop:10,
            fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0 }, visible:{ opacity:1 } }}
          transition={{ duration:0.7 }}
        >
          YOU ARE INVITED
        </motion.p>
      </motion.div>

      {/* Glass panel */}
      <motion.button
        initial={{ opacity:0, y:36, scale:0.94 }}
        animate={ phase>=2 ? { opacity:1, y:0, scale:1 } : {} }
        transition={{ duration:0.95, ...soft }}
        whileHover={{ y:-6 }}
        whileTap={{ scale:0.98 }}
        onClick={onOpen}
        aria-label="Open invitation"
        style={{ position:'relative',zIndex:2,width:'min(360px,88vw)',
          background:'rgba(255,240,245,0.76)',border:'1px solid rgba(212,136,154,0.42)',
          borderRadius:4,padding:'26px 30px',cursor:'pointer',backdropFilter:'blur(14px)',
          boxShadow:'0 20px 54px rgba(80,30,50,0.14)',textAlign:'center' }}
      >
        {/* Cherry blossom icon */}
        <svg width="30" height="30" viewBox="0 0 28 28" style={{ margin:'0 auto 12px',display:'block' }}>
          {[0,72,144,216,288].map((a,i)=>(
            <ellipse key={i} cx={14+Math.cos(a*Math.PI/180)*8} cy={14+Math.sin(a*Math.PI/180)*8}
              rx="5.5" ry="3.2" fill="#F0C0CC" opacity="0.88"
              transform={`rotate(${a},${14+Math.cos(a*Math.PI/180)*8},${14+Math.sin(a*Math.PI/180)*8})`}/>
          ))}
          <circle cx="14" cy="14" r="2.8" fill="#D4889A"/>
        </svg>
        <p style={{ fontSize:8,letterSpacing:'0.3em',color:'#8B4D6B',margin:'0 0 8px',fontFamily:"'Jost',sans-serif",fontWeight:500 }}>
          17 · FEBRUARY · 2027
        </p>
        <p style={{ fontFamily:'var(--font-serif)',fontSize:20,fontWeight:600,color:'#3D1F2D',margin:'0 0 5px' }}>
          Aarav <span className="couple-ampersand">&amp;</span> Siya's Wedding
        </p>
        <p style={{ fontSize:9,color:'#8B4D6B',letterSpacing:'0.08em',fontFamily:"'Jost',sans-serif" }}>
          Bangalore · Tap to open invitation
        </p>
      </motion.button>
    </IntroShell>
  );
}

export default SakuraReverieIntro;
