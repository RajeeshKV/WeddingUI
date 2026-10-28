import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ConstellationStars } from '../background/ConstellationStars.jsx';
import { ParticleField } from '../background/ParticleField.jsx';
import { IntroShell } from './IntroShell.jsx';

const soft = { type:'spring', stiffness:72, damping:17 };

export function CelestialPromiseIntro({ onOpen }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <IntroShell onOpen={onOpen} exitVariants={{
      initial:{ opacity:1, scale:1 },
      exit:{ opacity:0, scale:0.97, filter:'blur(8px)',
        transition:{ duration:1.1, ease:[0.4,0,0.2,1] } },
    }}>
      {/* Deep indigo sky */}
      <motion.div
        style={{ position:'absolute',inset:0,
          background:'radial-gradient(ellipse at 50% 28%,#1A1A4A 0%,#0D0D28 55%,#05050F 100%)' }}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }}
      />

      <ParticleField count={65} color="#C8C0E8" mode="star-shimmer" />
      <ConstellationStars starCount={110} lineCount={18} />

      {/* Moon */}
      <motion.div aria-hidden="true"
        initial={{ opacity:0, scale:0.7 }}
        animate={ phase>=1 ? { opacity:0.88, scale:1 } : {} }
        transition={{ duration:2, ease:'easeOut' }}
        style={{ position:'absolute',top:'7%',right:'14%',
          width:82,height:82,borderRadius:'50%',
          background:'radial-gradient(circle at 35% 30%,#F0EEF8,#C8C0E8 52%,rgba(123,126,200,0) 100%)',
          boxShadow:'0 0 44px 14px rgba(123,126,200,0.14)',
          pointerEvents:'none',zIndex:1 }}/>
      <motion.div aria-hidden="true"
        initial={{ opacity:0 }}
        animate={ phase>=1 ? { opacity:0.18 } : {} }
        transition={{ delay:0.5, duration:2 }}
        style={{ position:'absolute',top:'calc(7% - 22px)',right:'calc(14% - 22px)',
          width:126,height:126,borderRadius:'50%',
          background:'radial-gradient(circle,rgba(200,192,232,0.22) 0%,transparent 70%)',
          pointerEvents:'none',zIndex:1 }}/>

      {/* Constellation initials SVG */}
      <motion.svg
        initial={{ opacity:0 }}
        animate={ phase>=1 ? { opacity:1 } : {} }
        transition={{ duration:1.6 }}
        viewBox="0 0 200 120"
        style={{ position:'absolute',top:'14%',left:'50%',
          transform:'translateX(-50%)',width:200,height:120,zIndex:2,pointerEvents:'none' }}
      >
        {[
          [42,22],[32,52],[52,82],[82,62],[100,32],[122,12],
          [157,26],[172,56],[157,82],[132,72],[162,42],
        ].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r={i%3===0?2.2:1.4}
            fill="#C8C0E8" opacity="0"
            style={{ animation:`starAppear 0.9s ${0.2+i*0.1}s ease-out forwards` }}/>
        ))}
        {[
          [[42,22],[32,52]],[[32,52],[52,82]],[[52,82],[82,62]],
          [[82,62],[100,32]],[[100,32],[122,12]],[[122,12],[157,26]],
          [[157,26],[172,56]],[[172,56],[157,82]],
        ].map(([[x1,y1],[x2,y2]],i)=>(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#7B7EC8" strokeWidth="0.55" opacity="0"
            style={{ animation:`lineAppear 1.2s ${0.8+i*0.14}s ease-out forwards` }}/>
        ))}
        <style>{`
          @keyframes starAppear{to{opacity:0.92}}
          @keyframes lineAppear{to{opacity:0.38}}
          @media(prefers-reduced-motion:reduce){circle,line{animation:none!important;opacity:0.5}}
        `}</style>
      </motion.svg>

      {/* Names */}
      <motion.div
        style={{ textAlign:'center',zIndex:3,position:'relative',marginBottom:34,marginTop:18 }}
        initial="hidden" animate="visible"
        variants={{ visible:{ transition:{ staggerChildren:0.16, delayChildren:0.5 } } }}
      >
        <motion.span
          style={{ display:'block',fontSize:9,letterSpacing:'0.3em',
            color:'rgba(155,164,224,0.72)',marginBottom:14,
            fontFamily:"'Jost',sans-serif",fontWeight:500 }}
          variants={{ hidden:{ opacity:0, y:12 }, visible:{ opacity:1, y:0 } }}
          transition={{ duration:0.8 }}
        >
          WRITTEN IN THE STARS
        </motion.span>
        <motion.h1
          style={{ fontFamily:'var(--font-serif)',fontSize:'clamp(46px,7.5vw,82px)',
            fontWeight:600,letterSpacing:'0.05em',color:'#F0EEFF',margin:0,lineHeight:1.0,
            textShadow:'0 0 36px rgba(123,126,200,0.32)' }}
          variants={{ hidden:{ opacity:0, y:32, filter:'blur(12px)' }, visible:{ opacity:1, y:0, filter:'blur(0px)' } }}
          transition={{ duration:1.1, ease:[0.2,0.8,0.2,1] }}
        >
          Aarav <em className="couple-ampersand" style={{ color:'#9BA4E0' }}>&amp;</em> Siya
        </motion.h1>
        <motion.div
          style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginTop:16 }}
          variants={{ hidden:{ opacity:0, scaleX:0 }, visible:{ opacity:1, scaleX:1 } }}
          transition={{ duration:0.85, ease:[0.4,0,0.2,1] }}
        >
          <div style={{ width:40,height:1,background:'linear-gradient(to right,transparent,rgba(155,164,224,0.52))' }}/>
          <div style={{ width:5,height:5,transform:'rotate(45deg)',background:'#C8C0E8',opacity:0.85 }}/>
          <div style={{ width:40,height:1,background:'linear-gradient(to left,transparent,rgba(155,164,224,0.52))' }}/>
        </motion.div>
      </motion.div>

      {/* Moonlight card */}
      <motion.button
        initial={{ opacity:0, y:36 }}
        animate={ phase>=2 ? { opacity:1, y:0 } : {} }
        transition={{ duration:1.05, ...soft }}
        whileHover={{ y:-6, boxShadow:'0 32px 75px rgba(30,30,90,0.52)' }}
        whileTap={{ scale:0.98 }}
        onClick={onOpen}
        aria-label="Open invitation"
        style={{ position:'relative',zIndex:3,width:'min(360px,88vw)',
          background:'linear-gradient(145deg,rgba(20,20,62,0.93),rgba(10,10,36,0.96))',
          border:'1px solid rgba(155,164,224,0.26)',borderRadius:4,
          padding:'28px 34px',cursor:'pointer',backdropFilter:'blur(18px)',
          boxShadow:'0 22px 58px rgba(5,5,20,0.62),inset 0 0 0 1px rgba(200,192,232,0.08)',
          textAlign:'center' }}
      >
        {/* Corner marks */}
        {[{top:10,left:10},{top:10,right:10},{bottom:10,left:10},{bottom:10,right:10}].map((pos,i)=>(
          <div key={i} style={{ position:'absolute',...pos,width:14,height:14,
            borderTop: i<2 ? '1px solid rgba(200,192,232,0.42)' : 'none',
            borderBottom: i>=2 ? '1px solid rgba(200,192,232,0.42)' : 'none',
            borderLeft: i%2===0 ? '1px solid rgba(200,192,232,0.42)' : 'none',
            borderRight: i%2===1 ? '1px solid rgba(200,192,232,0.42)' : 'none' }}/>
        ))}
        {/* Moon phase icon */}
        <svg width="30" height="30" viewBox="0 0 28 28" style={{ margin:'0 auto 14px',display:'block' }}>
          <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(200,192,232,0.42)" strokeWidth="1"/>
          <path d="M 14,4 A 10,10 0 0 1 14,24 A 6,6 0 0 0 14,4 Z" fill="rgba(200,192,232,0.52)"/>
        </svg>
        <p style={{ fontSize:8,letterSpacing:'0.28em',color:'rgba(155,164,224,0.65)',margin:'0 0 8px',fontFamily:"'Jost',sans-serif",fontWeight:500 }}>
          17 · FEBRUARY · 2027
        </p>
        <p style={{ fontFamily:'var(--font-serif)',fontSize:20,fontWeight:600,color:'#F0EEFF',margin:'0 0 5px' }}>
          Aarav <span className="couple-ampersand">&amp;</span> Siya
        </p>
        <p style={{ fontSize:9,color:'rgba(155,164,224,0.55)',letterSpacing:'0.1em',margin:'0 0 14px',fontFamily:"'Jost',sans-serif" }}>
          Bangalore, India
        </p>
        <div style={{ height:1,background:'rgba(155,164,224,0.16)',margin:'0 0 12px' }}/>
        <p style={{ fontSize:8,color:'rgba(155,164,224,0.5)',letterSpacing:'0.14em',margin:0,fontFamily:"'Jost',sans-serif",fontWeight:500 }}>
          TAP TO OPEN INVITATION
        </p>
      </motion.button>
    </IntroShell>
  );
}

export default CelestialPromiseIntro;
