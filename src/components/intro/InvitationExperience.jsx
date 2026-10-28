import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Flower2 } from 'lucide-react';
import { IntroShell } from './IntroShell.jsx';
import { InvitationLetter } from './InvitationLetter.jsx';
import { FloatingPetals } from '../background/FloatingPetals.jsx';
import { ParticleField } from '../background/ParticleField.jsx';
import { ConstellationStars } from '../background/ConstellationStars.jsx';
import { FilmGrain } from '../background/FilmGrain.jsx';

const ART = {
  'eternal-bloom': { name:'The Eternal Bloom', eyebrow:'A promise in bloom', line:'soft petals drifting through a rose-lit garden', sky:'radial-gradient(ellipse at 50% 20%, #fff8f4 0%, #efd8dc 48%, #c9a6b5 100%)', ink:'#462638', muted:'#815d6e', paper:'#fffaf3', paper2:'#f2e2d6', seal:'#94485c', accent:'#c87f89', motif:'petals' },
  'midnight-vows': { name:'Midnight Vows', eyebrow:'After dusk, always', line:'a velvet night touched with old gold', sky:'radial-gradient(ellipse at 50% 15%, #3c2638 0%, #17111e 58%, #090911 100%)', ink:'#f5e7cb', muted:'#d3b98a', paper:'#f1e6d2', paper2:'#d9c6a5', seal:'#6e2638', accent:'#c9a84c', motif:'stars' },
  'marigold-mandap': { name:'Marigold Mandap', eyebrow:'Under the marigold canopy', line:'saffron light and a celebration in full bloom', sky:'radial-gradient(ellipse at 50% 16%, #fff7dc 0%, #f2c976 52%, #c75c35 100%)', ink:'#4c2519', muted:'#8b4b30', paper:'#fff6df', paper2:'#ebd3a7', seal:'#b4432d', accent:'#d58e35', motif:'marigolds' },
  'tuscan-romance': { name:'Tuscan Romance', eyebrow:'A summer in Tuscany', line:'sun-warmed hills, olive branches, golden hour', sky:'linear-gradient(165deg,#f9dca5 0%,#e7a36d 48%,#a75e50 100%)', ink:'#412b23', muted:'#775343', paper:'#fff8eb', paper2:'#e6cfad', seal:'#98503c', accent:'#83905c', motif:'olive' },
  'pearl-atelier': { name:'Pearl Atelier', eyebrow:'An intimate affair', line:'quiet luxury, fine paper, enduring details', sky:'linear-gradient(145deg,#fbfaf7 0%,#eae5de 54%,#d4d0c9 100%)', ink:'#252321', muted:'#77716c', paper:'#fffefa', paper2:'#e9e3da', seal:'#77716c', accent:'#aaa194', motif:'lines' },
  'sakura-reverie': { name:'Sakura Reverie', eyebrow:'A fleeting, beautiful season', line:'spring blossoms gathered in a soft breeze', sky:'linear-gradient(150deg,#fff9f6 0%,#f4dce1 48%,#d79eae 100%)', ink:'#472634', muted:'#925c70', paper:'#fffaf2', paper2:'#f0d8d5', seal:'#a34f6b', accent:'#d78b9a', motif:'petals' },
  'secret-garden': { name:'The Secret Garden', eyebrow:'Meet us where the wildflowers grow', line:'fern shadows and an old garden in the morning', sky:'radial-gradient(ellipse at 50% 25%,#f4f0dc 0%,#c9d0a9 54%,#506653 100%)', ink:'#283d30', muted:'#506b54', paper:'#fff9e9', paper2:'#e4dfc2', seal:'#55704f', accent:'#bd9956', motif:'leaves' },
  'ocean-serenade': { name:'Ocean Serenade', eyebrow:'Where the tide brings us together', line:'sea glass, salt air, the last light on the water', sky:'linear-gradient(165deg,#d9efed 0%,#78b8b8 45%,#286777 100%)', ink:'#173b45', muted:'#386f77', paper:'#f5fbf5', paper2:'#d5e7df', seal:'#286b72', accent:'#b99e72', motif:'waves' },
  'cinema-paradiso': { name:'Cinema Paradiso', eyebrow:'A love worth remembering', line:'a golden frame, one timeless scene', sky:'radial-gradient(ellipse at 50% 40%,#99744a 0%,#48331f 60%,#17110c 100%)', ink:'#3d2b1b', muted:'#886844', paper:'#f4e5c9', paper2:'#d9c09b', seal:'#804a31', accent:'#c28d4b', motif:'film' },
  'celestial-promise': { name:'Celestial Promise', eyebrow:'Written in the stars', line:'a quiet constellation above the midnight blue', sky:'radial-gradient(ellipse at 50% 10%,#383d75 0%,#171b43 55%,#080d25 100%)', ink:'#f3e8d5', muted:'#c6c3df', paper:'#f6f0e3', paper2:'#d9d1c2', seal:'#4a477d', accent:'#cbb57c', motif:'stars' },
  'floral-romance': { name:'Floral Romance', eyebrow:'A garden gathered for you', line:'abundant garden roses and painterly wildflowers', sky:'radial-gradient(ellipse at 50% 20%,#fff6e9 0%,#edc5b7 50%,#9e7371 100%)', ink:'#422630', muted:'#81535e', paper:'#fff9ed', paper2:'#eddbca', seal:'#974d5b', accent:'#ca8b67', motif:'petals' },
  'modern-luxury': { name:'Modern Luxury', eyebrow:'A study in forever', line:'architectural light, ink, ivory, and brushed brass', sky:'linear-gradient(135deg,#efebe4 0%,#c8bda9 48%,#68605a 100%)', ink:'#28231e', muted:'#70665b', paper:'#fffdf6', paper2:'#ded4c4', seal:'#4d4237', accent:'#ad8b55', motif:'lines' },
  'royal-heritage': { name:'Royal Heritage', eyebrow:'With the blessing of our families', line:'ceremonial brocade, heirloom gold, deep garnet', sky:'radial-gradient(ellipse at 50% 20%,#752c37 0%,#3a1725 58%,#1b1020 100%)', ink:'#f7e9cb', muted:'#e1c68e', paper:'#f7e9cb', paper2:'#dfc89b', seal:'#842d3c', accent:'#bf9a51', motif:'ornate' },
  'minimal-editorial': { name:'Minimal Editorial', eyebrow:'The beginning of our next chapter', line:'honest words, generous space, a little ink', sky:'linear-gradient(155deg,#faf9f5 0%,#e9e5dc 62%,#d6d1c7 100%)', ink:'#262522', muted:'#74706a', paper:'#fffefa', paper2:'#eeeae2', seal:'#4c4a46', accent:'#a79883', motif:'lines' },
  'celestial-romance': { name:'Celestial Romance', eyebrow:'Two souls, one orbit', line:'a champagne moon over an indigo horizon', sky:'radial-gradient(ellipse at 50% 18%,#45447c 0%,#20244c 48%,#0b1028 100%)', ink:'#f5ead9', muted:'#d1c7dc', paper:'#f8f0e2', paper2:'#d9cdbb', seal:'#655184', accent:'#d1b774', motif:'stars' },
};

