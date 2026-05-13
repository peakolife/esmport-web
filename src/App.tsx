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
  Lock,
  Zap,
  HelpCircle,
  MessageSquare,
  Star,
  ArrowUp,
  Award,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
// AdminPanel and Supabase imports removed for static version

interface Block {
  id: string;
  type: 'hero' | 'stats' | 'services' | 'vision' | 'businessCard' | 'contact' | 'text' | 'image' | 'gallery' | 'features' | 'testimonials' | 'faq';
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
  // --- YEREL GÖRSEL YÜKLEME REHBERİ ---
  // 1. Bilgisayarınızdaki resmi projenin 'public' klasörüne atın.
  // 2. Koddaki tırnak içine '/dosya-adi.png' yazın (Örn: logoUrl: "/logo.png").
  // 3. Favicon için de aynı yöntemi izleyin (Örn: faviconUrl: "/favicon.ico").
  general: {
    siteName: "ESM PORT",
    logoUrl: "/src/img/logo.svg", // Buraya /logo.png yazabilirsiniz
    faviconUrl: "/src/img/logo.svg", // Buraya /favicon.ico yazabilirsiniz
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
            image: "/src/img/hero.png"
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
            image: "/src/img/vision.png"
          }
        },
        {
          id: 'b-gallery-auto',
          type: 'gallery',
          content: {
            sectionTitle: "FİLOMUZ",
            sectionHeading: "Gücümüz ve Ekipmanlarımız",
            images: [
              { url: "/src/img/truck3.jpg", title: "Modern Tır Filosu" },
              { url: "/src/img/truck1.jpg", title: "Aktif Lojistik Ağı" },
              { url: "/src/img/truck4.jpg", title: "Yeni Nesil Araçlar" },
              { url: "/src/img/truck2.jpg", title: "Profesyonel Bakım" },
              { url: "/src/img/truck5.jpg", title: "Saha Operasyonları" },
              { url: "/src/img/truck3.jpg", title: "Gece Sevkiyatları" }
            ]
          }
        },
        {
          id: 'b6',
          type: 'contact',
          content: {
            sectionHeading: "Yükünüz Bizimle Daima Güvende.",
            sectionDescription: "Liman ve antrepo operasyonlarınızda ESM PORT güvencesiyle 7/24 hizmetinizdeyiz. Profesyonel ekibimize dilediğiniz an ulaşabilirsiniz.",
            phone: "+90 532 523 53 55",
            email: "info@esmport.com",
            address: "Adnan Menderes Mh. İnönü Blv. No: 36 A Akdeniz/MERSİN"
          }
        }
      ]
    }
  ],
  media: []
};

// Leftovers removed - Stage 1

const IconComponent = ({ name, className }: { name: string, className?: string }) => {
  const icons: Record<string, any> = { 
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
    Zap,
    Lock,
    Star,
    Award,
    HelpCircle,
    MessageSquare
  };
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
            className="inline-block bg-primary text-white border border-primary/30 px-6 py-2 rounded-full text-[10px] sm:text-xs font-black mb-6 uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
          >
            {content.subtitle}
          </motion.span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 leading-[1.2] md:leading-[1.1] font-display break-words" dangerouslySetInnerHTML={{ __html: content.title }} />
          <p className="text-sm sm:text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-medium max-w-lg">{content.description}</p>
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
    <section className="py-12 md:py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial={isEnabled ? { opacity: 0, scale: 0.8, y: 30 } : {}} 
              whileInView={isEnabled ? { opacity: 1, scale: 1, y: 0 } : {}} 
              transition={isEnabled ? { delay: idx * 0.1, duration: speed, ease: [0.16, 1, 0.3, 1] } : {}} 
              viewport={{ once: true, margin: "-50px" }}
              className="group flex flex-col items-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-white rounded-xl md:rounded-3xl shadow-xl shadow-slate-200/50 text-primary mb-3 md:mb-6 transition-all group-hover:scale-110 group-hover:-rotate-6">
                <IconComponent name={stat.icon} className="w-6 h-6 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-5xl font-black text-slate-900 mb-1 md:mb-2 font-display tracking-tighter">{stat.value}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">{stat.label}</p>
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
          <h3 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.2] md:leading-tight font-display tracking-tight">{services.sectionHeading}</h3>
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
        <h3 className="text-3xl sm:text-4xl md:text-7xl font-black mb-6 md:mb-10 font-display leading-[1.2] md:leading-[0.9] tracking-tighter">{vision.title}</h3>
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
          <h3 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.2] md:leading-tight font-display tracking-tight">{content.sectionHeading}</h3>
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

