import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilmGrain } from '../background/FilmGrain.jsx';
import { IntroShell } from './IntroShell.jsx';

const STEPS = ['5', '4', '3', '2', '1'];
const soft  = { type:'spring', stiffness:75, damping:17 };

export function CinemaParadisoIntro({ onOpen }) {
  const [countIdx, setCountIdx] = useState(0);
  const [phase, setPhase] = useState(0); // 0=count 1=title 2=frame

  useEffect(() => {
    // 700ms per digit — slow enough to read clearly, not draggy
    const timer = setInterval(() => {
      setCountIdx(prev => {
        if (prev >= STEPS.length - 1) {
          clearInterval(timer);
          setTimeout(() => setPhase(1), 300);
          setTimeout(() => setPhase(2), 1600);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <IntroShell onOpen={onOpen} exitVariants={{
      initial:{ opacity:1, scale:1 },
      exit:{ opacity:0, scale:1.1, transition:{ duration:1.05, ease:[0.4,0,0.2,1] } },
    }}>
      {/* Sepia bg */}
      <motion.div
        style={{ position:'absolute',inset:0,
          background:'radial-gradient(ellipse at 50% 50%,#3A2A18 0%,#1E1208 100%)' }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8 }}
      />
      <FilmGrain opacity={0.2} animate={true} />

      {/* Light leaks */}
      <motion.div aria-hidden="true"
        initial={{ opacity:0, scale:0.8 }}
        animate={ phase>=1 ? { opacity:0.48, scale:1 } : {} }
        transition={{ duration:1.6, ease:'easeOut' }}
        style={{ position:'absolute',top:-80,left:-60,width:420,height:420,borderRadius:'50%',
          background:'radial-gradient(circle,rgba(200,150,80,0.42) 0%,transparent 70%)',
          pointerEvents:'none',zIndex:1 }}/>
      <motion.div aria-hidden="true"
        initial={{ opacity:0 }}
        animate={ phase>=1 ? { opacity:0.28 } : {} }
        transition={{ delay:0.45, duration:1.6 }}
        style={{ position:'absolute',bottom:-60,right:-60,width:310,height:310,borderRadius:'50%',
          background:'radial-gradient(circle,rgba(180,100,80,0.38) 0%,transparent 70%)',
          pointerEvents:'none',zIndex:1 }}/>

      {/* Sprocket holes top row */}
      <div aria-hidden="true" style={{ position:'absolute',top:0,left:0,right:0,height:26,
        background:'#0D0802',display:'flex',gap:5,padding:'5px 8px',zIndex:3 }}>
        {Array.from({length:14}).map((_,i)=>(
          <div key={i} style={{ flex:'0 0 18px',height:16,borderRadius:1,background:'#1A1208',border:'1px solid #2A2010' }}/>
        ))}
      </div>
      <div aria-hidden="true" style={{ position:'absolute',bottom:0,left:0,right:0,height:26,
        background:'#0D0802',display:'flex',gap:5,padding:'5px 8px',zIndex:3 }}>
        {Array.from({length:14}).map((_,i)=>(
          <div key={i} style={{ flex:'0 0 18px',height:16,borderRadius:1,background:'#1A1208',border:'1px solid #2A2010' }}/>
        ))}
      </div>

      {/* Countdown */}
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div key={`c-${countIdx}`}
            initial={{ opacity:0, scale:1.3, y: -20, filter:'blur(6px)' }}
            animate={{ opacity:1, scale:1, y: 0, filter:'blur(0px)' }}
            exit={{ opacity:0, scale:0.75, y: 20, filter:'blur(4px)' }}
            transition={{ duration:0.35, ease:[0.2,0.8,0.2,1] }}
            style={{ position:'absolute',zIndex:4,
              fontFamily:'var(--font-serif)',fontSize:'clamp(80px,18vw,165px)',
              fontWeight:600,color:'rgba(240,220,180,0.92)',letterSpacing:'-0.05em' }}
          >
            {STEPS[countIdx]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Names */}
      <motion.div
        style={{ textAlign:'center',zIndex:3,position:'relative',marginBottom:30 }}
        initial="hidden"
        animate={ phase>=1 ? 'visible' : 'hidden' }
        variants={{ visible:{ transition:{ staggerChildren:0.15, delayChildren:0.1 } } }}
      >
        <motion.span
          style={{ display:'block',fontSize:8,letterSpacing:'0.3em',
            color:'rgba(200,160,100,0.68)',marginBottom:14,
            fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0, y:12 }, visible:{ opacity:1, y:0 } }}
          transition={{ duration:0.9 }}
        >
          A STORY WORTH WATCHING
        </motion.span>
        <motion.h1
          style={{ fontFamily:'var(--font-serif)',fontSize:'clamp(46px,7.5vw,82px)',
            fontWeight:600,color:'#F0E0C0',margin:0,lineHeight:1.0,letterSpacing:'0.04em',
            textShadow:'0 2px 18px rgba(0,0,0,0.5)' }}
          variants={{ hidden:{ opacity:0, y:32, filter:'blur(12px)' }, visible:{ opacity:1, y:0, filter:'blur(0px)' } }}
          transition={{ duration:1.1, ease:[0.2,0.8,0.2,1] }}
        >
          Aarav <em className="couple-ampersand" style={{ color:'#C4977A' }}>&amp;</em> Siya
        </motion.h1>
        <motion.p
          style={{ fontSize:9,letterSpacing:'0.22em',color:'rgba(200,160,100,0.62)',marginTop:10,
            fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0 }, visible:{ opacity:1 } }}
          transition={{ duration:0.7 }}
        >
          FOREVER BEGINS HERE · 2027
        </motion.p>
      </motion.div>

      {/* Film frame */}
      <motion.button
        initial={{ opacity:0, y:34 }}
        animate={ phase>=2 ? { opacity:1, y:0 } : {} }
        transition={{ duration:1.0, ...soft }}
        whileHover={{ y:-5, scale:1.015 }}
        whileTap={{ scale:0.98 }}
        onClick={onOpen}
        aria-label="Open invitation"
        style={{ position:'relative',zIndex:3,width:'min(340px,88vw)',cursor:'pointer',background:'none',border:'none',padding:0 }}
      >
        <div style={{ background:'linear-gradient(145deg,#2A1E0E,#1A1208)',
          border:'2px solid #3A2A15',padding:'14px',
          boxShadow:'0 22px 55px rgba(0,0,0,0.52)' }}>
          <div style={{ position:'relative',background:'linear-gradient(145deg,#4A3520,#2A1A0A)',
            aspectRatio:'4/3',overflow:'hidden' }}>
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
              alt="Wedding couple" loading="eager"
              style={{ width:'100%',height:'100%',objectFit:'cover',filter:'sepia(0.45) contrast(0.95)' }}/>
            <div style={{ position:'absolute',inset:0,
              background:'linear-gradient(to bottom,rgba(30,20,10,0.1),rgba(30,20,10,0.42))' }}/>
            <div style={{ position:'absolute',bottom:12,left:0,right:0,textAlign:'center',
              color:'rgba(240,220,180,0.92)',fontFamily:'var(--font-serif)',
              fontSize:17,fontStyle:'italic',fontWeight:600,
              textShadow:'0 1px 10px rgba(0,0,0,0.6)' }}>
              Aarav <span className="couple-ampersand">&amp;</span> Siya
            </div>
          </div>
          <p style={{ textAlign:'center',margin:'10px 0 0',fontSize:8,letterSpacing:'0.22em',
            color:'rgba(200,160,100,0.58)',fontFamily:"'Jost',sans-serif",fontWeight:500 }}>
            17 · II · 2027 · TAP TO OPEN
          </p>
        </div>
      </motion.button>
    </IntroShell>
  );
}

export default CinemaParadisoIntro;