const BACKDROPS = {
  'eternal-bloom':'/assets/eternal-bloom-bg.webp',
  'midnight-vows':'/assets/midnight-vows-bg.webp',
  'marigold-mandap':'/assets/marigold-mandap-bg.webp',
  'tuscan-romance':'/assets/tuscan-romance-bg.webp',
  'pearl-atelier':'/assets/pearl-atelier-bg.webp',
  'sakura-reverie':'/assets/sakura-reverie-bg.webp',
  'secret-garden':'/assets/secret-garden-bg.webp',
  'ocean-serenade':'/assets/ocean-serenade-bg.webp',
  'cinema-paradiso':'/assets/cinema-paradiso-bg.webp',
  'celestial-promise':'/assets/celestial-promise-bg.webp',
  'floral-romance':'/assets/floral-romance-bg.webp',
  'modern-luxury':'/assets/modern-luxury-bg.webp',
  'royal-heritage':'/assets/royal-heritage-bg.webp',
  'minimal-editorial':'/assets/minimal-editorial-bg.webp',
  'celestial-romance':'/assets/celestial-romance-bg.webp',
};
const CONTRAST_INK = {
  'cinema-paradiso':{ink:'#f5e6cb',muted:'#d6b988'},
  'ocean-serenade':{ink:'#f5fbf5',muted:'#d5ece7'},
};

