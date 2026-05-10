/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  BarChart3, 
  Users, 
  Trophy,
  ArrowRight,
  Twitter,
  Youtube,
  Menu,
  X,
  Instagram,
  Facebook,
  Linkedin,
  AlertCircle,
  Edit,
  Settings,
  Lock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminPanel } from './components/AdminPanel';

import { getSupabase } from './lib/supabase';

interface Block {
  id: string;
  type: 'hero' | 'stats' | 'services' | 'vision' | 'businessCard' | 'contact' | 'text' | 'image' | 'gallery';
  content: any;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  blocks: Block[];
}

interface MenuItem {
  id: string;
  label: string;
  path: string;
  order: number;
}

interface SiteContent {
  general: {
    siteName: string;
    logoUrl: string;
    faviconUrl: string;
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
    social: {
      instagram: string;
      facebook: string;
      linkedin: string;
      twitter: string;
      youtube: string;
    };
  };
  design: {
    primaryColor: string;
    secondaryColor: string;
    menuColor: string;
    logoTextColor: string;
    logoIconColor: string;
    animations: {
      buttonHover: boolean;
      pageTransitions: boolean;
      scrollAnimations: boolean;
      speed: number;
    };
  };
  menu: MenuItem[];
  pages: Page[];
  media: { id: string; url: string; name: string }[];
}

const INITIAL_CONTENT: SiteContent = {
  general: {
    siteName: "ESM PORT",
    logoUrl: "",
    faviconUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=esm&backgroundColor=ea580c",
    seo: {
      title: "ESM PORT | Lojistik ve Taşımacılık",
      description: "Profesyonel lojistik ve konteyner taşımacılığı.",
      keywords: "lojistik, konteyner, taşımacılık, liman, antrepo"
    },
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      youtube: "https://youtube.com"
    }
  },
  design: {
    primaryColor: "#ea580c",
    secondaryColor: "#0f172a",
    menuColor: "#ffffff",
    logoTextColor: "#ffffff",
    logoIconColor: "#ea580c",
    animations: {
      buttonHover: true,
      pageTransitions: true,
      scrollAnimations: true,
      speed: 0.5
    }
  },
  menu: [
    { id: '1', label: 'Ana Sayfa', path: '/', order: 0 },
    { id: '2', label: 'Hizmetler', path: '#services', order: 1 },
    { id: '3', label: 'Vizyon', path: '#vision', order: 2 },
    { id: '4', label: 'Filomuz', path: '#gallery', order: 3 },
    { id: '5', label: 'İletişim', path: '#contact', order: 4 },
  ],
  pages: [
    {
      id: 'home',
      title: 'Ana Sayfa',
      slug: '/',
      blocks: [
        {
          id: 'b1',
          type: 'hero',
          content: {
            title: "TİCARETİN GÜCÜNÜ <span class=\"text-orange-500\">ESM PORT</span> İLE KEŞFEDİN",
            subtitle: "HIZ, GÜVEN VE ÜSTÜN HİZMET",
            description: "ESM PORT, lojistik dünyasında yeni nesil çözümler sunan öncü bir markadır. Liman ve antrepo operasyonlarınızda en güçlü ortağınız.",
            image: "input_file_1.png"
          }
        },
        {
          id: 'b2',
          type: 'stats',
          content: [
            { label: "Sevkiyat", value: "15K+", icon: "Truck" },
            { label: "Müşteri", value: "2.5K+", icon: "Users" },
            { label: "Başarı", value: "%99.9", icon: "Trophy" },
          ]
        },
        {
          id: 'b3',
          type: 'services',
          content: {
            sectionTitle: "HİZMETLERİMİZ",
            sectionHeading: "Lojistik Zincirinin Her Halkasında Yenilik",
            items: [
              { title: "Konteyner Taşıma", desc: "Liman ve antrepo noktaları arasında her boyutta konteyner taşımacılığı.", icon: "Truck", color: "bg-blue-50 text-blue-600" },
              { title: "Liman & Antrepo", desc: "Limandan antrepoya, antrepodan limana kesintisiz ve hızlı sevkiyat.", icon: "MapPin", color: "bg-orange-50 text-orange-600" },
              { title: "Depo & Fabrika", desc: "Depodan depoya veya fabrikadan depoya güvenli ürün transferi.", icon: "Clock", color: "bg-green-50 text-green-600" },
              { title: "Gümrükleme", desc: "Tüm resmi süreçlerin ve gümrük işlemlerinin profesyonel yönetimi.", icon: "ShieldCheck", color: "bg-purple-50 text-purple-600" },
            ]
          }
        },
        {
          id: 'b4',
          type: 'vision',
          content: {
            sectionTitle: "VİZYONUMUZ",
            title: "Geleceğin Standartlarını Liderlikle Kuruyoruz",
            description: "Her yükü bir emanet bilerek; zamanında, hasarsız ve sürdürülebilir yöntemlerle taşıyarak değer katıyoruz. Sektördeki yenilikleri ESM PORT güvencesiyle müşterilerimize sunuyoruz.",
            experienceYear: "25 YIL",
            image: "input_file_4.png"
          }
        },
        {
          id: 'b-gallery-auto',
          type: 'gallery',
          content: {
            sectionTitle: "FİLOMUZ",
            sectionHeading: "Gücümüz ve Ekipmanlarımız",
            images: [
              { url: "input_file_0.png", title: "Modern Tır Filosu" },
              { url: "input_file_2.png", title: "Aktif Lojistik Ağı" },
              { url: "input_file_3.png", title: "Yeni Nesil Araçlar" },
              { url: "input_file_5.png", title: "Profesyonel Bakım" },
              { url: "input_file_6.png", title: "Saha Operasyonları" },
              { url: "input_file_1.png", title: "Gece Sevkiyatları" }
            ]
          }
        },
        {
          id: 'b5',
          type: 'businessCard',
          content: {
            sectionTitle: "KURUMSAL KİMLİK",
            sectionHeading: "Dijital Kartvizitimiz",
            fullName: "Egemen Gençtürk",
            position: "Genel Müdür / Founder",
            description: "Modern logomuzun kartvizit üzerindeki izdüşümü. Güçlü, dinamik ve güvenilir."
          }
        },
        {
          id: 'b6',
          type: 'contact',
          content: {
            sectionHeading: "Yükünüz Bizimle Daima Güvende.",
            sectionDescription: "Liman ve antrepo operasyonlarınızda ESM PORT güvencesiyle 7/24 hizmetinizdeyiz. Profesyonel ekibimize dilediğiniz an ulaşabilirsiniz.",
            phone: "+90 212 555 0000",
            email: "info@esmport.com",
            address: "Lojistik Org. Bölgesi No:42, İstanbul"
          }
        }
      ]
    }
  ],
  media: []
};