const Features = ({ content, isEnabled, speed, id }: { content: any; isEnabled: boolean; speed: number; id?: string }) => {
  const animProps = (delay = 0) => isEnabled ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: speed, delay }
  } : {};

  return (
    <section id={id} className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="text-left">
            <motion.span {...animProps()} className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs block mb-4 md:mb-6">
              {content.sectionTitle}
            </motion.span>
            <motion.h2 {...animProps(0.1)} className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.2] md:leading-tight mb-8 font-display tracking-tight">
              {content.sectionHeading}
            </motion.h2>
            <div className="space-y-6">
              {content.items.map((item: any, idx: number) => (
                <motion.div key={idx} {...animProps(0.2 + idx * 0.1)} className="flex gap-4 md:gap-6 group">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary text-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    {item.icon === 'Zap' ? <Zap className="w-6 h-6 md:w-8 md:h-8" /> : <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-2xl font-black text-slate-900 mb-1 md:mb-2 font-display uppercase tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div {...animProps(0.3)} className="relative">
             <div className="aspect-square bg-primary/5 rounded-[2rem] md:rounded-[4rem] absolute -inset-4 md:-inset-10 rotate-6" />
             <div className="aspect-square bg-slate-900 rounded-[2rem] md:rounded-[4rem] flex items-center justify-center relative overflow-hidden shadow-2xl border border-white/5">
                <Truck className="w-24 h-24 md:w-48 md:h-48 text-primary opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = ({ content, isEnabled, speed, id }: { content: any; isEnabled: boolean; speed: number; id?: string }) => {
  return (
    <section id={id} className="py-20 md:py-32 bg-slate-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs block mb-4 md:mb-6">
            {content.sectionTitle}
          </span>
          <h2 className="text-3xl md:text-6xl font-black leading-[1.2] md:leading-tight font-display tracking-tight">
            {content.sectionHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {content.items.map((item: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={isEnabled ? { opacity: 0, y: 30 } : {}}
              whileInView={isEnabled ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: true }}
              transition={{ duration: speed, delay: idx * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] hover:bg-white/10 transition-colors group text-left"
            >
              <div className="flex gap-1 text-primary mb-6 md:mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-300 leading-relaxed text-sm md:text-lg font-medium italic mb-8 md:mb-10">
                "{item.comment}"
              </p>
              <div className="flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-slate-800 border-2 border-primary shrink-0 transition-transform group-hover:scale-110">
                  <img src={item.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + item.name} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div>
                  <h4 className="font-black text-white text-base md:text-xl tracking-tight">{item.name}</h4>
                  <p className="text-[8px] md:text-[10px] text-primary font-black tracking-widest uppercase mt-1">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = ({ content, isEnabled, speed, id }: { content: any; isEnabled: boolean; speed: number; id?: string }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id={id} className="py-20 md:py-32 bg-white scroll-mt-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs block mb-4 md:mb-6">
            {content.sectionTitle}
          </span>
          <h2 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.2] md:leading-tight font-display tracking-tight">
            {content.sectionHeading}
          </h2>
        </div>

        <div className="space-y-4 md:space-y-6">
          {content.items.map((item: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={isEnabled ? { opacity: 0, x: -20 } : {}}
              whileInView={isEnabled ? { opacity: 1, x: 0 } : {}}
              viewport={{ once: true }}
              transition={{ duration: speed, delay: idx * 0.1 }}
              className="border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-slate-50/30 hover:shadow-xl hover:shadow-slate-200/20 transition-all"
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left transition-colors group"
              >
                <span className="font-black text-slate-900 text-base md:text-2xl tracking-tight uppercase font-display leading-tight">{item.question}</span>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all bg-white border border-slate-100 text-primary shadow-sm group-hover:scale-110 ${openIdx === idx ? 'bg-primary text-white rotate-180 shadow-primary/20' : ''}`}>
                  <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 md:p-8 pt-0 text-slate-500 leading-relaxed text-sm md:text-lg font-medium border-t border-slate-100/50">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
          <h2 className="text-2xl sm:text-4xl md:text-7xl font-black mb-4 md:mb-10 font-display uppercase tracking-tighter leading-[1.2] md:leading-tight">{contact.sectionHeading}</h2>
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
  const [content] = useState<SiteContent>(INITIAL_CONTENT);
  const [currentPath, setCurrentPath] = useState(window.location.hash || '/');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const normalizedPath = currentPath.startsWith('#') ? currentPath.substring(1) : currentPath;
  const activePage = content.pages.find(p => p.slug === normalizedPath || p.slug === '/' + normalizedPath || (p.slug === '/' && (normalizedPath === '' || normalizedPath === '/')))
    || content.pages[0];

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '/';
      setCurrentPath(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Dynamic styles sync
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
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.id = 'dynamic-favicon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = faviconUrl;
  }, [content]);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

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
      case 'features':
        return <Features content={block.content} isEnabled={isEnabled} speed={speed} id={block.type} />;
      case 'testimonials':
        return <Testimonials content={block.content} isEnabled={isEnabled} speed={speed} id={block.type} />;
      case 'faq':
        return <FAQ content={block.content} isEnabled={isEnabled} speed={speed} id={block.type} />;
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
      
      {/* Admin Panel and Scroll to Top removed for static version */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 bg-primary text-white p-4 rounded-2xl shadow-2xl transition-all hover:scale-110 active:scale-95 ${window.scrollY > 500 ? 'opacity-100' : 'opacity-0 h-0 w-0 overflow-hidden'}`}
      >
        <ArrowUp className="w-6 h-6" />
      </button>

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
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