const PETAL_THEMES = new Set(['eternal-bloom', 'sakura-reverie', 'floral-romance', 'marigold-mandap']);

function ThemeMotion({ themeId, reduced }) {
  if (reduced) return null;
  return <div className={`invite-theme-motion invite-theme-motion--${themeId}`} aria-hidden="true">
    {PETAL_THEMES.has(themeId) && <>
      <FloatingPetals count={themeId === 'marigold-mandap' ? 12 : 16} color={themeId === 'marigold-mandap' ? '#f4a62a' : '#e9a6b4'} />
      <FloatingPetals count={8} color={themeId === 'marigold-mandap' ? '#ffd56a' : '#fff0e7'} className="invite-petals-back" />
    </>}
    {themeId === 'midnight-vows' && <ParticleField count={38} color="#e6c477" mode="gold-converge" />}
    {(themeId === 'celestial-promise' || themeId === 'celestial-romance') && <>
      <ParticleField count={34} color="#eee5ff" mode="star-shimmer" />
      <ConstellationStars starCount={74} lineCount={12} />
    </>}
    {themeId === 'cinema-paradiso' && <FilmGrain opacity={0.13} />}
    {themeId === 'tuscan-romance' && <SunsetMotion />}
  </div>;
}

function SunsetMotion() {
  return <>
    <motion.div className="invite-sunset-halo" initial={{ opacity: 0 }} animate={{ opacity: [0, .7, .46, .62] }} transition={{ duration: 18, times: [0, .18, .72, 1], ease: 'easeInOut' }} />
    <motion.div className="invite-sunset-disc" initial={{ opacity: 0, y: -30, scale: .86 }} animate={{ opacity: [.9, .95, .82], y: [-30, 0, 38], scale: [.86, 1, 1.05] }} transition={{ duration: 20, times: [0, .48, 1], ease: 'easeInOut' }} />
  </>;
}

// Theme-specific choreography echoes the original reveals while sharing the invitation artwork.
const CHOREOGRAPHY = {
  'eternal-bloom':{ name:{opacity:0,y:28,filter:'blur(10px)'}, card:{opacity:0,y:48,rotateX:10,scale:.94}, delay:.5, duration:1.05 },
  'midnight-vows':{ name:{opacity:0,scale:.84,filter:'blur(18px)'}, card:{opacity:0,scale:.82,y:18,rotateY:-9}, delay:.66, duration:1.15 },
  'marigold-mandap':{ name:{opacity:0,y:-20,scale:.96}, card:{opacity:0,y:70,rotate:-4,scale:.9}, delay:.48, duration:.92 },
  'tuscan-romance':{ name:{opacity:0,x:-46,filter:'blur(5px)'}, card:{opacity:0,x:54,rotateY:8,scale:.96}, delay:.52, duration:1.08 },
  'pearl-atelier':{ name:{opacity:0,clipPath:'inset(0 0 100% 0)'}, card:{opacity:0,y:24,scale:.98}, delay:.42, duration:1.2 },
  'sakura-reverie':{ name:{opacity:0,y:-24,rotate:-2,filter:'blur(5px)'}, card:{opacity:0,y:34,rotate:2,scale:.94}, delay:.6, duration:1.08 },
  'secret-garden':{ name:{opacity:0,y:24,clipPath:'inset(0 0 45% 0)'}, card:{opacity:0,y:44,scale:.9,rotateX:8}, delay:.6, duration:1.15 },
  'ocean-serenade':{ name:{opacity:0,y:54,filter:'blur(7px)'}, card:{opacity:0,y:82,rotateX:15,scale:.96}, delay:.54, duration:1.18 },
  'cinema-paradiso':{ name:{opacity:0,scale:1.16,filter:'blur(16px)'}, card:{opacity:0,scale:1.12,filter:'blur(12px)'}, delay:.74, duration:1.22 },
  'celestial-promise':{ name:{opacity:0,y:-16,scale:.88,filter:'blur(8px)'}, card:{opacity:0,y:18,scale:.9,rotateZ:-2}, delay:.62, duration:1.3 },
  'floral-romance':{ name:{opacity:0,y:24,scale:.92,filter:'blur(8px)'}, card:{opacity:0,y:46,scale:.9,rotateZ:2}, delay:.54, duration:1.08 },
  'modern-luxury':{ name:{opacity:0,x:30,filter:'blur(7px)'}, card:{opacity:0,y:30,rotateY:-8,scale:.96}, delay:.45, duration:1.05 },
  'royal-heritage':{ name:{opacity:0,y:-30,scale:.9}, card:{opacity:0,y:58,scale:.88,rotateX:12}, delay:.64, duration:1.14 },
  'minimal-editorial':{ name:{opacity:0,y:12,letterSpacing:'.2em'}, card:{opacity:0,y:22,scale:.985}, delay:.38, duration:1.15 },
  'celestial-romance':{ name:{opacity:0,scale:.82,rotateZ:-3,filter:'blur(12px)'}, card:{opacity:0,y:20,scale:.9,rotateZ:2}, delay:.7, duration:1.3 },
};