// Leftovers removed - Stage 1

const IconComponent = ({ name, className }: { name: string, className?: string }) => {
  const icons: Record<string, any> = { Truck, ShieldCheck, Clock, MapPin, Globe, Phone, Mail, BarChart3, Users, Trophy };
  const Icon = (name && icons[name]) ? icons[name] : Truck;
  return <Icon className={className} />;
};



// Admin panel removed for production


const Hero = ({ content }: { content: any }) => {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 150]);
  const yText = useTransform(scrollY, [0, 500], [0, -100]);
  const bgOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div id="home" className="relative min-h-[100dvh] flex items-center overflow-hidden scroll-mt-0 flex-col justify-center">
      <motion.div style={{ y: yBg, opacity: bgOpacity }} className="absolute inset-0 z-0">
        <img 
          src={content.image} 
          alt="Hero" 
          className="w-full h-full object-cover brightness-[0.4] scale-110" 
          referrerPolicy="no-referrer" 
        />
      </motion.div>
      <motion.div 
        style={{ y: yText, opacity: textOpacity }}
        className="relative z-10 container mx-auto px-6 w-full pt-32 md:pt-40 pb-20 text-left"
      >
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} 
          className="max-w-2xl"
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block bg-primary/20 border border-primary/30 text-primary px-4 py-1 rounded-full text-[10px] sm:text-xs font-semibold mb-6 uppercase tracking-wider"
          >
            {content.subtitle}
          </motion.span>
          <h1 className="text-3xl sm:text-6xl md:text-8xl font-black text-white mb-6 leading-[1.1] font-display break-words" dangerouslySetInnerHTML={{ __html: content.title }} />
          <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-medium max-w-lg">{content.description}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#services"
              className="bg-primary hover:scale-105 text-white px-8 sm:px-10 py-3.5 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all shadow-xl shadow-primary/40 text-center"
            >
              Hizmetlerimiz
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const Stats = ({ stats, isEnabled, speed }: { stats: any[], isEnabled: boolean, speed: number }) => {
  return (
    <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial={isEnabled ? { opacity: 0, scale: 0.8, y: 30 } : {}} 
              whileInView={isEnabled ? { opacity: 1, scale: 1, y: 0 } : {}} 
              transition={isEnabled ? { delay: idx * 0.1, duration: speed, ease: [0.16, 1, 0.3, 1] } : {}} 
              viewport={{ once: true, margin: "-50px" }}
              className="group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 text-primary mb-4 md:mb-6 transition-all group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-primary/10">
                <IconComponent name={stat.icon} className="w-7 h-7 md:w-10 md:h-10" />
              </div>
              <h3 className="text-2xl xs:text-3xl md:text-5xl font-black text-slate-900 mb-1 md:mb-2 font-display tracking-tighter">{stat.value}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = ({ services, isEnabled, speed, id }: { services: any, isEnabled: boolean, speed: number, id?: string }) => {
  return (
    <section id={id || "services"} className="py-20 md:py-32 bg-white overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={isEnabled ? { opacity: 0, y: 30 } : {}}
          whileInView={isEnabled ? { opacity: 1, y: 0 } : {}}
          transition={isEnabled ? { duration: speed } : {}}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 text-center md:text-left"
        >
          <h2 className="text-primary font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4 md:mb-6">{services.sectionTitle}</h2>
          <h3 className="text-3xl md:text-6xl font-black text-slate-900 leading-tight font-display tracking-tight">{services.sectionHeading}</h3>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.items.map((service: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={isEnabled ? { opacity: 0, y: 50, scale: 0.95 } : {}}
              whileInView={isEnabled ? { opacity: 1, y: 0, scale: 1 } : {}}
              viewport={{ once: true }}
              transition={isEnabled ? { delay: idx * 0.1, duration: speed } : {}}
              whileHover={{ y: -10 }}
              className="p-6 xs:p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all group bg-white cursor-pointer relative overflow-hidden text-left"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6 bg-slate-50 text-primary`}><IconComponent name={service.icon} className="w-8 h-8" /></div>
              <h4 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors uppercase font-display tracking-tight leading-none">{service.title}</h4>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = ({ vision, isEnabled, speed, id }: { vision: any, isEnabled: boolean, speed: number, id?: string }) => (
  <section id={id || "vision"} className="py-20 md:py-32 bg-slate-900 text-white overflow-hidden scroll-mt-20">
    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
      <motion.div 
        initial={isEnabled ? { opacity: 0, x: -50 } : {}}
        whileInView={isEnabled ? { opacity: 1, x: 0 } : {}}
        viewport={{ once: true }}
        transition={isEnabled ? { duration: speed } : {}}
        className="relative"
      >
        <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl" />
        <img src={vision.image} alt="Vision" className="relative z-10 rounded-[2rem] border border-white/5" referrerPolicy="no-referrer" />
        <div className="absolute -bottom-6 -right-6 bg-primary p-4 sm:p-6 md:p-10 rounded-[1rem] sm:rounded-[1.5rem] shadow-2xl z-20">
          <h4 className="text-xl sm:text-3xl md:text-5xl font-black leading-none mb-1 text-white">{vision.experienceYear}</h4>
          <p className="text-white/80 font-bold uppercase tracking-[0.2em] text-[6px] sm:text-[10px]">Sektör Deneyimi</p>
        </div>
      </motion.div>
      <motion.div
        initial={isEnabled ? { opacity: 0, x: 50 } : {}}
        whileInView={isEnabled ? { opacity: 1, x: 0 } : {}}
        viewport={{ once: true }}
        transition={isEnabled ? { duration: speed, delay: 0.2 } : {}}
        className="text-left"
      >
        <h2 className="text-primary font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs mb-3 md:mb-6">{vision.sectionTitle}</h2>
        <h3 className="text-3xl sm:text-4xl md:text-7xl font-black mb-6 md:mb-10 font-display leading-[1.1] md:leading-[0.9] tracking-tighter">{vision.title}</h3>
        <p className="text-slate-400 mb-8 md:mb-12 leading-relaxed text-sm sm:text-base md:text-xl font-medium">{vision.description}</p>
        <div className="flex flex-col sm:flex-row gap-5 md:gap-10 items-start sm:items-center p-6 md:p-10 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 hover:bg-white/[0.08] transition-all group">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shrink-0">
            <Globe className="text-primary w-7 h-7 md:w-10 md:h-10" />
          </div>
          <div>
            <p className="font-black text-lg md:text-2xl mb-1 tracking-tight">Küresel Erişim</p>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-sm">Tüm Türkiye ve bölge ülkelerine kesintisiz, akıllı lojistik çözümleri.</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const BusinessCard = ({ biz, contact, isEnabled, speed }: { biz: any, contact: any, isEnabled: boolean, speed: number }) => {
  return (
    <section className="py-16 md:py-32 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={isEnabled ? { opacity: 0, y: 30 } : {}} 
          whileInView={isEnabled ? { opacity: 1, y: 0 } : {}} 
          viewport={{ once: true }}
          transition={isEnabled ? { duration: speed } : {}}
          className="text-center mb-10 md:mb-20"
        >
          <h2 className="text-primary font-bold uppercase tracking-widest text-[10px] md:text-sm mb-3 md:mb-4">{biz.sectionTitle}</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 font-display uppercase tracking-tight leading-tight">{biz.sectionHeading}</h3>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 md:gap-16 perspective-[3000px] w-full max-w-5xl mx-auto">
          <motion.div 
            initial={isEnabled ? { opacity: 0, rotateY: -30, x: -30 } : {}}
            whileInView={isEnabled ? { opacity: 1, rotateY: 0, x: 0 } : {}}
            viewport={{ once: true }}
            transition={isEnabled ? { duration: speed * 1.5, ease: [0.16, 1, 0.3, 1] } : {}}
            whileHover={{ scale: 1.02, rotateY: -10 }}
            className="w-full max-w-[440px] h-[200px] xs:h-[240px] sm:h-[270px] bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 xs:p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-white/5 group text-left"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center gap-3 sm:gap-5">
                <div className="p-2 sm:p-4 bg-primary rounded-xl sm:rounded-2xl shadow-xl shadow-primary/30 shrink-0">
                  <Truck className="text-white w-6 h-6 sm:w-12 sm:h-12" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl xs:text-2xl sm:text-4xl font-black tracking-tighter text-white uppercase italic leading-none whitespace-nowrap">ESM<span className="text-primary not-italic">PORT</span></span>
                  <span className="text-[7px] sm:text-[10px] font-bold text-primary/60 uppercase tracking-[0.5em] mt-1 sm:mt-2">Lojistik</span>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-3">
                <p className="text-primary font-black text-[9px] sm:text-sm uppercase tracking-[0.3em]">Liman, Antrepo & Depo</p>
                <div className="h-0.5 sm:h-1.5 w-12 sm:w-16 bg-primary rounded-full group-hover:w-24 transition-all duration-500" />
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-50" />
          </motion.div>

          <motion.div 
            initial={isEnabled ? { opacity: 0, rotateY: 30, x: 30 } : {}}
            whileInView={isEnabled ? { opacity: 1, rotateY: 0, x: 0 } : {}}
            viewport={{ once: true }}
            transition={isEnabled ? { duration: speed * 1.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] } : {}}
            whileHover={{ scale: 1.02, rotateY: 10 }}
            className="w-full max-w-[440px] h-[200px] xs:h-[240px] sm:h-[270px] bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-6 xs:p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-100 group text-left"
          >
            <div className="flex flex-col h-full justify-between relative z-10">
              <div>
                <h4 className="text-xl xs:text-2xl sm:text-3xl font-black text-slate-900 leading-none tracking-tight">{biz.fullName}</h4>
                <p className="text-primary font-bold uppercase tracking-[0.4em] text-[7px] sm:text-[10px] mt-2 sm:mt-3">{biz.position}</p>
              </div>
              <div className="space-y-1 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-4 text-slate-600 transition-colors hover:text-primary"><Phone className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /><span className="text-[10px] xs:text-xs sm:text-sm font-bold truncate">{contact.phone}</span></div>
                <div className="flex items-center gap-2 sm:gap-4 text-slate-600 transition-colors hover:text-primary"><Mail className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /><span className="text-[10px] xs:text-xs sm:text-sm font-bold truncate">{contact.email}</span></div>
              </div>
              <div className="flex justify-between items-end border-t border-slate-50 pt-2 sm:pt-4">
                <div className="flex items-center gap-2">
                  <Truck className="text-primary w-3 h-3 sm:w-5 sm:h-5" />
                  <span className="text-[8px] sm:text-xs font-black text-slate-300 uppercase tracking-widest leading-none">ESM<span className="text-primary/50">PORT</span></span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-1.5 sm:w-2.5 h-full bg-primary" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Gallery = ({ content, isEnabled, speed, id }: { content: any, isEnabled: boolean, speed: number, id?: string }) => {
  return (
    <section id={id || "gallery"} className="py-20 md:py-32 bg-white overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={isEnabled ? { opacity: 0, y: 30 } : {}}
          whileInView={isEnabled ? { opacity: 1, y: 0 } : {}}
          transition={isEnabled ? { duration: speed } : {}}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 text-center"
        >
          <h2 className="text-primary font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4">{content.sectionTitle}</h2>
          <h3 className="text-3xl md:text-6xl font-black text-slate-900 leading-tight font-display tracking-tight">{content.sectionHeading}</h3>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {content.images.map((img: any, idx: number) => (
            <motion.div
              key={idx}
              initial={isEnabled ? { opacity: 0, scale: 0.9, y: 20 } : {}}
              whileInView={isEnabled ? { opacity: 1, scale: 1, y: 0 } : {}}
              viewport={{ once: true }}
              transition={isEnabled ? { delay: idx * 0.1, duration: speed } : {}}
              className="relative group rounded-[2rem] overflow-hidden aspect-[4/3] shadow-xl"
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <p className="text-white font-black text-xl md:text-2xl tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{img.title}</p>
                <div className="w-12 h-1 bg-primary mt-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = ({ contact, isEnabled, speed, id }: { contact: any, isEnabled: boolean, speed: number, id?: string }) => (
  <section id={id || "contact"} className="py-16 md:py-24 bg-white overflow-hidden scroll-mt-20">
    <div className="container mx-auto px-6">
      <motion.div 
        initial={isEnabled ? { opacity: 0, y: 50, scale: 0.95 } : {}}
        whileInView={isEnabled ? { opacity: 1, y: 0, scale: 1 } : {}}
        viewport={{ once: true }}
        transition={isEnabled ? { duration: speed * 1.5 } : {}}
        className="bg-slate-950 rounded-[2rem] md:rounded-[4rem] p-8 sm:p-16 md:p-24 text-white flex flex-col lg:flex-row gap-10 md:gap-16 items-center relative overflow-hidden shadow-2xl"
      >
        <div className="z-10 flex-1 text-center lg:text-left">
          <h2 className="text-2xl sm:text-4xl md:text-7xl font-black mb-4 md:mb-10 font-display uppercase tracking-tighter leading-tight">{contact.sectionHeading}</h2>
          <p className="text-sm md:text-xl text-slate-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">{contact.sectionDescription}</p>
        </div>
        <div className="z-10 grid gap-4 md:gap-6 w-full md:w-auto">
          {[
            { label: 'Bizi Arayın', value: contact.phone, icon: Phone, color: 'bg-primary' },
            { label: 'E-Posta Gönderin', value: contact.email, icon: Mail, color: 'bg-slate-700' }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ x: 10 }} 
              initial={isEnabled ? { opacity: 0, x: 20 } : {}}
              whileInView={isEnabled ? { opacity: 1, x: 0 } : {}}
              viewport={{ once: true }}
              transition={isEnabled ? { delay: idx * 0.2 + 0.3, duration: speed } : {}}
              className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-all group cursor-pointer w-full md:min-w-[340px] text-left"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className={`${item.color} w-10 h-10 md:w-16 md:h-16 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6 shrink-0`}>
                  <item.icon className="w-5 h-5 md:w-8 md:h-8 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-500 text-[6px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-[0.4em] mb-1 md:mb-2 truncate">{item.label}</p>
                  <p className="text-sm sm:text-lg md:text-2xl font-black leading-none tracking-tight break-all">{item.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

export default function App() {
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [currentPath, setCurrentPath] = useState(window.location.hash || '/');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(window.location.hash === '#admin');
  const [adminTab, setAdminTab] = useState('general');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [recordId, setRecordId] = useState<any>(null);
  const { scrollYProgress } = useScroll();

  const normalizedPath = currentPath.startsWith('#') ? currentPath.substring(1) : currentPath;
  const activePage = content.pages.find(p => p.slug === normalizedPath || p.slug === '/' + normalizedPath || (p.slug === '/' && (normalizedPath === '' || normalizedPath === '/')))
    || content.pages[0];

  useEffect(() => {
    const checkLogin = () => {
      setIsAdminLoggedIn(localStorage.getItem('admin_session') === 'true');
    };
    checkLogin();
    window.addEventListener('storage', checkLogin);
    // Also check on hash change since AdminPanel might set it
    const handleHashChange = () => {
      const hash = window.location.hash || '/';
      setCurrentPath(hash);
      setIsAdminOpen(hash === '#admin');
      checkLogin();
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('storage', checkLogin);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Update Title and Favicon
    if (content.general.seo.title) {
      document.title = content.general.seo.title;
    }
    
    if (content.general.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = content.general.faviconUrl;
    }

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.getElementsByTagName('head')[0].appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', content.general.seo.description);

  }, [content.general.seo.title, content.general.seo.description, content.general.faviconUrl]);

  useEffect(() => {
    const handleScroll = () => {
      // Find all blocks on the current page to track
      const blocks = activePage?.blocks || [];
      const sections = blocks.map(b => b.type);
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePage]);

  const openAdmin = (tab = 'general') => {
    setAdminTab(tab);
    setIsAdminOpen(true);
    window.location.hash = '#admin';
  };

  // Live repair function to ensure structure
  const repairContent = (c: any) => {
    if (!c) return INITIAL_CONTENT;
    const repaired = {
      ...INITIAL_CONTENT,
      ...c,
      general: { ...INITIAL_CONTENT.general, ...(c.general || {}) },
      design: { ...INITIAL_CONTENT.design, ...(c.design || {}) },
      pages: (c.pages && Array.isArray(c.pages) && c.pages.length > 0) ? c.pages : INITIAL_CONTENT.pages,
      menu: (c.menu && Array.isArray(c.menu) && c.menu.length > 0) ? c.menu : INITIAL_CONTENT.menu
    };

    // Deep check for blocks in the home page
    if (repaired.pages[0] && (!repaired.pages[0].blocks || !Array.isArray(repaired.pages[0].blocks) || repaired.pages[0].blocks.length < 2)) {
      console.log("Repairing missing blocks for home page...");
      repaired.pages[0].blocks = JSON.parse(JSON.stringify(INITIAL_CONTENT.pages[0].blocks));
    }

    return repaired;
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const supabase = getSupabase();
        if (!supabase) {
          setIsLoading(false);
          return;
        }

        console.log("Fetching site content from Supabase...");
        const { data, error, status } = await supabase
          .from('site_content')
          .select('id, content')
          .maybeSingle(); 
        
        if (error) {
          console.error("Supabase fetch error (Status: " + status + "):", error);
          throw error;
        }

        if (data) {
          console.log("Data fetched from Supabase, ID:", data.id);
          setRecordId(data.id);
          if (data.content) {
            setContent(repairContent(data.content));
          }
        } else {
          console.log("No data found in 'site_content' table (empty results).");
        }
      } catch (err) {
        console.log("Supabase fetch info:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Safety timeout: stop loading after 5 seconds no matter what
    const timeout = setTimeout(() => setIsLoading(false), 5000);
    
    fetchContent();
    
    return () => clearTimeout(timeout);
  }, []);

  const handleSaveContent = async (newContent: any) => {
    setIsAdminOpen(false);
    try {
      const supabase = getSupabase();
      if (!supabase) return;

      const finalizedContent = repairContent(newContent);
      
      let res;
      if (recordId) {
        res = await supabase
          .from('site_content')
          .update({ content: finalizedContent })
          .eq('id', recordId);
      } else {
        res = await supabase
          .from('site_content')
          .insert({ content: finalizedContent })
          .select()
          .maybeSingle();
        
        if (res.data) setRecordId(res.data.id);
      }

      if (res.error) throw res.error;
      
      setContent(finalizedContent);
      console.log("Content saved successfully!");
    } catch (err) {
      console.error("Error saving content:", err);
      alert("Değişiklikler kaydedilemedi. Lütfen Supabase Storage ve Database yapılandırmasını kontrol edin.");
    }
  };

  const handleResetContent = async () => {
    if (window.confirm('Tüm site verileri ilk haline (3 saat önceki verilere) döndürülecek. Bu işlem geri alınamaz. Emin misiniz?')) {
      await handleSaveContent(INITIAL_CONTENT);
      window.location.reload();
    }
  };

  // Sync design variables
  useEffect(() => {
    if (isLoading) return;
    document.documentElement.style.setProperty('--primary', content.design.primaryColor);
    document.documentElement.style.setProperty('--primary-rgb', hexToRgb(content.design.primaryColor));
    
    // SEO Meta Tags
    document.title = content.general.seo.title;
    
    const updateMetaTag = (name: string, contentValue: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    updateMetaTag('description', content.general.seo.description);
    updateMetaTag('keywords', content.general.seo.keywords);
    
    // Favicon support
    const faviconUrl = content.general.faviconUrl || 'https://api.dicebear.com/7.x/shapes/svg?seed=esm&backgroundColor=ea580c';
    if (true) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.id = 'dynamic-favicon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;
      
      if (faviconUrl.includes('image/png')) link.type = 'image/png';
      else if (faviconUrl.includes('image/x-icon') || faviconUrl.endsWith('.ico')) link.type = 'image/x-icon';
      else if (faviconUrl.includes('image/svg+xml') || faviconUrl.endsWith('.svg')) link.type = 'image/svg+xml';
    }
  }, [content, isLoading]);

  useEffect(() => {
    if (!isLoading && window.location.hash && window.location.hash !== '#admin') {
      const hash = window.location.hash;
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full shadow-[0_0_20px_rgba(234,88,12,0.3)]"
        />
      </div>
    );
  }

  const renderBlock = (block: Block) => {
    const isEnabled = content.design.animations.scrollAnimations;
    const speed = content.design.animations.speed;

    // Helper to get animation props
    const animProps = (delay = 0, y = 30) => isEnabled ? {
      initial: { opacity: 0, y },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-100px" },
      transition: { duration: speed, delay, ease: [0.16, 1, 0.3, 1] }
    } : {};

    switch (block.type) {
      case 'hero':
        return <Hero content={block.content} />;
      case 'stats':
        return <Stats stats={block.content} isEnabled={isEnabled} speed={speed} />;
      case 'services':
        return <Services services={block.content} isEnabled={isEnabled} speed={speed} id={block.type} />;
      case 'vision':
        return <About vision={block.content} isEnabled={isEnabled} speed={speed} id={block.type} />;
      case 'gallery':
        return <Gallery content={block.content} isEnabled={isEnabled} speed={speed} id={block.type} />;
      case 'businessCard':
        return <BusinessCard biz={block.content} contact={activePage.blocks.find(b => b.type === 'contact')?.content || content.pages[0].blocks.find(b => b.type === 'contact')?.content} isEnabled={isEnabled} speed={speed} />;
      case 'contact':
        return <Contact contact={block.content} isEnabled={isEnabled} speed={speed} id={block.type} />;
      case 'text':
        return (
          <section className="py-20 min-h-[300px] flex items-center bg-white overflow-hidden">
            <div className="container mx-auto px-6">
              <motion.div 
                {...animProps()}
                className="prose prose-slate max-w-4xl mx-auto text-lg leading-relaxed text-slate-600" 
                dangerouslySetInnerHTML={{ __html: block.content.text }} 
              />
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-orange-600 selection:text-white bg-white">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-orange-600 z-[200] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      
      {isAdminOpen && (
        <AdminPanel 
          initialContent={content} 
          onSave={handleSaveContent} 
          onChange={(newContent) => setContent(newContent)}
          onReset={handleResetContent}
          onClose={() => {
            setIsAdminOpen(false);
            window.location.hash = '/';
            setIsAdminLoggedIn(localStorage.getItem('admin_session') === 'true');
          }} 
          defaultTab={adminTab}
        />
      )}
      {/* Navigation */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 backdrop-blur-xl border-b border-white/10 bg-slate-900/60`}>
        <div className="container mx-auto px-6 h-16 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 group cursor-pointer" onClick={() => window.location.hash = '/'}>
            <div 
              style={{ backgroundColor: content.design.logoIconColor }}
              className="w-8 h-8 md:w-12 md:h-12 text-white rounded-lg md:rounded-2xl flex items-center justify-center transform group-hover:rotate-[360deg] transition-all duration-700 shadow-xl overflow-hidden shrink-0"
            >
              {content.general.logoUrl ? (
                <img src={content.general.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Truck className="w-4 h-4 md:w-7 md:h-7" />
              )}
            </div>
            <span 
              style={{ color: content.design.logoTextColor }} 
              className="text-sm xs:text-base md:text-2xl font-black tracking-widest uppercase truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none"
            >
              {content.general.siteName}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-12">
            {content.menu.sort((a,b) => a.order - b.order).map(item => (
              <a 
                key={item.id}
                href={item.path} 
                style={{ color: content.design.menuColor }}
                className="text-[10px] font-black hover:text-orange-500 transition-all tracking-[0.3em] uppercase relative group"
              >
                {item.label}
                <span 
                  style={{ backgroundColor: content.design.primaryColor }}
                  className={`absolute -bottom-2 left-0 h-[2px] transition-all ${
                    activeSection === item.path.replace('#', '') || (activeSection === 'home' && item.path === '/') 
                    ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`}
                ></span>
              </a>
            ))}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-11 h-11 bg-orange-600/10 text-orange-600 border border-orange-600/20 rounded-xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-lg active:scale-95"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center p-6 text-center"
          >
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="absolute top-6 right-6 w-12 h-12 bg-white/5 text-white rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all border border-white/10 shadow-xl"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="flex flex-col gap-6 w-full max-w-xs">
              {content.menu.map((item, idx) => (
                <motion.a 
                  key={item.id}
                  href={item.path} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ color: content.design.menuColor }}
                  className="text-4xl sm:text-6xl font-black hover:text-orange-600 transition-all tracking-tighter uppercase italic"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Content */}
      <main>
        {activePage.blocks.map((block) => (
          <div key={block.id} className="scroll-mt-24 relative" id={block.type}>
            {renderBlock(block)}
          </div>
        ))}
      </main>

      {/* Admin management through #admin route only */}

      {/* Dynamic Footer */}
      <footer className="bg-slate-950 py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-orange-600/50 to-transparent" />
        
        <motion.div 
          initial={content.design.animations.scrollAnimations ? { opacity: 0, y: 30 } : {}}
          whileInView={content.design.animations.scrollAnimations ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: content.design.animations.speed }}
          className="container mx-auto px-6 space-y-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
            <div className="space-y-6">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.hash = '/'}>
                <div 
                  style={{ backgroundColor: content.design.logoIconColor }}
                  className="w-12 h-12 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-orange-900/20 overflow-hidden"
                >
                  {content.general.logoUrl ? (
                    <img src={content.general.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Truck className="w-6 h-6" />
                  )}
                </div>
                <span 
                  style={{ color: content.design.logoTextColor }}
                  className="text-2xl font-black tracking-widest uppercase"
                >
                  {content.general.siteName}
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Sektörün öncü lojistik çözümleri ile limandan antrepoya, fabrikadan depoya güvenilir taşımacılık.
              </p>
              <div className="flex gap-3">
                {content.general.social?.instagram && (
                  <a href={content.general.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all border border-white/10 text-slate-400 hover:text-white cursor-pointer group">
                    <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                )}
                {content.general.social?.facebook && (
                  <a href={content.general.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all border border-white/10 text-slate-400 hover:text-white cursor-pointer group">
                    <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                )}
                {content.general.social?.linkedin && (
                  <a href={content.general.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all border border-white/10 text-slate-400 hover:text-white cursor-pointer group">
                    <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                )}
                {content.general.social?.twitter && (
                  <a href={content.general.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all border border-white/10 text-slate-400 hover:text-white cursor-pointer group">
                    <Twitter className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                )}
                {content.general.social?.youtube && (
                  <a href={content.general.social.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all border border-white/10 text-slate-400 hover:text-white cursor-pointer group">
                    <Youtube className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-black text-xs uppercase tracking-widest border-l-4 border-orange-600 pl-3">HIZLI MENÜ</h4>
              <div className="grid gap-3">
                {[...content.menu].sort((a, b) => a.order - b.order).map(item => (
                  <a 
                    key={item.id} 
                    href={item.path} 
                    onClick={(e) => {
                      if (item.path.startsWith('#')) {
                        e.preventDefault();
                        const id = item.path.substring(1);
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                          window.history.pushState(null, '', item.path);
                        }
                      }
                    }}
                    className="text-slate-500 hover:text-orange-500 text-sm font-bold transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-slate-800 rounded-full group-hover:bg-orange-600 transition-colors" />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">© 2026 {content.general.siteName} LOJİSTİK. TÜM HAKLARI SAKLIDIR.</p>
            <div className="flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
               <a href="#" className="hover:text-orange-500 transition-colors">Gizlilik</a>
               <a href="#" className="hover:text-orange-500 transition-colors">KVKK</a>
               <a href="#" className="hover:text-orange-500 transition-colors">İletişim</a>
               <a href="#admin" className="opacity-10 hover:opacity-100 transition-opacity ml-4 border-l border-white/5 pl-4 flex items-center italic text-slate-600">
                 <Lock className="w-2 h-2" />
               </a>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
