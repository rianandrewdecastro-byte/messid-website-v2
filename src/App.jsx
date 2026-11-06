import React, { useState, useEffect, useRef } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll
} from 'framer-motion';
import {
  Shield, Zap, Tag, Handshake, Store, ArrowRight, Cpu, Wrench, MapPin, Mail, Globe, HelpCircle, ChevronDown, Send, Info, Target, Eye, Home, Search, CheckCircle, Navigation, ExternalLink, MessageCircle, Menu, X, Volume2, VolumeX, List, Map, ShoppingCart, UserCheck, ScanLine, CreditCard
} from 'lucide-react';

// --- CUSTOM AUDIO HOOK FOR SOUND FEEDBACK ---
const playClickSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) { console.log('Audio not supported'); }
};

// --- FULL PARTNER DATA ---
const partnerData = [
  { id: 2, name: 'Bitbase Computer & Tech', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/bitbase.png', category: 'Services', discountValue: 5, location: 'P. Gomez, Batangas City', discount: '5% OFF', mapsLink: 'https://www.google.com/maps/place/P.Gomez,+Batangas+City,+Batangas/@13.7561983,121.0540164,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd054021bda135:0x6b12e4c58fdde7b5!8m2!3d13.7561983!4d121.0565967!16s%2Fg%2F1tfq258r?entry=ttu', fbLink: 'https://www.facebook.com/BitbaseComputerTech' },
  { id: 3, name: 'But First, Coffee – Sta. Rita', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/bfc.png', category: 'Food', discountValue: 10, location: 'Sta. Rita, Batangas', discount: '10% OFF', mapsLink: 'https://www.google.com/maps/place/But+First,+Coffee+(BFC)+-+Sta.+Rita,+Batangas/@13.777071,121.0404761,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd0f004386fdcf:0x8a83c8c3306e1cb8!8m2!3d13.777071!4d121.0430564!16s%2Fg%2F11why7yry9?entry=ttu', fbLink: 'https://www.facebook.com/butfirstcoffeestaritabatangas' },
  { id: 4, name: 'Engr. Guides Office and School Supplies', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/engrguides.png', category: 'Supplies', discountValue: 5, location: 'Alangilan, Batangas City', discount: '5% OFF', mapsLink: 'https://www.google.com/maps/place/Alangilan,+Batangas+City,+Batangas/@13.7830168,121.0625827,16z/data=!3m1!4b1!4m6!3m5!1s0x33bd0fef93c252e9:0xcbc370e11d35fd08!8m2!3d13.7813266!4d121.065041!16s%2Fg%2F1tc_bsh0?entry=ttu', fbLink: 'https://www.facebook.com/Engr.Guides' },
  { id: 5, name: 'Engr. Labs', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/engrlabs.png', category: 'Supplies', discountValue: 10, location: 'Alangilan, Batangas City', discount: '10% OFF', mapsLink: 'https://www.google.com/maps/place/Alangilan,+Batangas+City,+Batangas/@13.7830168,121.0625827,16z/data=!3m1!4b1!4m6!3m5!1s0x33bd0fef93c252e9:0xcbc370e11d35fd08!8m2!3d13.7813266!4d121.065041!16s%2Fg%2F1tc_bsh0?entry=ttu', fbLink: 'https://www.facebook.com/profile.php?id=61590264975130' },
  { id: 6, name: 'CALQ Scientific Calculators', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/calq.png', category: 'Supplies', discountValue: 10, location: 'Alangilan, Batangas City', discount: '10% OFF', mapsLink: 'https://www.google.com/maps/place/Alangilan,+Batangas+City,+Batangas/@13.7830168,121.0625827,16z/data=!3m1!4b1!4m6!3m5!1s0x33bd0fef93c252e9:0xcbc370e11d35fd08!8m2!3d13.7813266!4d121.065041!16s%2Fg%2F1tc_bsh0?entry=ttu', fbLink: 'https://www.facebook.com/calqph' },
  { id: 7, name: 'Vertex Prints', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/vertexprints.png', category: 'Services', discountValue: 10, location: 'Alangilan, Batangas City', discount: '10% OFF', mapsLink: 'https://www.google.com/maps/place/Alangilan,+Batangas+City,+Batangas/@13.7830168,121.0625827,16z/data=!3m1!4b1!4m6!3m5!1s0x33bd0fef93c252e9:0xcbc370e11d35fd08!8m2!3d13.7813266!4d121.065041!16s%2Fg%2F1tc_bsh0?entry=ttu', fbLink: 'https://www.facebook.com/profile.php?id=61572044525685' },
  { id: 8, name: 'Golden Tub Laundry Shop', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/goldentub.png', category: 'Services', discountValue: 10, location: 'Lot 4 Blk 10 Neptune St., Golden Country Homes, Alangilan', discount: '₱10 OFF', mapsLink: 'https://www.google.com/maps/place/Golden+Country+Homes+Subdivision/@13.786525,121.0667317,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd0f2a86d87b97:0x300f1e2a7af8c89d!8m2!3d13.786525!4d121.069312!16s%2Fg%2F11g4hc05dn?entry=ttu', fbLink: 'https://www.facebook.com/profile.php?id=61574289908062' },
  { id: 9, name: 'InvincibiliTEA', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/inivibilitea.png', category: 'Food', discountValue: 10, location: 'Neptune St., Golden Country Homes, Alangilan', discount: '10% OFF', mapsLink: 'https://www.google.com/maps/search/Neptune+St.,+Golden+Country+Homes,+Alangilan,+Batangas+City,+Batangas,+Philippines/@13.7858731,121.070737,18z/data=!3m1!4b1?entry=ttu', fbLink: 'https://www.facebook.com/Invincibilitea' },
  { id: 10, name: 'JM 3D DESIGN', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/jm3d.png', category: 'Services', discountValue: 5, location: 'Purok Uno, Brgy. Mabini, Lipa City', discount: '5% OFF', mapsLink: 'https://www.google.com/maps/search/Purok+Uno,+Brgy.+Mabini,+Lipa+City/@13.9356662,121.0968886,13z/data=!3m1!4b1?entry=ttu', fbLink: 'https://www.facebook.com/profile.php?id=61576625156355' },
  { id: 11, name: 'Klasik Fades and Clothing', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/klasikfades.png', category: 'Services', discountValue: 10, location: 'Neptune 1, Golden Country Homes, Alangilan', discount: '₱10 OFF', mapsLink: 'https://www.google.com/maps/place/11+Neptune/@13.7853002,121.0691007,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd0f75b1cceb39:0x89648a186f57474e!8m2!3d13.7853002!4d121.071681!16s%2Fg%2F11txgwhs3_?entry=ttu', fbLink: 'https://www.facebook.com/profile.php?id=61590828577188' },
  { id: 12, name: 'LCKD IN Study Hub', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/lckdin.png', category: 'Services', discountValue: 20, location: 'Alangilan, Batangas City', discount: 'Exclusive', mapsLink: 'https://www.google.com/maps/place/LCKD+IN+Study+Hub/@13.7875922,121.0670696,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd0f00679f5679:0xe53cd5bd74705637!8m2!3d13.7875922!4d121.0696499!16s%2Fg%2F11nqxvs_wt?entry=ttu', fbLink: 'https://www.facebook.com/profile.php?id=61590333284805' },
  { id: 13, name: 'Local Hippie Crafts', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/localhippiecraft.png', category: 'Supplies', discountValue: 5, location: 'San Isidro, Sitio Gitna, Batangas City', discount: '5% OFF', mapsLink: 'https://www.google.com/maps/place/Sitio+gitna/@13.7283791,121.0739245,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd05000034871d:0x9d99d38bfe0ca24d!8m2!3d13.7283791!4d121.0765048!16s%2Fg%2F11z0wpzry5?entry=ttu', fbLink: 'https://www.facebook.com/LocalHippieCrafts.ph' },
  { id: 14, name: 'Max Mango', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/maxmango.png', category: 'Food', discountValue: 10, location: '79 C.Tirona, Poblacion, Batangas City', discount: '10% OFF', mapsLink: 'https://www.google.com/maps/search/79+C.Tirona,+Poblacion,+Batangas+City,+4200+Batangas+607+President+Jose+P.+Laurel+Hwy,+Batangas+City,+Batangas/@13.7603633,121.0578543,17z/data=!3m1!4b1?entry=ttu', fbLink: 'https://www.facebook.com/maxmangobatangascity' },
  { id: 15, name: 'Modesto’s Farm and Resort', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/modestoresort.png', category: 'Services', discountValue: 15, location: 'Sitio Sahingan, Brgy. Balete, Batangas City', discount: '15% OFF', mapsLink: 'https://www.google.com/maps/place/Modesto\'s+Farm+and+Resort/@13.8218982,121.0642072,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd0f7296051e2f:0x2162ad2bd75c5418!8m2!3d13.8218982!4d121.0667875!16s%2Fg%2F11pz8bzxpb?entry=ttu', fbLink: 'https://www.facebook.com/profile.php?id=61566439806748' },
  { id: 16, name: 'Modesto’s Pickleball', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/modestopickleball.png', category: 'Fitness', discountValue: 50, location: 'Sitio Sahingan, Brgy. Balete, Batangas City', discount: '₱50 OFF', mapsLink: 'https://www.google.com/maps/place/Modesto\'s+Farm+and+Resort/@13.8218982,121.0642072,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd0f7296051e2f:0x2162ad2bd75c5418!8m2!3d13.8218982!4d121.0667875!16s%2Fg%2F11pz8bzxpb?entry=ttu', fbLink: 'https://www.facebook.com/profile.php?id=61588577343264' },
  { id: 17, name: 'Papelia', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/papelia.png', category: 'Services', discountValue: 20, location: 'E-Commerce Business', discount: '20% OFF', mapsLink: null, fbLink: 'https://www.facebook.com/papelia.flowers' },
  { id: 18, name: 'Ta Mila’s Shawarma', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/tamilasshawarma.png', category: 'Food', discountValue: 20, location: 'Arce Subdivision, Batangas City', discount: '20% OFF', mapsLink: 'https://www.google.com/maps/place/Ta+Mila\'s+Shawarma/@13.7688263,121.0568252,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd05aaf884b1d5:0x1032c2f091d01b82!8m2!3d13.7688263!4d121.0594055!16s%2Fg%2F11s7x3ygjm?entry=ttu', fbLink: 'https://www.facebook.com/tamilasshawarma' },
  { id: 19, name: 'The Good Coffee', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/tgc.png', category: 'Food', discountValue: 10, location: 'Kumintang Ilaya, Batangas City', discount: '10% OFF', mapsLink: 'https://www.google.com/maps/place/The+Good+Coffee/@13.7666744,121.0573768,16z/data=!4m10!1m2!2m1!1sthe+good+coffee+batangas!3m6!1s0x33bd05002b29034f:0x5979144f9de6964b!8m2!3d13.7731191!4d121.0663192!15sChh0aGUgZ29vZCBjb2ZmZWUgYmF0YW5nYXNaGiIYdGhlIGdvb2QgY29mZmVlIGJhdGFuZ2FzkgELY29mZmVlX3Nob3DgAQA!16s%2Fg%2F11zfmgtgr3?entry=ttu', fbLink: 'https://www.facebook.com/thegoodcoffee.ph' },
  { id: 20, name: 'Zafira Fitness Gym', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/zafirafitnessgym.png', category: 'Fitness', discountValue: 25, location: '3rd Flr., PPG Commercial Building, National Road, Kumintang Ilaya, Batangas City', discount: '25% OFF', mapsLink: 'https://www.google.com/maps/place/Zafira+Fitness+Gym/@13.7720474,121.0630964,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd05585cc2d21f:0x655d1f52d0f4ec5f!8m2!3d13.7720474!4d121.0656767!16s%2Fg%2F11cs2w7q8f?entry=ttu', fbLink: 'https://www.facebook.com/zafirabatangascity' },
  { id: 21, name: 'Butch (Alangilan & Lipa)', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/butch.png', category: 'Silver Peak', discountValue: 10, location: 'Alangilan & Lipa City', discount: '10% OFF', mapsLink: 'https://maps.app.goo.gl/enBUigr3Di54HDCH7', fbLink: 'https://www.facebook.com/ButchRestaurant' },
  { id: 22, name: 'Hungry Hippo (Multiple Locations)', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/hungryhippo.png', category: 'Silver Peak', discountValue: 10, location: 'SM City Batangas, UB Lipa, Caltex Tanauan, KM 36 SLEX', discount: '10% OFF', mapsLink: 'https://maps.app.goo.gl/uzgNFjVUaiDQQSt18', fbLink: 'https://www.facebook.com/HungryHippoPhilippines' },
  { id: 23, name: 'Shakey’s (Multiple Locations)', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/shakeys.png', category: 'Silver Peak', discountValue: 10, location: 'Batangas, Diversion, SLEX, SM Sto. Tomas, Sto. Tomas Hi-way, Montalban', discount: '10% OFF', mapsLink: 'https://maps.app.goo.gl/c47giSmozPwpMepP9', fbLink: 'https://www.facebook.com/ShakeysBatangasCity' },
  { id: 24, name: '232 Café', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/232cafe.png', category: 'Silver Peak', discountValue: 10, location: '232 Caltex Rd, Batangas City', discount: '10% OFF', mapsLink: 'https://maps.app.goo.gl/a6tB2vJdbA76iLkS8', fbLink: 'https://www.facebook.com/232Cafe' },
  { id: 25, name: '232 Restaurant / Taco Joe’s', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/232resto.png', category: 'Silver Peak', discountValue: 10, location: '232 Caltex Rd, Batangas City', discount: '10% OFF', mapsLink: 'https://maps.app.goo.gl/ZxgTX8RezYDVeChh7', fbLink: 'https://www.facebook.com/profile.php?id=61559735818165' },
  { id: 26, name: 'South Peak', logo: 'https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/southpeaks.png', category: 'Silver Peak', discountValue: 10, location: '232 Caltex Rd, Batangas City', discount: '10% OFF', mapsLink: 'https://maps.app.goo.gl/Ax3QNhW4zJ7LABQW9', fbLink: 'https://www.facebook.com/profile.php?id=100091734310676' },
];

// --- CUSTOM CURSOR COMPONENT ---
const CustomCursor = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsTouchDevice(false);
      const moveCursor = (e) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      };
      window.addEventListener('mousemove', moveCursor);
      return () => window.removeEventListener('mousemove', moveCursor);
    }
  }, [cursorX, cursorY]);

  if (isTouchDevice) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[#39B54A] rounded-full pointer-events-none z-[100] mix-blend-screen"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[#39B54A]/50 rounded-full pointer-events-none z-[100]"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
      />
    </>
  );
};

// --- PRELOADER COMPONENT ---
const Preloader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[200] bg-[#020604] flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-24 h-24 border-4 border-[#39B54A]/20 border-t-[#39B54A] rounded-full mb-6"
      />
      <p className="text-[#39B54A] font-mono tracking-widest text-sm animate-pulse">INITIALIZING SYSTEM...</p>
    </motion.div>
  );
};

// --- MAGNETIC SHIMMER BUTTON COMPONENT ---
const MagneticShimmerButton = ({ href, onClick, children, className = '' }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - left - width / 2) / 4;
    const yPct = (e.clientY - top - height / 2) / 4;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={(e) => { playClickSound(); if(onClick) onClick(e); }}
      target={href ? "_blank" : "_self"}
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-3 bg-[#39B54A] hover:bg-[#2d913b] text-black font-bold py-3 md:py-4 px-6 md:px-10 rounded-none transition-colors duration-300 border-2 border-transparent hover:border-white ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 flex items-center gap-3">{children}</span>
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={isHovered ? { x: '100%', opacity: 1 } : { x: '-100%', opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
      />
    </motion.a>
  );
};

// --- INTERACTIVE 3D PARTNER CARD COMPONENT ---
const InteractivePartnerCard = ({ partner }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], ['15deg', '-15deg']), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], ['-15deg', '15deg']), { stiffness: 300, damping: 30 });
  const [imageError, setImageError] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set((mouseX / rect.width) - 0.5);
    y.set((mouseY / rect.height) - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
      className="glass-panel hud-corner p-4 md:p-6 flex flex-col group relative perspective-1000"
    >
      <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden border border-white/10 bg-[#0A1C14]">
        {partner.logo && !imageError ? (
          <img
            src={partner.logo}
            alt={partner.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#0A1C14] text-gray-500">
            <Store size={48} className="mb-2 opacity-50" />
            <span className="text-xs font-mono">{partner.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="w-full space-y-4 text-left flex-grow" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-start gap-3 text-sm md:text-base text-gray-300">
          <MapPin size={18} className="text-[#39B54A] mt-1 shrink-0" />
          <span className="flex-1 text-justify leading-snug">{partner.location}</span>
        </div>

        <div className="flex gap-2 w-full mt-4">
          {partner.mapsLink && (
            <a href={partner.mapsLink} target="_blank" rel="noopener noreferrer" onClick={playClickSound} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono font-bold tracking-wider rounded border border-[#39B54A]/50 text-[#39B54A] hover:bg-[#39B54A] hover:text-black transition-all duration-300 focus:ring-2 focus:ring-[#39B54A] focus:outline-none">
              <Navigation size={14} /> LOCATE
            </a>
          )}
          {partner.fbLink && (
            <a href={partner.fbLink} target="_blank" rel="noopener noreferrer" onClick={playClickSound} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono font-bold tracking-wider rounded border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all duration-300 focus:ring-2 focus:ring-[#00f0ff] focus:outline-none">
              <ExternalLink size={14} /> VISIT
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- INFINITE PARTNER MARQUEE COMPONENT ---
const PartnerMarquee = () => {
  const marqueeItems = [...partnerData, ...partnerData];
  return (
    <div className="marquee-container marquee-fade py-10 w-full bg-[#050c08]">
      <div className="animate-marquee">
        {marqueeItems.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="w-36 h-36 rounded-xl flex items-center justify-center p-2 mx-4 shrink-0 transition-all duration-300 border glass-panel border-[#39B54A]/20 hover:border-[#39B54A] overflow-hidden"
          >
            {partner.logo ? (
              <img src={partner.logo} alt={partner.name} loading="lazy" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Store className="text-gray-500 w-12 h-12" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- HOW TO USE TIMELINE COMPONENT ---
const TimelineSection = () => {
  const steps = [
    { icon: <ShoppingCart />, title: "Pre-Order", desc: "Fill out the inquiry form to secure your ID." },
    { icon: <CreditCard />, title: "Payment", desc: "Settle the payment through the provided channels." },
    { icon: <UserCheck />, title: "Claiming", desc: "Get your ID from your Block Representative." },
    { icon: <Tag />, title: "Avail", desc: "Present your ID at partner stores for discounts." }
  ];

  return (
    <section className="py-16 md:py-24 px-4 md:px-12 relative overflow-hidden bg-[#050c08]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">How to use your <span className="text-[#39B54A]">MESS ID</span></h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center relative gap-8 md:gap-0">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#39B54A]/50 to-transparent -translate-y-1/2 z-0" />
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4 px-4 group"
            >
              <div className="w-16 h-16 rounded-full bg-[#020604] border-2 border-[#39B54A] flex items-center justify-center text-[#39B54A] mb-4 group-hover:scale-110 group-hover:bg-[#39B54A] group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(57,181,74,0.3)]">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold font-mono text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- PARALLAX BACKGROUND COMPONENT ---
const ParallaxBackground = ({ onGearClick }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 100]);

  const particles = [
    { id: 1, top: '15%', left: '20%', size: '3px', color: 'bg-white', anim: 'particle-1' },
    { id: 2, top: '40%', left: '80%', size: '4px', color: 'bg-[#39B54A]', anim: 'particle-2' },
    { id: 3, top: '70%', left: '15%', size: '2px', color: 'bg-[#00f0ff]', anim: 'particle-3' },
    { id: 4, top: '25%', left: '60%', size: '5px', color: 'bg-white', anim: 'particle-1' },
    { id: 5, top: '85%', left: '45%', size: '3px', color: 'bg-[#39B54A]', anim: 'particle-2' },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#020604]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1c2e] via-[#020604] to-[#071a12]"></div>
      <div className="absolute inset-0 bg-elegant-wave opacity-80"></div>
      
      <motion.div style={{ y: y1 }} className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-[#39B54A] rounded-full blur-[120px] opacity-[0.08]"></motion.div>
      <motion.div style={{ y: y2 }} className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#00f0ff] rounded-full blur-[120px] opacity-[0.06]"></motion.div>
      
      <div className="absolute top-[-10%] left-[-20%] w-[40%] h-[150%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[25deg] blur-2xl"></div>
      
      <motion.div style={{ y: y3 }} className="absolute top-[15%] right-[15%] opacity-40 star-dotted">
        <svg width="200" height="200" viewBox="0 0 100 100" className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
          <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" fill="currentColor" />
        </svg>
      </motion.div>

      {particles.map((p) => (
        <div key={p.id} className={`absolute rounded-full ${p.color} ${p.anim} blur-[1px]`} style={{ top: p.top, left: p.left, width: p.size, height: p.size }}></div>
      ))}

      {/* EASTER EGG GEAR */}
      <div 
        onClick={() => { playClickSound(); onGearClick(); }} 
        className="absolute top-[10%] left-[5%] opacity-20 hover:opacity-60 transition-opacity cursor-pointer pointer-events-auto z-50"
        title="Secret..."
      >
        <svg className="w-48 h-48 animate-spin-slow text-[#39B54A]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/></svg>
      </div>
      
      <div className="absolute bottom-[5%] right-[5%] opacity-[0.04]">
        <svg className="w-64 h-64 animate-spin-reverse text-[#00f0ff]" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
      </div>
    </div>
  );
};

// --- INTERACTIVE ID CARD COMPONENT ---
const InteractiveIDCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['20deg', '-20deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-20deg', '20deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div
      className="relative w-full max-w-[400px] md:max-w-[500px] aspect-[1.58/1] perspective-1000 cursor-pointer group z-20 mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={() => { playClickSound(); setIsFlipped(!isFlipped); }}
    >
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="w-full h-full">
        <motion.div
          className="w-full h-full relative"
          style={{ rotateX: isFlipped ? 0 : rotateX, rotateY: isFlipped ? 180 : rotateY, transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 120, damping: 20 }}
        >
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(57,181,74,0.3)] border-2 border-[#39B54A]/50 bg-[#0A1C14]" style={{ transform: 'rotateY(0deg)', WebkitTransform: 'rotateY(0deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            <img src="https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/front-id.png" alt="MESS ID Front" className="w-full h-full object-cover z-10 relative" />
          </div>
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(57,181,74,0.3)] border-2 border-[#39B54A]/50 bg-[#0A1C14]" style={{ transform: 'rotateY(180deg)', WebkitTransform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            <img src="https://raw.githubusercontent.com/rianandrewdecastro-byte/mess-id-assets/main/back-id.png" alt="MESS ID Back" className="w-full h-full object-cover z-10 relative" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- MAIN APP ---
const MESSLandingPage = () => {
  const [activePage, setActivePage] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const subject = encodeURIComponent(`Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.open(`mailto:messpartnership.bsu@gmail.com?subject=${subject}&body=${body}`, '_blank');
    playClickSound();
    e.target.reset();
    alert('Opening email app...');
  };

  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 1500);
  };

  const filteredPartners = partnerData.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || partner.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'All' || partner.category === filterCategory;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'discount') return b.discountValue - a.discountValue;
    if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
    return 0;
  });

  const navItems = [
    { id: 'home', label: 'HOME', icon: <Home size={16} /> },
    { id: 'partners', label: 'PARTNERS', icon: <Store size={16} /> },
    { id: 'about', label: 'ABOUT', icon: <Info size={16} /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle size={16} /> },
    { id: 'contact', label: 'CONTACT', icon: <Mail size={16} /> },
  ];

  const messengerLink = "https://www.facebook.com/gabrielowen.abanico#";

  return (
    <div className={`min-h-screen bg-transparent text-white font-sans selection:bg-[#39B54A] selection:text-black relative ${isGlitching ? 'animate-glitch' : ''}`}>
      <CustomCursor />
      
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <ParallaxBackground onGearClick={triggerGlitch} />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 py-3 border-b border-[#39B54A]/20 bg-[#020604]/95 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 shrink-0">
          <img src="/mess-logo.png" alt="MESS Logo" className="h-10 md:h-14 object-contain drop-shadow-[0_0_15px_rgba(57,181,74,0.5)] cursor-pointer" onClick={() => { playClickSound(); setActivePage('home'); }} />
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-4 mx-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { playClickSound(); setActivePage(item.id); }} className={`relative flex items-center gap-2 px-4 py-2 font-mono text-sm font-bold tracking-wider transition-all duration-300 ${activePage === item.id ? 'text-[#39B54A]' : 'text-gray-400 hover:text-white'}`}>
              {item.icon} {item.label}
              {activePage === item.id && (<motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#39B54A] shadow-[0_0_10px_#39B54A]" />)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button onClick={() => { playClickSound(); setIsMuted(!isMuted); }} className="text-gray-400 hover:text-white transition-colors">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <div className="hidden md:block">
            <MagneticShimmerButton href={messengerLink} className="!py-2 !px-6 text-sm">
              INQUIRE NOW <MessageCircle size={16} />
            </MagneticShimmerButton>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white" onClick={() => { playClickSound(); setIsMobileMenuOpen(true); }}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed inset-0 z-[100] bg-[#020604]/98 backdrop-blur-xl flex flex-col items-center justify-center">
            <button className="absolute top-6 right-6 text-white" onClick={() => { playClickSound(); setIsMobileMenuOpen(false); }}>
              <X size={32} />
            </button>
            <div className="flex flex-col gap-8 text-center">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { playClickSound(); setActivePage(item.id); setIsMobileMenuOpen(false); }} className={`text-2xl font-mono font-bold tracking-widest ${activePage === item.id ? 'text-[#39B54A]' : 'text-white'}`}>
                  {item.label}
                </button>
              ))}
              <a href={messengerLink} target="_blank" rel="noopener noreferrer" onClick={playClickSound} className="mt-8 bg-[#39B54A] text-black font-bold py-4 px-8 text-lg flex items-center justify-center gap-2">
                INQUIRE NOW <MessageCircle />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-24 md:pt-32 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* HOME PAGE */}
          {activePage === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="flex-1">
              <section className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-center px-4 md:px-12 gap-10 md:gap-16 py-20 md:py-24">
                <div className="flex-1 max-w-2xl text-center lg:text-left">
                  <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-none mb-6 tracking-tighter">
                    UNLOCK YOUR <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39B54A] to-[#00f0ff] drop-shadow-[0_0_20px_rgba(57,181,74,0.4)]">ENGINEERING EDGE</span>
                  </h1>
                  <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-10 max-w-lg mx-auto lg:mx-0 font-mono border-l-0 lg:border-l-4 border-[#39B54A] pl-0 lg:pl-4 text-center lg:text-justify">
                    Your official MESS Identification Card is more than just an ID. It's your access key to exclusive privileges, academic validation, and a network of accredited partners.
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
                    <MagneticShimmerButton href={messengerLink}>
                      INQUIRE NOW <ArrowRight size={20} />
                    </MagneticShimmerButton>
                    <button onClick={() => { playClickSound(); setActivePage('partners'); }} className="border-2 border-[#39B54A]/50 hover:border-[#39B54A] hover:bg-[#39B54A]/10 text-white font-bold py-3 md:py-4 px-6 md:px-10 rounded-none transition-all duration-300 font-mono">
                      VIEW PARTNERS
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex justify-center items-center w-full mt-10 lg:mt-0">
                  <InteractiveIDCard />
                </div>
              </section>

              {/* TIMELINE SECTION */}
              <TimelineSection />

              {/* ABOUT ID SECTION */}
              <section className="py-16 md:py-24 px-4 md:px-12 bg-[#020604]/80 border-y border-[#39B54A]/20 relative">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 w-full">
                    <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
                      <Info className="text-[#00f0ff]" size={32} />
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight">WHAT IS THE <span className="text-[#39B54A]">MESS ID?</span></h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-6 font-light text-center md:text-justify">
                      The MESS Identification Card is the official organizational ID for members of the Mechanical Engineering Student Society at Batangas State University - Alangilan Campus.
                    </p>
                    <p className="text-gray-400 leading-relaxed mb-8 text-center md:text-justify text-sm md:text-base">
                      It serves as your primary proof of membership, granting you access to organization events, academic resources, and a vast network of accredited commercial partners.
                    </p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 flex justify-center mt-8 md:mt-0 w-full">
                    <div className="relative w-full max-w-[400px] aspect-square rounded-full border border-[#00f0ff]/30 flex items-center justify-center perspective-1000">
                      <div className="absolute inset-0 rounded-full border border-[#00f0ff]/50 border-dashed animate-spin-slow"></div>
                      <div className="absolute inset-6 md:inset-10 rounded-full border border-[#39B54A]/30 animate-spin-reverse"></div>
                      
                      {/* RESTORED GLOW EFFECT */}
                      <div className="absolute w-40 h-40 md:w-64 md:h-64 bg-[#00f0ff]/20 rounded-full blur-3xl animate-pulse-glow"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.img src="/mess-logo.png" alt="MESS Logo" className="w-40 md:w-56 object-contain" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: [0, 360], scale: [1, 0.98, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* RESTORED PARTNER MARQUEE SECTION */}
              <section className="py-16 md:py-24 bg-[#0A1C14]/80 border-t border-[#39B54A]/20 overflow-hidden relative">
                <div className="text-center mb-10 relative z-10 px-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-400 font-mono tracking-widest uppercase">Trusted by Our Accredited Partners</h3>
                  <p className="text-gray-500 text-xs md:text-sm text-center">Show your MESS ID to avail of exclusive discounts from these establishments.</p>
                </div>
                <PartnerMarquee />
              </section>

            </motion.div>
          )}

          {/* PARTNERS PAGE */}
          {activePage === 'partners' && (
            <motion.div key="partners" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="flex-1 px-4 md:px-12 py-8 md:py-12 max-w-7xl mx-auto w-full">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-3xl md:text-5xl font-black mb-4">ACCREDITED <span className="text-[#39B54A]">PARTNERS</span></h2>
              </div>

              {/* FILTERS & CONTROLS */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-[#0A1C14]/60 p-4 border border-[#39B54A]/20">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input type="text" placeholder="Search partners..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#020604] border border-white/10 focus:border-[#39B54A] text-white px-12 py-3 outline-none text-sm" />
                </div>
                
                <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
                  {/* Category Filter */}
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-[#020604] border border-white/10 focus:border-[#39B54A] text-white px-4 py-3 outline-none text-sm font-mono">
                    <option value="All">All Categories</option>
                    <option value="Food">Food & Beverage</option>
                    <option value="Supplies">School Supplies</option>
                    <option value="Services">Services</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Silver Peak">Silver Peak</option>
                  </select>

                  {/* Sort Dropdown */}
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#020604] border border-white/10 focus:border-[#39B54A] text-white px-4 py-3 outline-none text-sm font-mono">
                    <option value="default">Sort: Default</option>
                    <option value="discount">Sort: Highest Discount</option>
                    <option value="alphabetical">Sort: Alphabetical</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex bg-[#020604] border border-white/10 rounded overflow-hidden">
                    <button onClick={() => { playClickSound(); setViewMode('grid'); }} className={`p-3 ${viewMode === 'grid' ? 'bg-[#39B54A] text-black' : 'text-gray-400'}`}><List size={20} /></button>
                    <button onClick={() => { playClickSound(); setViewMode('map'); }} className={`p-3 ${viewMode === 'map' ? 'bg-[#39B54A] text-black' : 'text-gray-400'}`}><Map size={20} /></button>
                  </div>
                </div>
              </div>

              {/* GRID VIEW */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  <AnimatePresence>
                    {filteredPartners.map((partner) => (
                      <InteractivePartnerCard key={partner.id} partner={partner} />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* MAP VIEW */}
              {viewMode === 'map' && (
                <div className="w-full h-[500px] md:h-[700px] bg-[#050c08] rounded-xl border border-[#39B54A]/30 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBMMjAgMEg0MEwwIDQwWiIgZmlsbD0iIzM5QjU0QSIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')]"></div>
                  <div className="absolute inset-4 border border-[#39B54A]/20 rounded-full"></div>
                  <div className="absolute inset-20 border border-[#39B54A]/20 rounded-full"></div>
                  <div className="absolute inset-32 border border-[#39B54A]/20 rounded-full"></div>
                  <div className="absolute w-full h-full top-0 left-0 border-t border-[#39B54A]/20"></div>
                  <div className="absolute w-full h-full top-0 left-0 border-l border-[#39B54A]/20"></div>
                  
                  {filteredPartners.map((p, i) => (
                    <motion.a 
                      key={p.id} 
                      href={p.mapsLink || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
                      className="absolute w-4 h-4 bg-[#39B54A] rounded-full shadow-[0_0_15px_#39B54A] cursor-pointer group"
                      style={{ top: `${20 + (i * 7) % 60}%`, left: `${15 + (i * 11) % 70}%` }}
                    >
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#39B54A]/30 rounded-full animate-ping pointer-events-none"></span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 border border-[#39B54A] p-2 text-xs text-center text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        {p.name}
                      </div>
                    </motion.a>
                  ))}
                  
                  <div className="absolute bottom-4 right-4 text-xs font-mono text-[#39B54A] opacity-50">RADAR ACTIVE</div>
                </div>
              )}
            </motion.div>
          )}

          {/* ABOUT PAGE */}
          {activePage === 'about' && (
            <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="flex-1 px-4 md:px-12 py-8 md:py-12 max-w-6xl mx-auto w-full space-y-12 md:space-y-16">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-3xl md:text-5xl font-black mb-4">ABOUT <span className="text-[#39B54A]">MESS</span></h2>
                <p className="text-gray-400 font-mono text-sm md:text-base text-center">The Mechanical Engineering Student Society.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="glass-panel hud-corner p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4 text-[#00f0ff]"><Target size={32} /><h3 className="text-xl md:text-2xl font-bold font-mono text-justify">ProgMESS: Where Partnerships Shape Progress</h3></div>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base text-justify">
                    This is a flagship initiative of the Mechanical Engineering Student Society (MESS) that introduces and promotes the MESS ID as an exclusive membership card that grants students access to partner establishments, special discounts, and various privileges.
                  </p>
                </div>
                <div className="glass-panel hud-corner p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4 text-[#39B54A]"><Eye size={32} /><h3 className="text-xl md:text-2xl font-bold font-mono text-justify">OUR MISSION</h3></div>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base text-justify">
                    We aim to establish and strengthen partnerships with businesses, organizations, and institutions. Sustain and enhance the benefits of the MESS ID Program by expanding partner establishments and improving member privileges.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* FAQ PAGE */}
          {activePage === 'faq' && (
            <motion.div key="faq" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="flex-1 px-4 md:px-12 py-8 md:py-12 max-w-3xl mx-auto w-full">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-5xl font-black mb-4">FAQ & <span className="text-[#39B54A]">GUIDELINES</span></h2>
              </div>
              <div className="space-y-4 md:space-y-6">
                {[
                  { q: 'How do I claim my MESS ID?', a: 'Each Block Officer Representative will be contacted by the CSP regarding the claiming and sorting. All students may claim their MESS ID through their respective Class Representative.' },
                  { q: 'What if I lose my ID?', a: 'Report it immediately to a MESS officer. A replacement fee of ₱70 will be charged for a new card.' },
                  { q: 'How long is the validity of the ID?', a: 'The MESS ID is valid for the current academic year (2026-2027). You will need to renew it next year.' },
                  { q: 'How do partners verify my ID?', a: 'Just present the MESS ID in their establishment and it confirms your active membership status.' },
                ].map((item, index) => (
                  <details key={index} className="glass-panel group p-4 md:p-6 cursor-pointer">
                    <summary onClick={playClickSound} className="flex justify-between items-center font-bold text-base md:text-lg font-mono text-[#8aff9e] list-none">
                      {item.q}
                      <ChevronDown className="text-[#39B54A] group-open:rotate-180 transition-transform duration-300 shrink-0" />
                    </summary>
                    <p className="mt-4 text-gray-400 leading-relaxed border-t border-white/10 pt-4 text-justify text-sm md:text-base">{item.a}</p>
                  </details>
                ))}
              </div>
            </motion.div>
          )}

          {/* CONTACT PAGE */}
          {activePage === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="flex-1 px-4 md:px-12 py-8 md:py-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6 md:space-y-8">
                <h3 className="text-3xl md:text-5xl font-black mb-6 text-center lg:text-left">GET IN <span className="text-[#39B54A]">TOUCH</span></h3>
                <p className="text-gray-400 mb-6 md:mb-8 text-base md:text-lg text-center lg:text-left">Have questions about your ID, partnerships, or events? Reach out to the MESS officers.</p>
                
                <a href="https://www.facebook.com/batstateumess" target="_blank" rel="noopener noreferrer" onClick={playClickSound} className="glass-panel p-4 md:p-6 flex items-center gap-4 md:gap-6 hover:bg-[#0A1C14] transition-colors duration-300 cursor-pointer group">
                  <div className="bg-[#39B54A]/10 p-3 md:p-4 rounded-lg border border-[#39B54A]/30 group-hover:bg-[#39B54A]/20 transition-colors"><Globe className="text-[#39B54A]" size={24} /></div>
                  <div><h4 className="font-bold font-mono text-sm md:text-base">SOCIAL MEDIA</h4><p className="text-gray-400 text-xs md:text-sm">https://www.facebook.com/batstateumess</p></div>
                </a>

                <a href="mailto:messpartnership.bsu@gmail.com" onClick={playClickSound} className="glass-panel p-4 md:p-6 flex items-center gap-4 md:gap-6 hover:bg-[#0A1C14] transition-colors duration-300 cursor-pointer group">
                  <div className="bg-[#39B54A]/10 p-3 md:p-4 rounded-lg border border-[#39B54A]/30 group-hover:bg-[#39B54A]/20 transition-colors"><Mail className="text-[#39B54A]" size={24} /></div>
                  <div><h4 className="font-bold font-mono text-sm md:text-base">EMAIL</h4><p className="text-gray-400 text-xs md:text-sm">messpartnership.bsu@gmail.com</p></div>
                </a>
              </div>

              <div className="glass-panel hud-corner p-6 md:p-10">
                <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 font-mono text-[#8aff9e] text-center">SEND A MESSAGE</h3>
                <form className="space-y-4 md:space-y-6" onSubmit={handleFormSubmit}>
                  <div>
                    <label className="block text-xs md:text-sm font-mono text-gray-400 mb-2">FULL NAME</label>
                    <input type="text" name="name" required className="w-full bg-[#020604] border border-white/20 focus:border-[#39B54A] p-3 md:p-4 text-white outline-none transition-colors text-sm relative z-10" placeholder="Juan Dela Cruz" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-mono text-gray-400 mb-2">EMAIL ADDRESS</label>
                    <input type="email" name="email" required className="w-full bg-[#020604] border border-white/20 focus:border-[#39B54A] p-3 md:p-4 text-white outline-none transition-colors text-sm relative z-10" placeholder="juan@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-mono text-gray-400 mb-2">MESSAGE</label>
                    <textarea name="message" required rows="4" className="w-full bg-[#020604] border border-white/20 focus:border-[#39B54A] p-3 md:p-4 text-white outline-none transition-colors text-sm relative z-10" placeholder="Type your inquiry here..."></textarea>
                  </div>
                  <button type="submit" className="w-full font-bold py-3 md:py-4 flex items-center justify-center gap-3 transition-all duration-300 text-sm md:text-base relative z-10 bg-[#39B54A] hover:bg-[#2d913b] text-black">
                    SEND MESSAGE <Send size={20} />
                  </button>
                  <p className="text-[10px] md:text-xs text-gray-500 text-center mt-2">* Clicking this will open your default email app with the message pre-filled.</p>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t border-[#39B54A]/20 py-8 md:py-10 text-center text-gray-500 text-xs md:text-sm font-mono bg-[#020604]/95 mt-auto">
        <p>© 2026 Mechanical Engineering Student Society. All rights reserved.</p>
        <p className="mt-2 text-[10px] md:text-xs text-[#39B54A]">BATANGAS STATE UNIVERSITY - THE NATIONAL ENGINEERING UNIVERSITY</p>
      </footer>
    </div>
  );
};

export default MESSLandingPage;