function getPartnerNames(coupleName) {
  const fallback = ['Aarav', 'Siya'];
  if (typeof coupleName !== 'string' || !coupleName.trim()) return fallback;
  const parts = coupleName.trim().replace(/\s+wedding\s*$/i, '').split(/\s*&\s*|\s+and\s+/i);
  return parts.length >= 2 && parts[0].trim() && parts.slice(1).join(' & ').trim()
    ? [parts[0].trim(), parts.slice(1).join(' & ').trim()]
    : fallback;
}

function initialOf(name) {
  return Array.from(name.trim())[0]?.toLocaleUpperCase() || '';
}

function Atmosphere({ themeId, art }) {
  const reduceMotion = useReducedMotion();
  const count = art.motif === 'stars' ? 24 : art.motif === 'petals' || art.motif === 'marigolds' ? 11 : 0;
  return <motion.div className={`invite-atmosphere invite-atmosphere--${art.motif}`} aria-hidden="true"
    style={{backgroundImage:`linear-gradient(180deg,rgba(16,12,18,.06),rgba(16,12,18,.02) 45%,rgba(16,12,18,.12)),url(${BACKDROPS[themeId] || BACKDROPS['eternal-bloom']})`,backgroundSize:'cover,cover',backgroundPosition:'center,center'}}
    initial={reduceMotion?false:{opacity:0,scale:1.08}}
    animate={reduceMotion?{opacity:1,scale:1}:{opacity:[0,1,1],scale:[1.08,1.025,1.075],x:[0,0,-5,0]}}
    transition={reduceMotion?{duration:0}:{opacity:{duration:1.5},scale:{duration:28,repeat:Infinity,ease:'linear'},x:{duration:28,repeat:Infinity,ease:'linear'}}}>
    <div className="invite-sky" />
    <div className="invite-vignette" />
    {count > 0 && Array.from({length:count},(_,i)=><motion.i key={i} style={{'--i':i,'--seed':`${(i*37+themeId.length*19)%100}%`}} initial={reduceMotion?false:{opacity:0,y:30,rotate:-18}} animate={reduceMotion?{opacity:.16,y:0,x:0,rotate:0}:{opacity:[0,.72,.34],y:[36,-26,-80],x:[0,i%2?24:-24,8],rotate:[-22,18,52]}} transition={reduceMotion?{duration:0}:{delay:.45+i*.11,duration:8+i*.34,repeat:Infinity,ease:'easeInOut'}} />)}
    {themeId === 'eternal-bloom' && <><Flower2 className="invite-bloom invite-bloom--left" strokeWidth={0.7}/><Flower2 className="invite-bloom invite-bloom--right" strokeWidth={0.7}/></>}
    {art.motif === 'olive' || art.motif === 'leaves' ? <motion.svg className="invite-branch" viewBox="0 0 260 500" animate={reduceMotion?undefined:{rotate:[-1.5,1.5,-1.5],y:[0,-5,0]}} transition={{duration:9,repeat:Infinity,ease:'easeInOut'}}><path d="M15 490C95 380 55 270 150 170S200 65 245 10"/><path d="M54 408c-52-11-61-43-58-72 42 4 63 28 58 72Zm28-72c-4-50 22-73 50-83 13 41-5 70-50 83Zm32-85c-44-20-47-54-37-81 39 13 54 42 37 81Zm33-67c-4-47 23-67 49-75 11 38-7 64-49 75Zm26-65c-34-22-34-50-22-72 31 14 41 38 22 72Z"/></motion.svg> : null}
    {art.motif === 'waves' ? <motion.svg className="invite-wave" viewBox="0 0 1440 320" animate={reduceMotion?undefined:{y:[0,-9,0]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}><path d="M0 180Q180 80 360 180t360 0 360 0 360 0v140H0Z"/><path d="M0 225Q180 125 360 225t360 0 360 0 360 0v95H0Z"/></motion.svg> : null}
    {art.motif === 'film' ? <div className="invite-film-edge"><span>✦ &nbsp; 17 FEBRUARY 2027 &nbsp; ✦</span></div> : null}
    {art.motif === 'ornate' ? <div className="invite-ornament">❧<span>❦</span>❧</div> : null}
  </motion.div>;
}

export function InvitationExperience({ themeId, onOpen, coupleName }) {
  const art = ART[themeId] || ART['eternal-bloom'];
  const choreography = CHOREOGRAPHY[themeId] || CHOREOGRAPHY['eternal-bloom'];
  const contrast = CONTRAST_INK[themeId] || {};
  const [partnerOne, partnerTwo] = getPartnerNames(coupleName);
  const monogram = `${initialOf(partnerOne)}&${initialOf(partnerTwo)}`;
  const reduceMotion = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const open = () => { if (opening) return; setOpening(true); window.setTimeout(onOpen, reduceMotion ? 0 : 1050); };
  return <IntroShell onOpen={open}>
    <div className={`invitation-experience theme-intro-${themeId}`} style={{'--intro-ink':contrast.ink||art.ink,'--intro-muted':contrast.muted||art.muted,'--intro-paper':art.paper,'--intro-paper-shade':art.paper2,'--intro-seal':art.seal,'--intro-accent':art.accent}}>
      <Atmosphere themeId={themeId} art={art}/>
      <ThemeMotion themeId={themeId} reduced={reduceMotion} />
      <motion.div className="invite-composition" initial={reduceMotion?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:reduceMotion?0:0.9,ease:[0.2,0.75,0.2,1]}}>
        <motion.p className="invite-eyebrow" initial={reduceMotion?false:{opacity:0,letterSpacing:'0.5em',y:8}} animate={{opacity:1,letterSpacing:'0.32em',y:0}} transition={{delay:0.25,duration:reduceMotion?0:1}}>{art.eyebrow}</motion.p>
        <motion.h1 className="invite-names" initial={reduceMotion?false:choreography.name} animate={{opacity:1,y:0,x:0,scale:1,rotate:0,rotateZ:0,rotateX:0,rotateY:0,filter:'blur(0px)',clipPath:'inset(0 0 0% 0)'}} transition={{delay:reduceMotion?0:choreography.delay,duration:reduceMotion?0:choreography.duration,ease:[0.2,0.8,0.2,1]}}>{partnerOne} <em className="couple-ampersand">&amp;</em> {partnerTwo}</motion.h1>
        <motion.p className="invite-deck" initial={reduceMotion?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.72,duration:reduceMotion?0:.8}}>{art.line}</motion.p>
        <InvitationLetter opening={opening} onOpen={open} monogram={monogram} entrance={choreography.card} entranceDelay={Math.max(.82,choreography.delay+.2)} entranceDuration={choreography.duration} />
      </motion.div>
    </div>
  </IntroShell>;
}

export default InvitationExperience;

