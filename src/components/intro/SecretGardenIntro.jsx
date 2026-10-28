import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BotanicalFrame } from '../background/BotanicalFrame.jsx';
import { IntroShell } from './IntroShell.jsx';

const soft = { type:'spring', stiffness:80, damping:18 };

export function SecretGardenIntro({ onOpen }) {
  const [phase, setPhase] = useState(0);
  const [unfolding, setUnfolding] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleOpen = () => {
    setUnfolding(true);
    setTimeout(onOpen, 850);
  };

  return (
    <IntroShell onOpen={onOpen} exitVariants={{
      initial:{ opacity:1 },
      exit:{ opacity:0, transition:{ duration:0.85 } },
    }}>
      {/* Parchment bg */}
      <motion.div
        style={{ position:'absolute',inset:0,
          background:'radial-gradient(ellipse at 50% 40%,#F8F4E6 0%,#EDE5C8 55%,#D4C89A 100%)' }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1.1 }}
      />
      <div style={{ position:'absolute',inset:0,pointerEvents:'none',
        background:'radial-gradient(ellipse at 50% 50%,transparent 40%,rgba(60,45,20,0.22) 100%)' }}/>

      <BotanicalFrame variant="garden" color="#5C7A5C" accentColor="#C4A85A" />

      {/* Names */}
      <motion.div
        style={{ textAlign:'center',zIndex:2,position:'relative',marginBottom:30 }}
        initial="hidden" animate="visible"
        variants={{ visible:{ transition:{ staggerChildren:0.15, delayChildren:0.4 } } }}
      >
        <motion.span
          style={{ display:'block',fontSize:9,letterSpacing:'0.28em',color:'#5C7A5C',
            marginBottom:14,fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0, y:12 }, visible:{ opacity:1, y:0 } }}
          transition={{ duration:0.75 }}
        >
          A GATHERING IN THE GARDEN
        </motion.span>
        <motion.h1
          style={{ fontFamily:'var(--font-serif)',fontSize:'clamp(46px,8vw,82px)',
            fontWeight:600,color:'#2D3A1E',margin:0,lineHeight:1.05,letterSpacing:'0.02em' }}
          variants={{ hidden:{ opacity:0, y:30, filter:'blur(10px)' }, visible:{ opacity:1, y:0, filter:'blur(0px)' } }}
          transition={{ duration:1.0, ease:[0.2,0.8,0.2,1] }}
        >
          Aarav <em className="couple-ampersand" style={{ color:'#5C7A5C' }}>&amp;</em> Siya
        </motion.h1>
        <motion.p
          style={{ fontSize:9,letterSpacing:'0.22em',color:'#5C7A5C',marginTop:10,
            fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0 }, visible:{ opacity:1 } }}
          transition={{ duration:0.7 }}
        >
          INVITE YOU TO THEIR WEDDING
        </motion.p>
      </motion.div>

      {/* Heirloom letter */}
      <motion.button
        initial={{ opacity:0, y:34, scale:0.93 }}
        animate={unfolding
          ? { scaleY:0, opacity:0, transition:{ duration:0.75, ease:[0.4,0,0.2,1] } }
          : phase>=2 ? { opacity:1, y:0, scale:1 } : { opacity:0, y:34, scale:0.93 }}
        whileHover={ !unfolding ? { y:-5 } : {} }
        whileTap={ !unfolding ? { scale:0.98 } : {} }
        onClick={handleOpen}
        aria-label="Open invitation letter"
        style={{ position:'relative',zIndex:2,width:'min(380px,88vw)',
          background:'linear-gradient(145deg,#FFFCF0,#F5EDCF)',
          border:'1px solid rgba(196,168,90,0.5)',borderRadius:3,
          padding:'28px 34px',cursor:'pointer',
          boxShadow:'0 20px 58px rgba(45,40,20,0.16),0 2px 4px rgba(45,40,20,0.08)',
          transformOrigin:'top center' }}
      >
        {/* Botanical stamp */}
        <div style={{ position:'absolute',top:12,right:14,width:42,height:42,opacity:0.28 }}>
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="#5C7A5C" strokeWidth="0.8"/>
            <ellipse cx="14" cy="22" rx="6" ry="3" fill="#5C7A5C" transform="rotate(-30,14,22)"/>
            <ellipse cx="26" cy="18" rx="6" ry="3" fill="#5C7A5C" transform="rotate(20,26,18)"/>
            <circle cx="20" cy="20" r="2" fill="#C4A85A"/>
          </svg>
        </div>

        <p style={{ fontFamily:'var(--font-serif)',fontSize:14,fontStyle:'italic',color:'#5C7A5C',margin:'0 0 14px',letterSpacing:'0.02em' }}>
          Dear beloved friend,
        </p>
        <div style={{ height:1,background:'rgba(196,168,90,0.35)',margin:'0 0 14px' }}/>
        <p style={{ fontSize:11,lineHeight:1.85,color:'#4A3D20',margin:'0 0 18px',fontFamily:"'Jost',sans-serif" }}>
          We joyfully invite you to share in the celebration of our marriage on the seventeenth of February, twenty twenty seven.
        </p>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end' }}>
          <div>
            <p style={{ fontFamily:'var(--font-serif)',fontSize:17,fontStyle:'italic',color:'#3A2D10',margin:0,fontWeight:600 }}>
              Aarav <span className="couple-ampersand">&amp;</span> Siya
            </p>
            <p style={{ fontSize:8,letterSpacing:'0.18em',color:'#7A6A40',margin:'4px 0 0',fontFamily:"'Jost',sans-serif",fontWeight:500 }}>
              BANGALORE, INDIA
            </p>
          </div>
          <div style={{ width:44,height:44,borderRadius:'50%',
            background:'radial-gradient(circle at 32%,#7A9A6A,#4A6A3A 65%)',
            border:'2px double rgba(196,168,90,0.6)',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:'var(--font-serif)',fontSize:13,fontWeight:600,color:'#F0E8C8' }}>
            A<span className="couple-ampersand">&amp;</span>S
          </div>
        </div>
        <p style={{ fontSize:8,color:'#8A7850',textAlign:'center',marginTop:14,letterSpacing:'0.1em',fontFamily:"'Jost',sans-serif" }}>
          Tap to open
        </p>
      </motion.button>
    </IntroShell>
  );
}

export default SecretGardenIntro;
