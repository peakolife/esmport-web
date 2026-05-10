import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Image as LuImage, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  LogOut, 
  Lock,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  Settings,
  Layout,
  Briefcase,
  Contact as ContactIcon,
  Eye,
  Menu as MenuIcon,
  BarChart3,
  Award,
  IdCard,
  X
} from 'lucide-react';
import { getSupabase, uploadImage } from '../lib/supabase';

interface AdminPanelProps {
  initialContent: any;
  onSave: (newContent: any) => Promise<void>;
  onChange?: (newContent: any) => void;
  onReset: () => Promise<void>;
  onClose: () => void;
  defaultTab?: string;
}

const BLOCK_TEMPLATES: Record<string, any> = {
  hero: {
    type: 'hero',
    content: {
      title: 'TİCARETİN GÜCÜNÜ <span class="text-orange-500">ESM PORT</span> İLE KEŞFEDİN',
      subtitle: 'HIZ, GÜVEN VE ÜSTÜN HİZMET',
      description: 'Yeni nesil lojistik çözümleri.',
      image: 'input_file_1.png'
    }
  },
  stats: {
    type: 'stats',
    content: [
      { label: 'Sevkiyat', value: '10K+', icon: 'Truck' },
      { label: 'Müşteri', value: '1K+', icon: 'Users' }
    ]
  },
  services: {
    type: 'services',
    content: {
      sectionTitle: 'HİZMETLERİMİZ',
      sectionHeading: 'Size Özel Çözümler',
      items: [
        { title: 'Yeni Hizmet', desc: 'Hizmet açıklaması.', icon: 'Truck', color: 'bg-orange-50 text-orange-600' }
      ]
    }
  },
  vision: {
    type: 'vision',
    content: {
      sectionTitle: 'VİZYONUMUZ',
      title: 'Geleceği Taşıyoruz',
      description: 'Vizyon açıklaması buraya gelecek.',
      experienceYear: '20 YIL',
      image: 'input_file_4.png'
    }
  },
  businessCard: {
    type: 'businessCard',
    content: {
      sectionTitle: 'İLETİŞİM',
      sectionHeading: 'Kartvizitimiz',
      fullName: 'Ad Soyad',
      position: 'Ünvan',
      description: 'Kısa açıklama.'
    }
  },
  gallery: {
    type: 'gallery',
    content: {
      sectionTitle: 'GALERİ',
      sectionHeading: 'Görseller',
      images: [
        { url: 'input_file_0.png', title: 'Görsel 1' }
      ]
    }
  },
  contact: {
    type: 'contact',
    content: {
      sectionHeading: 'Bize Ulaşın',
      sectionDescription: 'İletişim açıklaması.',
      phone: '+90 000 000 00 00',
      email: 'info@site.com',
      address: 'Adres bilgisi'
    }
  }
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ initialContent, onSave, onChange, onReset, onClose, defaultTab }) => {
  const [content, setContent] = useState(initialContent);

  // Sync internal state if initialContent changes (e.g. after fetch completes)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Notify parent of changes for real-time preview
  useEffect(() => {
    if (onChange) onChange(content);
  }, [content, onChange]);
  const [activeTab, setActiveTab] = useState(defaultTab || 'general');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Simple session check (using localStorage for this "special password" implementation)
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'esmport2025') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_session', 'true');
      setLoginError('');
    } else {
      setLoginError('Hatalı şifre.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_session');
  };

  const addSection = (type: string) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const template = BLOCK_TEMPLATES[type];
    if (!template) return;
    
    // Add unique ID
    const newBlock = {
      ...template,
      id: `b-${Date.now()}`
    };
    
    newContent.pages[0].blocks.push(newBlock);
    setContent(newContent);
  };

  const deleteSection = (type: string) => {
    if (!window.confirm(`${type.toUpperCase()} bölümünü silmek istediğinize emin misiniz?`)) return;
    const newContent = JSON.parse(JSON.stringify(content));
    newContent.pages[0].blocks = newContent.pages[0].blocks.filter((b: any) => b.type !== type);
    setContent(newContent);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await onSave(content);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateNestedField = (path: string[], value: any) => {
    const newContent = JSON.parse(JSON.stringify(content));
    let current = newContent;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setContent(newContent);
  };

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (path: string[], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic file size check (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Dosya boyutu çok büyük (max 10MB).");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(file);
      if (url) {
        updateNestedField(path, url);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      let message = "Görsel yüklenemedi.";
      if (err.message && err.message.includes('bucket_not_found')) {
        message = "Supabase 'assets' bucket bulunamadı. Lütfen Supabase panelinden 'assets' adında bir public bucket oluşturun.";
      } else if (err.message && err.message.includes('New policies')) {
        message = "Supabase saklama alanı (storage) izinleri (RLS) yetersiz.";
      } else if (err.status === 403 || err.statusCode === "403") {
        message = "Supabase Storage: Erişim engellendi (403). Bucket'ın 'Public' olduğundan ve RLS politikalarının 'INSERT' izni verdiğinden emin olun.";
      }
      setUploadError(message);
      setSaveStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-[100] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">Yönetici Girişi</h2>
          <p className="text-slate-400 text-center mb-8 text-sm">Site içeriğini yönetmek için giriş yapın.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Özel Şifre</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-mono"
                placeholder="••••••••"
                required
              />
              {loginError && <p className="text-red-500 text-xs mt-2">{loginError}</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-600/20"
            >
              Giriş Yap
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="w-full text-slate-500 hover:text-slate-300 text-sm transition-colors py-2"
            >
              Siteye Dön
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col z-[100] text-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-bold text-lg hidden sm:block">ESM PORT Yönetim Paneli</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-orange-600/20"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Kaydediliyor...' : 'Yayınla / Kaydet'}
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            title="Siteyi Gör"
          >
            <Eye className="w-5 h-5 text-slate-400" />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
            title="Çıkış"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/30 overflow-y-auto shrink-0 hidden lg:block">
          <nav className="p-4 space-y-1">
            <SidebarLink icon={<Settings />} label="Genel Ayarlar" active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
            <SidebarLink icon={<Layout />} label="Giriş Bölümü (Hero)" active={activeTab === 'hero'} onClick={() => setActiveTab('hero')} />
            <SidebarLink icon={<Briefcase />} label="Hizmetlerimiz" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
            <SidebarLink icon={<BarChart3 />} label="İstatistikler" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
            <SidebarLink icon={<Award />} label="Vizyonumuz" active={activeTab === 'vision'} onClick={() => setActiveTab('vision')} />
            <SidebarLink icon={<IdCard />} label="Kartvizit" active={activeTab === 'bizcard'} onClick={() => setActiveTab('bizcard')} />
            <SidebarLink icon={<MenuIcon />} label="Menü Yönetimi" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
            <SidebarLink icon={<LuImage />} label="Galeri" active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
            <SidebarLink icon={<ContactIcon />} label="İletişim" active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} />
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950 relative">
          {/* Floating Save Button for Mobile */}
          <div className="fixed bottom-6 right-6 z-[110] lg:hidden">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white p-4 rounded-full shadow-2xl shadow-orange-600/40 transition-all active:scale-95"
            >
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            </button>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 pb-32">
            <AnimatePresence mode="wait">
              {saveStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 p-3 rounded-lg flex items-center gap-3 text-sm font-medium"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Değişiklikler başarıyla yayınlandı!
                </motion.div>
              )}
              {uploadError && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-lg flex items-center gap-3 text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  {uploadError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* General Settings */}
            {activeTab === 'general' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold">Genel Bilgiler</h2>
                </div>
                <div className="grid gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <InputField 
                    label="Site Adı" 
                    value={content.general.siteName} 
                    onChange={(val) => updateNestedField(['general', 'siteName'], val)} 
                  />
                  <ImageUploadField 
                    label="Site Logosu (URL veya Yükle)" 
                    value={content.general.logoUrl} 
                    onUpload={(e) => handleFileUpload(['general', 'logoUrl'], e)}
                    onUrlChange={(val) => updateNestedField(['general', 'logoUrl'], val)}
                    isUploading={isUploading}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField 
                      label="SEO Başlık" 
                      value={content.general.seo.title} 
                      onChange={(val) => updateNestedField(['general', 'seo', 'title'], val)} 
                    />
                    <InputField 
                      label="SEO Anahtar Kelimeler" 
                      value={content.general.seo.keywords} 
                      onChange={(val) => updateNestedField(['general', 'seo', 'keywords'], val)} 
                    />
                  </div>
                  <TextAreaField 
                    label="SEO Açıklama" 
                    value={content.general.seo.description} 
                    onChange={(val) => updateNestedField(['general', 'seo', 'description'], val)} 
                  />
                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Sosyal Medya Linkleri</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField 
                        label="Instagram" 
                        value={content.general.social.instagram} 
                        onChange={(val) => updateNestedField(['general', 'social', 'instagram'], val)} 
                      />
                      <InputField 
                        label="LinkedIn" 
                        value={content.general.social.linkedin} 
                        onChange={(val) => updateNestedField(['general', 'social', 'linkedin'], val)} 
                      />
                      <InputField 
                        label="Twitter (X)" 
                        value={content.general.social.twitter} 
                        onChange={(val) => updateNestedField(['general', 'social', 'twitter'], val)} 
                      />
                      <InputField 
                        label="YouTube" 
                        value={content.general.social.youtube} 
                        onChange={(val) => updateNestedField(['general', 'social', 'youtube'], val)} 
                      />
                    </div>
                  </div>
                  <ImageUploadField 
                    label="Favicon URL (Tarayıcı İkonu)" 
                    value={content.general.faviconUrl} 
                    onUpload={(e) => handleFileUpload(['general', 'faviconUrl'], e)}
                    onUrlChange={(val) => updateNestedField(['general', 'faviconUrl'], val)}
                    isUploading={isUploading}
                  />
                  
                  <div className="pt-8 border-t border-red-500/20 mt-4">
                    <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/20">
                      <div className="flex items-center gap-3 mb-3 text-red-500">
                        <XCircle className="w-5 h-5" />
                        <h3 className="font-bold">Tehlikeli Bölge</h3>
                      </div>
                      <p className="text-slate-400 text-sm mb-6">
                        Tüm site içeriğini ve ayarlarını varsayılan (fabrika ayarlarına) döndürür. 
                        Bu işlem 3 saat önceki ilk kurulum verilerini geri getirir.
                      </p>
                      <button 
                        onClick={onReset}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-600/20"
                      >
                        <Trash2 className="w-4 h-4" />
                        VERİLERİ SIFIRLA (3 SAAT ÖNCEYE DÖN)
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Hero Section */}
            {activeTab === 'hero' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">Giriş Bölümü (Hero)</h2>
                  </div>
                  {content.pages[0].blocks.find((b: any) => b.type === 'hero') ? (
                    <button 
                      onClick={() => deleteSection('hero')}
                      className="flex items-center gap-2 text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> Bölümü Sil
                    </button>
                  ) : (
                    <button 
                      onClick={() => addSection('hero')}
                      className="flex items-center gap-2 text-xs bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                    >
                      <Plus className="w-4 h-4" /> Bölümü Ekle
                    </button>
                  )}
                </div>
                {content.pages[0].blocks.find((b: any) => b.type === 'hero') ? (
                  <div className="grid gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <InputField 
                      label="Ana Başlık" 
                      value={content.pages[0].blocks.find((b: any) => b.type === 'hero').content.title} 
                      onChange={(val) => {
                        const newPages = JSON.parse(JSON.stringify(content.pages));
                        const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'hero');
                        if (blockIndex !== -1) {
                          newPages[0].blocks[blockIndex].content.title = val;
                          setContent((prev: any) => ({...prev, pages: newPages}));
                        }
                      }} 
                    />
                    <TextAreaField 
                      label="Alt Metin" 
                      value={content.pages[0].blocks.find((b: any) => b.type === 'hero').content.subtitle} 
                      onChange={(val) => {
                        const newPages = JSON.parse(JSON.stringify(content.pages));
                        const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'hero');
                        if (blockIndex !== -1) {
                          newPages[0].blocks[blockIndex].content.subtitle = val;
                          setContent((prev: any) => ({...prev, pages: newPages}));
                        }
                      }} 
                    />
                    <ImageUploadField 
                      label="Arka Plan Görseli" 
                      value={content.pages[0].blocks.find((b: any) => b.type === 'hero').content.image} 
                      onUpload={(e) => {
                        const blockIndex = content.pages[0].blocks.findIndex((b: any) => b.type === 'hero');
                        if (blockIndex !== -1) {
                          handleFileUpload(['pages', '0', 'blocks', blockIndex.toString(), 'content', 'image'], e);
                        }
                      }}
                      onUrlChange={(val) => {
                        const newPages = JSON.parse(JSON.stringify(content.pages));
                        const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'hero');
                        if (blockIndex !== -1) {
                          newPages[0].blocks[blockIndex].content.image = val;
                          setContent((prev: any) => ({...prev, pages: newPages}));
                        }
                      }}
                      isUploading={isUploading}
                    />
                  </div>
                ) : (
                  <div className="bg-slate-900/50 p-12 rounded-2xl border border-slate-800 border-dashed text-center">
                    <p className="text-slate-400 text-sm mb-4">Giriş bölümü (Hero) şu anda sitede aktif değil.</p>
                    <button 
                      onClick={() => addSection('hero')}
                      className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-600/20"
                    >
                      <Plus className="w-5 h-5" /> ŞİMDİ EKLE
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Services */}
            {activeTab === 'services' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">Hizmetlerimiz</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {content.pages[0].blocks.find((b: any) => b.type === 'services') ? (
                      <>
                        <button 
                          onClick={() => deleteSection('services')}
                          className="flex items-center gap-2 text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" /> Bölümü Sil
                        </button>
                        <button 
                          onClick={() => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'services');
                            if (blockIndex === -1) return;
                            
                            if (!newContent.pages[0].blocks[blockIndex].content.items) {
                              newContent.pages[0].blocks[blockIndex].content.items = [];
                            }
                            
                            newContent.pages[0].blocks[blockIndex].content.items.push({
                              title: 'Yeni Hizmet',
                              desc: 'Hizmet açıklamasını buraya yazın.',
                              icon: 'Truck',
                              color: 'bg-orange-50 text-orange-600'
                            });
                            setContent(newContent);
                          }}
                          className="flex items-center gap-2 text-sm bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                        >
                          <Plus className="w-4 h-4" /> Hizmet Ekle
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => addSection('services')}
                        className="flex items-center gap-2 text-xs bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                      >
                        <Plus className="w-4 h-4" /> Bölümü Ekle
                      </button>
                    )}
                  </div>
                </div>
                {content.pages[0].blocks.find((b: any) => b.type === 'services') ? (
                  <div className="space-y-4">
                    {(() => {
                      const servicesBlock = content.pages[0].blocks.find((b: any) => b.type === 'services');
                      return servicesBlock?.content?.items?.map((item: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-orange-500 uppercase">Hizmet #{idx + 1}</span>
                            <button 
                              onClick={() => {
                                const newContent = JSON.parse(JSON.stringify(content));
                                const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'services');
                                if (blockIndex !== -1) {
                                  newContent.pages[0].blocks[blockIndex].content.items.splice(idx, 1);
                                  setContent(newContent);
                                }
                              }}
                              className="text-red-500 hover:text-red-400 p-1"
                              title="Hizmeti Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <InputField 
                            label="Hizmet Adı" 
                            value={item.title} 
                            onChange={(val) => {
                              const newContent = JSON.parse(JSON.stringify(content));
                              const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'services');
                              if (blockIndex !== -1) {
                                newContent.pages[0].blocks[blockIndex].content.items[idx].title = val;
                                setContent(newContent);
                              }
                            }} 
                          />
                          <TextAreaField 
                            label="Açıklama" 
                            value={item.desc} 
                            onChange={(val) => {
                              const newContent = JSON.parse(JSON.stringify(content));
                              const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'services');
                              if (blockIndex !== -1) {
                                newContent.pages[0].blocks[blockIndex].content.items[idx].desc = val;
                                setContent(newContent);
                              }
                            }} 
                          />
                        </div>
                      ));
                    })()}
                  </div>
                ) : (
                  <div className="bg-slate-900/50 p-12 rounded-2xl border border-slate-800 border-dashed text-center">
                    <p className="text-slate-400 text-sm mb-4">Hizmetler bölümü şu anda sitede aktif değil.</p>
                    <button 
                      onClick={() => addSection('services')}
                      className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-600/20"
                    >
                      <Plus className="w-5 h-5" /> ŞİMDİ EKLE
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Stats Management */}
            {activeTab === 'stats' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">Site İstatistikleri</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {content.pages[0].blocks.find((b: any) => b.type === 'stats') ? (
                      <>
                        <button 
                          onClick={() => deleteSection('stats')}
                          className="flex items-center gap-2 text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" /> Bölümü Sil
                        </button>
                        <button 
                          onClick={() => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'stats');
                            if (blockIndex === -1) return;
                            
                            newContent.pages[0].blocks[blockIndex].content.push({
                              label: 'Yeni Bilgi',
                              value: '0',
                              icon: 'Truck'
                            });
                            setContent(newContent);
                          }}
                          className="flex items-center gap-2 text-sm bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                        >
                          <Plus className="w-4 h-4" /> İstatistik Ekle
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => addSection('stats')}
                        className="flex items-center gap-2 text-xs bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                      >
                        <Plus className="w-4 h-4" /> Bölümü Ekle
                      </button>
                    )}
                  </div>
                </div>
                {content.pages[0].blocks.find((b: any) => b.type === 'stats') ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(() => {
                      const statsBlock = content.pages[0].blocks.find((b: any) => b.type === 'stats');
                      return statsBlock?.content?.map((stat: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-orange-500 uppercase">İstatistik #{idx + 1}</span>
                            <button 
                              onClick={() => {
                                const newContent = JSON.parse(JSON.stringify(content));
                                const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'stats');
                                if (blockIndex !== -1) {
                                  newContent.pages[0].blocks[blockIndex].content.splice(idx, 1);
                                  setContent(newContent);
                                }
                              }}
                              className="text-red-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <InputField 
                            label="Etiket" 
                            value={stat.label} 
                            onChange={(val) => {
                              const newContent = JSON.parse(JSON.stringify(content));
                              const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'stats');
                              if (blockIndex !== -1) {
                                newContent.pages[0].blocks[blockIndex].content[idx].label = val;
                                setContent(newContent);
                              }
                            }} 
                          />
                          <InputField 
                            label="Değer" 
                            value={stat.value} 
                            onChange={(val) => {
                              const newContent = JSON.parse(JSON.stringify(content));
                              const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'stats');
                              if (blockIndex !== -1) {
                                newContent.pages[0].blocks[blockIndex].content[idx].value = val;
                                setContent(newContent);
                              }
                            }} 
                          />
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">İkon (Lucide)</label>
                            <select 
                              value={stat.icon}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(content));
                                const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'stats');
                                if (blockIndex !== -1) {
                                  newContent.pages[0].blocks[blockIndex].content[idx].icon = e.target.value;
                                  setContent(newContent);
                                }
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm"
                            >
                              <option value="Truck">Kamyon (Truck)</option>
                              <option value="Users">Kullanıcılar (Users)</option>
                              <option value="Trophy">Kupa (Trophy)</option>
                              <option value="BarChart3">Grafik (BarChart3)</option>
                              <option value="MapPin">Konum (MapPin)</option>
                              <option value="ShieldCheck">Güvenlik (ShieldCheck)</option>
                            </select>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                ) : (
                  <div className="bg-slate-900/50 p-12 rounded-2xl border border-slate-800 border-dashed text-center">
                    <p className="text-slate-400 text-sm mb-4">İstatistikler bölümü şu anda sitede aktif değil.</p>
                    <button 
                      onClick={() => addSection('stats')}
                      className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-600/20"
                    >
                      <Plus className="w-5 h-5" /> ŞİMDİ EKLE
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Vision Management */}
            {activeTab === 'vision' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">Vizyon ve Deneyim</h2>
                  </div>
                  {content.pages[0].blocks.find((b: any) => b.type === 'vision') ? (
                    <button 
                      onClick={() => deleteSection('vision')}
                      className="flex items-center gap-2 text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> Bölümü Sil
                    </button>
                  ) : (
                    <button 
                      onClick={() => addSection('vision')}
                      className="flex items-center gap-2 text-xs bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                    >
                      <Plus className="w-4 h-4" /> Bölümü Ekle
                    </button>
                  )}
                </div>
                {(() => {
                  const visionBlock = content.pages[0].blocks.find((b: any) => b.type === 'vision');
                  if (!visionBlock) return (
                    <div className="bg-slate-900/50 p-12 rounded-2xl border border-slate-800 border-dashed text-center">
                      <p className="text-slate-400 text-sm mb-4">Vizyon bölümü şu anda sitede aktif değil.</p>
                      <button 
                        onClick={() => addSection('vision')}
                        className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-600/20"
                      >
                        <Plus className="w-5 h-5" /> ŞİMDİ EKLE
                      </button>
                    </div>
                  );
                  const idx = content.pages[0].blocks.findIndex((b: any) => b.type === 'vision');
                  
                  return (
                    <div className="grid gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                      <InputField 
                        label="Üst Başlık" 
                        value={visionBlock.content.sectionTitle} 
                        onChange={(val) => {
                          const newPages = JSON.parse(JSON.stringify(content.pages));
                          newPages[0].blocks[idx].content.sectionTitle = val;
                          setContent((prev: any) => ({...prev, pages: newPages}));
                        }} 
                      />
                      <InputField 
                        label="Ana Başlık" 
                        value={visionBlock.content.title} 
                        onChange={(val) => {
                          const newPages = JSON.parse(JSON.stringify(content.pages));
                          newPages[0].blocks[idx].content.title = val;
                          setContent((prev: any) => ({...prev, pages: newPages}));
                        }} 
                      />
                      <TextAreaField 
                        label="Açıklama" 
                        value={visionBlock.content.description} 
                        onChange={(val) => {
                          const newPages = JSON.parse(JSON.stringify(content.pages));
                          newPages[0].blocks[idx].content.description = val;
                          setContent((prev: any) => ({...prev, pages: newPages}));
                        }} 
                      />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <InputField 
                          label="Deneyim Yılı" 
                          value={visionBlock.content.experienceYear} 
                          onChange={(val) => {
                            const newPages = JSON.parse(JSON.stringify(content.pages));
                            newPages[0].blocks[idx].content.experienceYear = val;
                            setContent((prev: any) => ({...prev, pages: newPages}));
                          }} 
                        />
                        <ImageUploadField 
                          label="Vizyon Görseli" 
                          value={visionBlock.content.image} 
                          onUpload={(e) => handleFileUpload(['pages', '0', 'blocks', idx.toString(), 'content', 'image'], e)}
                          onUrlChange={(val) => {
                            const newPages = JSON.parse(JSON.stringify(content.pages));
                            newPages[0].blocks[idx].content.image = val;
                            setContent((prev: any) => ({...prev, pages: newPages}));
                          }}
                          isUploading={isUploading}
                        />
                      </div>
                    </div>
                  );
                })()}
              </section>
            )}

            {/* Business Card Management */}
            {activeTab === 'bizcard' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IdCard className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">Dijital Kartvizit Ayarları</h2>
                  </div>
                  {content.pages[0].blocks.find((b: any) => b.type === 'businessCard') ? (
                    <button 
                      onClick={() => deleteSection('businessCard')}
                      className="flex items-center gap-2 text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> Bölümü Sil
                    </button>
                  ) : (
                    <button 
                      onClick={() => addSection('businessCard')}
                      className="flex items-center gap-2 text-xs bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                    >
                      <Plus className="w-4 h-4" /> Bölümü Ekle
                    </button>
                  )}
                </div>
                {(() => {
                  const bizBlock = content.pages[0].blocks.find((b: any) => b.type === 'businessCard');
                  if (!bizBlock) return (
                    <div className="bg-slate-900/50 p-12 rounded-2xl border border-slate-800 border-dashed text-center">
                      <p className="text-slate-400 text-sm mb-4">Dijital kartvizit bölümü şu anda sitede aktif değil.</p>
                      <button 
                        onClick={() => addSection('businessCard')}
                        className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-600/20"
                      >
                        <Plus className="w-5 h-5" /> ŞİMDİ EKLE
                      </button>
                    </div>
                  );
                  const idx = content.pages[0].blocks.findIndex((b: any) => b.type === 'businessCard');
                  
                  return (
                    <div className="grid gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                      <div className="grid md:grid-cols-2 gap-4">
                        <InputField 
                          label="Ad Soyad" 
                          value={bizBlock.content.fullName} 
                          onChange={(val) => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'businessCard');
                            if (blockIndex !== -1) {
                              newContent.pages[0].blocks[blockIndex].content.fullName = val;
                              setContent(newContent);
                            }
                          }} 
                        />
                        <InputField 
                          label="Pozisyon / Ünvan" 
                          value={bizBlock.content.position} 
                          onChange={(val) => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'businessCard');
                            if (blockIndex !== -1) {
                              newContent.pages[0].blocks[blockIndex].content.position = val;
                              setContent(newContent);
                            }
                          }} 
                        />
                      </div>
                      <TextAreaField 
                        label="Kısa Açıklama" 
                        value={bizBlock.content.description} 
                        onChange={(val) => {
                          const newContent = JSON.parse(JSON.stringify(content));
                          const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'businessCard');
                          if (blockIndex !== -1) {
                            newContent.pages[0].blocks[blockIndex].content.description = val;
                            setContent(newContent);
                          }
                        }} 
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <InputField 
                          label="Bölüm Üst Başlığı" 
                          value={bizBlock.content.sectionTitle} 
                          onChange={(val) => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'businessCard');
                            if (blockIndex !== -1) {
                              newContent.pages[0].blocks[blockIndex].content.sectionTitle = val;
                              setContent(newContent);
                            }
                          }} 
                        />
                        <InputField 
                          label="Bölüm Ana Başlığı" 
                          value={bizBlock.content.sectionHeading} 
                          onChange={(val) => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'businessCard');
                            if (blockIndex !== -1) {
                              newContent.pages[0].blocks[blockIndex].content.sectionHeading = val;
                              setContent(newContent);
                            }
                          }} 
                        />
                      </div>
                    </div>
                  );
                })()}
              </section>
            )}

            {/* Menu Management */}
            {activeTab === 'menu' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MenuIcon className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">Menü Yönetimi</h2>
                  </div>
                  <button 
                    onClick={() => {
                      const newContent = JSON.parse(JSON.stringify(content));
                      const maxId = newContent.menu.length > 0 
                        ? Math.max(...newContent.menu.map((m: any) => parseInt(m.id) || 0)) 
                        : 0;
                      const nextId = (maxId + 1).toString();
                      
                      newContent.menu.push({
                        id: nextId,
                        label: 'Yeni Menü',
                        path: '#',
                        order: newContent.menu.length
                      });
                      setContent(newContent);
                    }}
                    className="flex items-center gap-2 text-sm bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                  >
                    <Plus className="w-4 h-4" /> Menü Ekle
                  </button>
                </div>
                <div className="space-y-4">
                  {[...content.menu].sort((a, b) => a.order - b.order).map((item: any, idx: number) => (
                    <div key={item.id} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-orange-500 uppercase">Menü Öğesi #{idx + 1}</span>
                        <button 
                          onClick={() => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            newContent.menu = newContent.menu.filter((m: any) => m.id !== item.id);
                            setContent(newContent);
                          }}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <InputField 
                          label="Etiket" 
                          value={item.label} 
                          onChange={(val) => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const menuIdx = newContent.menu.findIndex((m: any) => m.id === item.id);
                            if (menuIdx !== -1) {
                              newContent.menu[menuIdx].label = val;
                              setContent(newContent);
                            }
                          }} 
                        />
                        <InputField 
                          label="Link (Path)" 
                          value={item.path} 
                          onChange={(val) => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const menuIdx = newContent.menu.findIndex((m: any) => m.id === item.id);
                            if (menuIdx !== -1) {
                              newContent.menu[menuIdx].path = val;
                              setContent(newContent);
                            }
                          }} 
                        />
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Sıra</label>
                          <input 
                            type="number" 
                            value={item.order}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content));
                              const menuIdx = newContent.menu.findIndex((m: any) => m.id === item.id);
                              if (menuIdx !== -1) {
                                newContent.menu[menuIdx].order = parseInt(e.target.value) || 0;
                                setContent(newContent);
                              }
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {activeTab === 'gallery' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <LuImage className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">Galeri Görselleri</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {content.pages[0].blocks.find((b: any) => b.type === 'gallery') ? (
                      <>
                        <button 
                          onClick={() => deleteSection('gallery')}
                          className="flex items-center gap-2 text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" /> Bölümü Sil
                        </button>
                        <button 
                          onClick={() => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'gallery');
                            if (blockIndex !== -1) {
                              newContent.pages[0].blocks[blockIndex].content.images.push({
                                url: 'input_file_0.png',
                                title: 'Yeni Görsel'
                              });
                              setContent(newContent);
                            }
                          }}
                          className="flex items-center gap-2 text-sm bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                        >
                          <Plus className="w-4 h-4" /> Görsel Ekle
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => addSection('gallery')}
                        className="flex items-center gap-2 text-xs bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                      >
                        <Plus className="w-4 h-4" /> Bölümü Ekle
                      </button>
                    )}
                  </div>
                </div>
                {content.pages[0].blocks.find((b: any) => b.type === 'gallery') ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(() => {
                      const galleryBlock = content.pages[0].blocks.find((b: any) => b.type === 'gallery');
                      return galleryBlock?.content?.images?.map((img: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 space-y-4">
                          <div className="relative aspect-video rounded-lg overflow-hidden group">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <label className="cursor-pointer bg-white text-slate-950 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2">
                                <Upload className="w-3.5 h-3.5" />
                                Değiştir
                               <input 
                                  type="file" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const blockIndex = content.pages[0].blocks.findIndex((b: any) => b.type === 'gallery');
                                    if (blockIndex !== -1) {
                                      handleFileUpload(['pages', '0', 'blocks', blockIndex.toString(), 'content', 'images', idx.toString(), 'url'], e);
                                    }
                                  }}
                                />
                              </label>
                              <button 
                                onClick={() => {
                                  const newContent = JSON.parse(JSON.stringify(content));
                                  const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'gallery');
                                  if (blockIndex !== -1) {
                                    newContent.pages[0].blocks[blockIndex].content.images.splice(idx, 1);
                                    setContent(newContent);
                                  }
                                }}
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <InputField 
                            label="Görsel Başlığı" 
                            value={img.title} 
                            onChange={(val) => {
                              const newContent = JSON.parse(JSON.stringify(content));
                              const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'gallery');
                              if (blockIndex !== -1) {
                                newContent.pages[0].blocks[blockIndex].content.images[idx].title = val;
                                setContent(newContent);
                              }
                            }}
                          />
                        </div>
                      ));
                    })()}
                  </div>
                ) : (
                  <div className="bg-slate-900/50 p-12 rounded-2xl border border-slate-800 border-dashed text-center">
                    <p className="text-slate-400 text-sm mb-4">Galeri bölümü şu anda sitede aktif değil.</p>
                    <button 
                      onClick={() => addSection('gallery')}
                      className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-600/20"
                    >
                      <Plus className="w-5 h-5" /> ŞİMDİ EKLE
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Contact */}
            {activeTab === 'contact' && (() => {
              const contactBlock = content.pages[0].blocks.find((b: any) => b.type === 'contact');
              
              return (
                <section className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ContactIcon className="w-5 h-5 text-orange-500" />
                      <h2 className="text-xl font-bold">İletişim Bilgileri</h2>
                    </div>
                    {contactBlock ? (
                      <button 
                        onClick={() => deleteSection('contact')}
                        className="flex items-center gap-2 text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" /> Bölümü Sil
                      </button>
                    ) : (
                      <button 
                        onClick={() => addSection('contact')}
                        className="flex items-center gap-2 text-xs bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                      >
                        <Plus className="w-4 h-4" /> Bölümü Ekle
                      </button>
                    )}
                  </div>
                  {contactBlock ? (
                    <div className="grid gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                      <div className="grid md:grid-cols-2 gap-4">
                        <InputField 
                          label="Telefon" 
                          value={contactBlock.content.phone || ''} 
                          onChange={(val) => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'contact');
                            if (blockIndex !== -1) {
                              newContent.pages[0].blocks[blockIndex].content.phone = val;
                              setContent(newContent);
                            }
                          }} 
                        />
                        <InputField 
                          label="E-posta" 
                          value={contactBlock.content.email || ''} 
                          onChange={(val) => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'contact');
                            if (blockIndex !== -1) {
                              newContent.pages[0].blocks[blockIndex].content.email = val;
                              setContent(newContent);
                            }
                          }} 
                        />
                      </div>
                      <TextAreaField 
                        label="Adres" 
                        value={contactBlock.content.address || ''} 
                        onChange={(val) => {
                          const newContent = JSON.parse(JSON.stringify(content));
                          const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'contact');
                          if (blockIndex !== -1) {
                            newContent.pages[0].blocks[blockIndex].content.address = val;
                            setContent(newContent);
                          }
                        }} 
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <InputField 
                          label="Instagram" 
                          value={contactBlock.content.socials?.instagram || ''} 
                          onChange={(val) => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'contact');
                            if (blockIndex !== -1) {
                              if (!newContent.pages[0].blocks[blockIndex].content.socials) newContent.pages[0].blocks[blockIndex].content.socials = {};
                              newContent.pages[0].blocks[blockIndex].content.socials.instagram = val;
                              setContent(newContent);
                            }
                          }} 
                        />
                        <InputField 
                          label="LinkedIn" 
                          value={contactBlock.content.socials?.linkedin || ''} 
                          onChange={(val) => {
                            const newContent = JSON.parse(JSON.stringify(content));
                            const blockIndex = newContent.pages[0].blocks.findIndex((b: any) => b.type === 'contact');
                            if (blockIndex !== -1) {
                              if (!newContent.pages[0].blocks[blockIndex].content.socials) newContent.pages[0].blocks[blockIndex].content.socials = {};
                              newContent.pages[0].blocks[blockIndex].content.socials.linkedin = val;
                              setContent(newContent);
                            }
                          }} 
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900/50 p-12 rounded-2xl border border-slate-800 border-dashed text-center">
                      <p className="text-slate-400 text-sm mb-4">İletişim bölümü şu anda sitede aktif değil.</p>
                      <button 
                        onClick={() => addSection('contact')}
                        className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-600/20"
                      >
                        <Plus className="w-5 h-5" /> ŞİMDİ EKLE
                      </button>
                    </div>
                  )}
                </section>
              );
            })()}
            {/* Form Footer Save Button */}
            <div className="pt-10 border-t border-slate-800 mt-10">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-orange-600/20"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                {isSaving ? 'Değişiklikler Kaydediliyor...' : 'YAPILAN DEĞİŞİKLİKLERİ KAYDET'}
              </button>
              <p className="text-center text-slate-500 text-sm mt-4">
                Değişikliklerin sitede görünmesi için bu butona basmanız gerekmektedir.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* Helper Components */

const SidebarLink = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      active 
        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    {React.cloneElement(icon, { size: 18 })}
    {label}
  </button>
);

const InputField = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <textarea 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm resize-none"
    />
  </div>
);

const ImageUploadField = ({ label, value, onUpload, onUrlChange, isUploading }: { label: string, value: string, onUpload: (e: any) => void, onUrlChange: (val: string) => void, isUploading: boolean }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="flex gap-4">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
        {value ? <img src={value} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><LuImage className="w-6 h-6 text-slate-800" /></div>}
      </div>
      <div className="flex-1 space-y-2">
        <input 
          type="text" 
          value={value}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Görsel URL veya yükleyin"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
        />
        <label className="inline-flex items-center gap-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg cursor-pointer transition-all">
          {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          {isUploading ? 'Yükleniyor...' : 'Görsel Yükle'}
          <input type="file" className="hidden" onChange={onUpload} accept="image/*" disabled={isUploading} />
        </label>
      </div>
    </div>
  </div>
);
