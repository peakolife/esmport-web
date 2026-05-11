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
  X,
  MessageSquare,
  HelpCircle,
  Zap
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
      title: 'BAŞLIK BURAYA <span class="text-orange-500">GELECEK</span>',
      subtitle: 'ALT BAŞLIK',
      description: 'Açıklama metni buraya gelecek.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80'
    }
  },
  stats: {
    type: 'stats',
    content: [
      { label: 'Başarı', value: '100%', icon: 'Trophy' },
      { label: 'Tecrübe', value: '10 Yıl', icon: 'Clock' }
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
  features: {
    type: 'features',
    content: {
      sectionTitle: 'ÖZELLİKLERİMİZ',
      sectionHeading: 'Neden Biz?',
      items: [
        { title: 'Hızlı Teslimat', desc: 'Ürünlerinizi zamanında ulaştırıyoruz.', icon: 'Zap' },
        { title: 'Güvenli Taşıma', desc: 'Eşyalarınız bizimle güvende.', icon: 'Lock' }
      ]
    }
  },
  testimonials: {
    type: 'testimonials',
    content: {
      sectionTitle: 'MÜŞTERİ YORUMLARI',
      sectionHeading: 'Hakkımızda Ne Dediler?',
      items: [
        { name: 'Ahmet Yılmaz', role: 'Şirket Sahibi', comment: 'Harika bir deneyimdi, çok teşekkürler.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80' }
      ]
    }
  },
  faq: {
    type: 'faq',
    content: {
      sectionTitle: 'S.S.S',
      sectionHeading: 'Sıkça Sorulan Sorular',
      items: [
        { question: 'Nasıl teklif alabilirim?', answer: 'İletişim formunu doldurarak veya bizi arayarak teklif alabilirsiniz.' }
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
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80'
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
        { url: 'https://images.unsplash.com/photo-1519003722824-191d440bd502?auto=format&fit=crop&q=80', title: 'Görsel 1' }
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
  },
  text: {
    type: 'text',
    content: {
      text: '<h2>Yeni Metin Bölümü</h2><p>Buraya istediğiniz HTML veya metin içeriğini girebilirsiniz.</p>'
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
  const [selectedPageId, setSelectedPageId] = useState(content?.pages?.[0]?.id || 'home');

  // Safety: Ensure selectedPageId is valid if pages change
  useEffect(() => {
    if (content?.pages && !content.pages.find((p: any) => p.id === selectedPageId)) {
      if (content.pages.length > 0) {
        setSelectedPageId(content.pages[0].id);
      }
    }
  }, [content?.pages, selectedPageId]);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
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

  const addSection = (type: string, pageId: string) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const template = BLOCK_TEMPLATES[type];
    if (!template) return;
    
    const pageIndex = newContent.pages.findIndex((p: any) => p.id === pageId);
    if (pageIndex === -1) return;

    // Add unique ID
    const newBlock = {
      ...template,
      id: `b-${Date.now()}`
    };
    
    newContent.pages[pageIndex].blocks.push(newBlock);
    setContent(newContent);
    setEditingBlockId(newBlock.id);
  };

  const deleteSection = (blockId: string, pageId: string) => {
    if (!window.confirm(`Bu bölümü silmek istediğinize emin misiniz?`)) return;
    const newContent = JSON.parse(JSON.stringify(content));
    const pageIndex = newContent.pages.findIndex((p: any) => p.id === pageId);
    if (pageIndex === -1) return;
    
    newContent.pages[pageIndex].blocks = newContent.pages[pageIndex].blocks.filter((b: any) => b.id !== blockId);
    setContent(newContent);
    if (editingBlockId === blockId) setEditingBlockId(null);
  };

  const moveSection = (blockId: string, pageId: string, direction: 'up' | 'down') => {
    const newContent = JSON.parse(JSON.stringify(content));
    const pageIndex = newContent.pages.findIndex((p: any) => p.id === pageId);
    if (pageIndex === -1) return;
    
    const blocks = newContent.pages[pageIndex].blocks;
    const index = blocks.findIndex((b: any) => b.id === blockId);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
    } else if (direction === 'down' && index < blocks.length - 1) {
      [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
    }
    
    setContent(newContent);
  };

  const addPage = () => {
    const title = window.prompt("Sayfa Başlığı:");
    if (!title) return;
    const slug = "/" + title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    
    const newContent = JSON.parse(JSON.stringify(content));
    const newPage = {
      id: `p-${Date.now()}`,
      title,
      slug,
      blocks: [
        { ...BLOCK_TEMPLATES.hero, id: `b-${Date.now()}-1` },
        { ...BLOCK_TEMPLATES.contact, id: `b-${Date.now()}-2` }
      ]
    };
    
    newContent.pages.push(newPage);
    setContent(newContent);
    setSelectedPageId(newPage.id);
    setActiveTab('editor');
  };

  const deletePage = (pageId: string) => {
    if (pageId === 'home') {
      alert("Ana sayfa silinemez.");
      return;
    }
    if (!window.confirm("Bu sayfayı ve içindeki tüm bölümleri silmek istediğinize emin misiniz?")) return;
    
    const newContent = JSON.parse(JSON.stringify(content));
    newContent.pages = newContent.pages.filter((p: any) => p.id !== pageId);
    
    // Also remove from menu if exists
    const pageSlug = content.pages.find((p: any) => p.id === pageId)?.slug;
    if (pageSlug) {
      newContent.menu = newContent.menu.filter((m: any) => m.path !== pageSlug);
    }

    setContent(newContent);
    setSelectedPageId('home');
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
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">SİTE YÖNETİMİ</h3>
            <nav className="space-y-1">
              <SidebarLink icon={<Settings />} label="Genel Ayarlar" active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
              <SidebarLink icon={<Layout />} label="Sayfa Yönetimi" active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} />
              <SidebarLink icon={<MenuIcon />} label="Menü Linkleri" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
              <SidebarLink icon={<BarChart3 />} label="Tasarım & Renkler" active={activeTab === 'design'} onClick={() => setActiveTab('design')} />
            </nav>
          </div>
          <div className="p-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">İÇERİK DÜZENLEYİCİ</h3>
            <nav className="space-y-1">
              <SidebarLink icon={<Eye />} label="Canlı Düzenleyici" active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} />
            </nav>
          </div>
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
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField 
                      label="Site Adı" 
                      value={content.general.siteName} 
                      onChange={(val) => updateNestedField(['general', 'siteName'], val)} 
                    />
                    <InputField 
                      label="SEO Başlığı" 
                      value={content.general.seo.title} 
                      onChange={(val) => updateNestedField(['general', 'seo', 'title'], val)} 
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ImageUploadField 
                      label="Site Logosu" 
                      value={content.general.logoUrl} 
                      onUpload={(e) => handleFileUpload(['general', 'logoUrl'], e)}
                      onUrlChange={(val) => updateNestedField(['general', 'logoUrl'], val)}
                      isUploading={isUploading}
                    />
                    <ImageUploadField 
                      label="Favicon" 
                      value={content.general.faviconUrl} 
                      onUpload={(e) => handleFileUpload(['general', 'faviconUrl'], e)}
                      onUrlChange={(val) => updateNestedField(['general', 'faviconUrl'], val)}
                      isUploading={isUploading}
                    />
                  </div>
                  <TextAreaField 
                    label="SEO Açıklaması" 
                    value={content.general.seo.description} 
                    onChange={(val) => updateNestedField(['general', 'seo', 'description'], val)} 
                  />
                  <InputField 
                    label="SEO Anahtar Kelimeler (Virgülle ayırın)" 
                    value={content.general.seo.keywords} 
                    onChange={(val) => updateNestedField(['general', 'seo', 'keywords'], val)} 
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

            {/* Page Management */}
            {activeTab === 'pages' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">Sayfa Yönetimi</h2>
                  </div>
                  <button 
                    onClick={addPage}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  >
                    <Plus className="w-4 h-4" /> Yeni Sayfa Ekle
                  </button>
                </div>
                <div className="grid gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  {content.pages.map((page: any) => (
                    <div key={page.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 group hover:border-orange-500/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-orange-500 transition-colors">
                          <Layout className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white leading-tight">{page.title}</h4>
                          <p className="text-xs text-slate-500 font-mono">{page.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedPageId(page.id);
                            setActiveTab('editor');
                          }}
                          className="p-2 hover:bg-orange-600/10 hover:text-orange-500 rounded-lg transition-all"
                          title="İçeriği Düzenle"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {page.id !== 'home' && (
                          <button 
                            onClick={() => deletePage(page.id)}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                            title="Sayfayı Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Design & Colors */}
            {activeTab === 'design' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold">Tasarım & Renkler</h2>
                </div>
                <div className="grid gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Marka Renkleri</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-sm font-medium">Birincil Renk (Tema)</span>
                          <input 
                            type="color" 
                            value={content.design.primaryColor} 
                            onChange={(e) => updateNestedField(['design', 'primaryColor'], e.target.value)}
                            className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-sm font-medium">Navigasyon Metin Rengi</span>
                          <input 
                            type="color" 
                            value={content.design.menuColor} 
                            onChange={(e) => updateNestedField(['design', 'menuColor'], e.target.value)}
                            className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Animasyon Ayarları</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-sm">Kaydırma Animasyonları</span>
                          <input 
                            type="checkbox" 
                            checked={content.design.animations.scrollAnimations} 
                            onChange={(e) => updateNestedField(['design', 'animations', 'scrollAnimations'], e.target.checked)}
                            className="w-5 h-5 accent-orange-600 rounded"
                          />
                        </div>
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between text-xs text-slate-500 font-bold uppercase">
                            <span>Animasyon Hızı</span>
                            <span>{content.design.animations.speed}s</span>
                          </div>
                          <input 
                            type="range" 
                            min="0.1" 
                            max="2" 
                            step="0.1"
                            value={content.design.animations.speed} 
                            onChange={(e) => updateNestedField(['design', 'animations', 'speed'], parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Universal Content Editor */}
            {activeTab === 'editor' && (
              <section className="space-y-6">
                {(() => {
                  const selectedPage = content?.pages?.find((p: any) => p.id === selectedPageId) || content?.pages?.[0];
                  
                  if (!selectedPage) {
                    return (
                      <div className="bg-slate-900/50 p-10 rounded-3xl border border-slate-800 text-center">
                        <Layout className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-lg font-bold">Sayfa bulunamadı</h3>
                        <p className="text-slate-500 text-sm mb-6">Düzenlemek için bir sayfa seçin veya yeni bir sayfa oluşturun.</p>
                        <button onClick={() => setActiveTab('pages')} className="text-orange-500 font-bold hover:underline">Sayfa Yönetimine Git</button>
                      </div>
                    );
                  }

                  return (
                    <>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-600/20">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold leading-tight">Canlı Düzenleyici</h2>
                            <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">
                              {selectedPage.title} SAYFASI
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select 
                            value={selectedPageId}
                            onChange={(e) => {
                              setSelectedPageId(e.target.value);
                              setEditingBlockId(null);
                            }}
                            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                          >
                            {content.pages.map((p: any) => (
                              <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                          </select>
                          <div className="relative group/add">
                            <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
                              <Plus className="w-4 h-4" /> Bölüm Ekle
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/add:opacity-100 group-hover/add:visible transition-all z-50 p-2 grid gap-1">
                              {Object.keys(BLOCK_TEMPLATES).map(type => (
                                <button 
                                  key={type}
                                  onClick={() => addSection(type, selectedPageId)}
                                  className="flex items-center gap-3 w-full p-3 hover:bg-slate-800 rounded-xl text-left transition-all group/item"
                                >
                                  <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-slate-500 group-hover/item:text-orange-500 transition-colors">
                                    <Layout className="w-4 h-4" />
                                  </div>
                                  <span className="text-xs font-bold uppercase tracking-tight">{type}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(selectedPage.blocks || []).map((block: any, index: number) => (
                          <div 
                            key={block.id} 
                            className={`bg-slate-900/50 rounded-2xl border transition-all ${editingBlockId === block.id ? 'border-orange-500 shadow-2xl shadow-orange-500/10 ring-1 ring-orange-500/50' : 'border-slate-800 hover:border-slate-700'}`}
                          >
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editingBlockId === block.id ? 'bg-orange-500 text-white' : 'bg-slate-950 text-slate-500'}`}>
                                  <Layout className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-black uppercase tracking-widest">{block.type}</h4>
                                  <p className="text-[10px] text-slate-500 font-mono">#{block.id}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => moveSection(block.id, selectedPageId, 'up')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"><ChevronDown className="w-4 h-4 rotate-180" /></button>
                                <button onClick={() => moveSection(block.id, selectedPageId, 'down')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"><ChevronDown className="w-4 h-4" /></button>
                                <div className="w-px h-4 bg-slate-800 mx-1" />
                                <button 
                                  onClick={() => setEditingBlockId(editingBlockId === block.id ? null : block.id)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${editingBlockId === block.id ? 'bg-orange-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                                >
                                  {editingBlockId === block.id ? 'Kapat' : 'Düzenle'}
                                </button>
                                <button 
                                  onClick={() => deleteSection(block.id, selectedPageId)}
                                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-slate-500 transition-all font-bold"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <AnimatePresence>
                              {editingBlockId === block.id && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6 pt-2 bg-slate-950/30">
                                    <BlockEditor 
                                      block={block} 
                                      pageId={selectedPageId}
                                      content={content}
                                      setContent={setContent}
                                      handleFileUpload={handleFileUpload}
                                      isUploading={isUploading}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                        
                        {(selectedPage.blocks || []).length === 0 && (
                          <div className="bg-slate-900/50 p-20 rounded-3xl border border-slate-800 border-dashed text-center">
                            <Layout className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                            <h3 className="text-xl font-bold mb-2">Henüz Bölüm Yok</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">Bu sayfada henüz hiç içerik bölümü yok. Sağ üstteki butonu kullanarak bir bölüm ekleyebilirsiniz.</p>
                          </div>
                        )}
                      </div>
                    </>
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
                    <h2 className="text-xl font-bold">Menü Linkleri</h2>
                  </div>
                  <button 
                    onClick={() => {
                      const newContent = JSON.parse(JSON.stringify(content));
                      const maxId = newContent.menu.length > 0 ? Math.max(...newContent.menu.map((m: any) => parseInt(m.id) || 0)) : 0;
                      newContent.menu.push({ id: (maxId + 1).toString(), label: 'Yeni Link', path: '/', order: newContent.menu.length });
                      setContent(newContent);
                    }}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  >
                    <Plus className="w-4 h-4" /> Yeni Link Ekle
                  </button>
                </div>
                <div className="space-y-4">
                  {content.menu.sort((a,b) => a.order - b.order).map((item: any) => (
                    <div key={item.id} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4 relative group">
                      <button 
                        onClick={() => {
                          const newContent = JSON.parse(JSON.stringify(content));
                          newContent.menu = newContent.menu.filter((m: any) => m.id !== item.id);
                          setContent(newContent);
                        }}
                        className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid md:grid-cols-3 gap-6">
                        <InputField label="Menü Yazısı" value={item.label} onChange={(val) => {
                          const newContent = JSON.parse(JSON.stringify(content));
                          const i = newContent.menu.findIndex((m: any) => m.id === item.id);
                          newContent.menu[i].label = val;
                          setContent(newContent);
                        }} />
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Link / Sayfa</label>
                          <select 
                            value={item.path}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content));
                              const i = newContent.menu.findIndex((m: any) => m.id === item.id);
                              newContent.menu[i].path = e.target.value;
                              setContent(newContent);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm"
                          >
                            <optgroup label="Sistem Sayfaları">
                              {content.pages.map((p: any) => <option key={p.id} value={p.slug === '/' ? '/' : '#/' + p.slug.replace(/^\//, '')}>{p.title} ({p.slug})</option>)}
                            </optgroup>
                            <optgroup label="Bölüm Çapaları (Anchor)">
                              <option value="#hero">Giriş (Hero)</option>
                              <option value="#services">Hizmetler</option>
                              <option value="#features">Özellikler</option>
                              <option value="#stats">İstatistikler</option>
                              <option value="#vision">Vizyon</option>
                              <option value="#gallery">Galeri</option>
                              <option value="#testimonials">Yorumlar</option>
                              <option value="#faq">S.S.S</option>
                              <option value="#contact">İletişim</option>
                            </optgroup>
                            <optgroup label="Özel Link">
                              <option value={item.path}>{item.path}</option>
                            </optgroup>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Sıralama</label>
                          <input 
                            type="number"
                            value={item.order}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content));
                              const i = newContent.menu.findIndex((m: any) => m.id === item.id);
                              newContent.menu[i].order = parseInt(e.target.value) || 0;
                              setContent(newContent);
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

const BlockEditor = ({ block, pageId, content, setContent, handleFileUpload, isUploading }: any) => {
  const updateBlockContent = (newBlockContent: any) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const pageIndex = newContent.pages.findIndex((p: any) => p.id === pageId);
    if (pageIndex === -1) return;
    const blockIndex = newContent.pages[pageIndex].blocks.findIndex((b: any) => b.id === block.id);
    if (blockIndex === -1) return;
    
    newContent.pages[pageIndex].blocks[blockIndex].content = newBlockContent;
    setContent(newContent);
  };

  const getUploadPath = (field: string) => {
    const pageIndex = content.pages.findIndex((p: any) => p.id === pageId);
    const blockIndex = content.pages[pageIndex].blocks.findIndex((b: any) => b.id === block.id);
    return ['pages', pageIndex.toString(), 'blocks', blockIndex.toString(), 'content', field];
  };

  switch (block.type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <InputField label="Ana Başlık (HTML destekli)" value={block.content.title} onChange={(val) => updateBlockContent({ ...block.content, title: val })} />
          <InputField label="Üst Başlık (Subtitle)" value={block.content.subtitle} onChange={(val) => updateBlockContent({ ...block.content, subtitle: val })} />
          <TextAreaField label="Açıklama" value={block.content.description} onChange={(val) => updateBlockContent({ ...block.content, description: val })} />
          <ImageUploadField 
            label="Arka Plan Görseli" 
            value={block.content.image} 
            onUpload={(e) => handleFileUpload(getUploadPath('image'), e)}
            onUrlChange={(val) => updateBlockContent({ ...block.content, image: val })}
            isUploading={isUploading}
          />
        </div>
      );
    case 'stats':
      return (
        <div className="grid sm:grid-cols-2 gap-4">
          {block.content.map((item: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-900 rounded-xl space-y-3 relative group">
              <button 
                onClick={() => {
                  const newList = [...block.content];
                  newList.splice(idx, 1);
                  updateBlockContent(newList);
                }}
                className="absolute top-2 right-2 p-1 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              <InputField label="Etiket" value={item.label} onChange={(val) => {
                const newList = [...block.content];
                newList[idx].label = val;
                updateBlockContent(newList);
              }} />
              <InputField label="Değer" value={item.value} onChange={(val) => {
                const newList = [...block.content];
                newList[idx].value = val;
                updateBlockContent(newList);
              }} />
            </div>
          ))}
          <button 
            onClick={() => updateBlockContent([...block.content, { label: 'Yeni', value: '0', icon: 'Truck' }])}
            className="p-4 border-2 border-dashed border-slate-800 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2 text-sm font-bold"
          >
            <Plus className="w-4 h-4" /> İstatistik Ekle
          </button>
        </div>
      );
    case 'services':
      return (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Bölüm Başlığı" value={block.content.sectionTitle} onChange={(val) => updateBlockContent({ ...block.content, sectionTitle: val })} />
            <InputField label="Alt Başlık" value={block.content.sectionHeading} onChange={(val) => updateBlockContent({ ...block.content, sectionHeading: val })} />
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 border-l-2 border-orange-500">Hizmet Listesi</h4>
            <div className="grid gap-4">
              {block.content.items.map((item: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-900 rounded-xl space-y-4 relative group">
                  <button 
                    onClick={() => {
                      const newList = [...block.content.items];
                      newList.splice(idx, 1);
                      updateBlockContent({ ...block.content, items: newList });
                    }}
                    className="absolute top-4 right-4 p-1 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <InputField label="Hizmet Adı" value={item.title} onChange={(val) => {
                    const newList = [...block.content.items];
                    newList[idx].title = val;
                    updateBlockContent({ ...block.content, items: newList });
                  }} />
                  <TextAreaField label="Açıklama" value={item.desc} onChange={(val) => {
                    const newList = [...block.content.items];
                    newList[idx].desc = val;
                    updateBlockContent({ ...block.content, items: newList });
                  }} />
                </div>
              ))}
              <button 
                onClick={() => updateBlockContent({ 
                  ...block.content, 
                  items: [...block.content.items, { title: 'Yeni Hizmet', desc: 'Açıklama', icon: 'Truck', color: 'bg-orange-50 text-orange-600' }] 
                })}
                className="p-4 border-2 border-dashed border-slate-800 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2 text-sm font-bold"
              >
                <Plus className="w-4 h-4" /> Yeni Hizmet Ekle
              </button>
            </div>
          </div>
        </div>
      );
    case 'features':
      return (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Bölüm Başlığı" value={block.content.sectionTitle} onChange={(val) => updateBlockContent({ ...block.content, sectionTitle: val })} />
            <InputField label="Alt Başlık" value={block.content.sectionHeading} onChange={(val) => updateBlockContent({ ...block.content, sectionHeading: val })} />
          </div>
          <div className="grid gap-4">
            {block.content.items.map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-900 rounded-xl space-y-3 relative group">
                <button 
                  onClick={() => {
                    const newList = [...block.content.items];
                    newList.splice(idx, 1);
                    updateBlockContent({ ...block.content, items: newList });
                  }}
                  className="absolute top-2 right-2 p-1 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <InputField label="Özellik Başlığı" value={item.title} onChange={(val) => {
                  const newList = [...block.content.items];
                  newList[idx].title = val;
                  updateBlockContent({ ...block.content, items: newList });
                }} />
                <TextAreaField label="Açıklama" value={item.desc} onChange={(val) => {
                  const newList = [...block.content.items];
                  newList[idx].desc = val;
                  updateBlockContent({ ...block.content, items: newList });
                }} />
              </div>
            ))}
            <button 
              onClick={() => updateBlockContent({ 
                ...block.content, 
                items: [...block.content.items, { title: 'Yeni Özellik', desc: 'Açıklama', icon: 'Zap' }] 
              })}
              className="p-4 border-2 border-dashed border-slate-800 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2 text-sm font-bold"
            >
              <Plus className="w-4 h-4" /> Özellik Ekle
            </button>
          </div>
        </div>
      );
    case 'testimonials':
      return (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Bölüm Başlığı" value={block.content.sectionTitle} onChange={(val) => updateBlockContent({ ...block.content, sectionTitle: val })} />
            <InputField label="Alt Başlık" value={block.content.sectionHeading} onChange={(val) => updateBlockContent({ ...block.content, sectionHeading: val })} />
          </div>
          <div className="grid gap-4">
            {block.content.items.map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-900 rounded-xl space-y-4 relative group">
                <button 
                  onClick={() => {
                    const newList = [...block.content.items];
                    newList.splice(idx, 1);
                    updateBlockContent({ ...block.content, items: newList });
                  }}
                  className="absolute top-4 right-4 p-1 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="İsim" value={item.name} onChange={(val) => {
                    const newList = [...block.content.items];
                    newList[idx].name = val;
                    updateBlockContent({ ...block.content, items: newList });
                  }} />
                  <InputField label="Ünvan" value={item.role} onChange={(val) => {
                    const newList = [...block.content.items];
                    newList[idx].role = val;
                    updateBlockContent({ ...block.content, items: newList });
                  }} />
                </div>
                <TextAreaField label="Yorum" value={item.comment} onChange={(val) => {
                  const newList = [...block.content.items];
                  newList[idx].comment = val;
                  updateBlockContent({ ...block.content, items: newList });
                }} />
                <ImageUploadField 
                  label="Profil Fotoğrafı" 
                  value={item.image} 
                  onUpload={(e) => handleFileUpload([...getUploadPath('items'), idx.toString(), 'image'], e)}
                  onUrlChange={(val) => {
                    const newList = [...block.content.items];
                    newList[idx].image = val;
                    updateBlockContent({ ...block.content, items: newList });
                  }}
                  isUploading={isUploading}
                />
              </div>
            ))}
            <button 
              onClick={() => updateBlockContent({ 
                ...block.content, 
                items: [...block.content.items, { name: 'Yeni İsim', role: 'Müşteri', comment: 'Harika!', image: '' }] 
              })}
              className="p-4 border-2 border-dashed border-slate-800 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2 text-sm font-bold"
            >
              <Plus className="w-4 h-4" /> Yorum Ekle
            </button>
          </div>
        </div>
      );
    case 'faq':
      return (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Bölüm Başlığı" value={block.content.sectionTitle} onChange={(val) => updateBlockContent({ ...block.content, sectionTitle: val })} />
            <InputField label="Alt Başlık" value={block.content.sectionHeading} onChange={(val) => updateBlockContent({ ...block.content, sectionHeading: val })} />
          </div>
          <div className="grid gap-4">
            {block.content.items.map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-900 rounded-xl space-y-3 relative group">
                <button 
                  onClick={() => {
                    const newList = [...block.content.items];
                    newList.splice(idx, 1);
                    updateBlockContent({ ...block.content, items: newList });
                  }}
                  className="absolute top-2 right-2 p-1 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <InputField label="Soru" value={item.question} onChange={(val) => {
                  const newList = [...block.content.items];
                  newList[idx].question = val;
                  updateBlockContent({ ...block.content, items: newList });
                }} />
                <TextAreaField label="Cevap" value={item.answer} onChange={(val) => {
                  const newList = [...block.content.items];
                  newList[idx].answer = val;
                  updateBlockContent({ ...block.content, items: newList });
                }} />
              </div>
            ))}
            <button 
              onClick={() => updateBlockContent({ 
                ...block.content, 
                items: [...block.content.items, { question: 'Yeni Soru', answer: 'Yeni Cevap' }] 
              })}
              className="p-4 border-2 border-dashed border-slate-800 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2 text-sm font-bold"
            >
              <Plus className="w-4 h-4" /> Soru Ekle
            </button>
          </div>
        </div>
      );
    case 'vision':
      return (
         <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Bölüm Başlığı" value={block.content.sectionTitle} onChange={(val) => updateBlockContent({ ...block.content, sectionTitle: val })} />
            <InputField label="Ana Başlık" value={block.content.title} onChange={(val) => updateBlockContent({ ...block.content, title: val })} />
          </div>
          <TextAreaField label="Açıklama" value={block.content.description} onChange={(val) => updateBlockContent({ ...block.content, description: val })} />
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Deneyim Metni" value={block.content.experienceYear} onChange={(val) => updateBlockContent({ ...block.content, experienceYear: val })} />
            <ImageUploadField 
              label="Vizyon Görseli" 
              value={block.content.image} 
              onUpload={(e) => handleFileUpload(getUploadPath('image'), e)}
              onUrlChange={(val) => updateBlockContent({ ...block.content, image: val })}
              isUploading={isUploading}
            />
          </div>
        </div>
      );
    case 'gallery':
      return (
        <div className="space-y-6">
           <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Bölüm Başlığı" value={block.content.sectionTitle} onChange={(val) => updateBlockContent({ ...block.content, sectionTitle: val })} />
            <InputField label="Alt Başlık" value={block.content.sectionHeading} onChange={(val) => updateBlockContent({ ...block.content, sectionHeading: val })} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {block.content.images.map((img: any, idx: number) => (
              <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                <img src={img.url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4 gap-2">
                  <label className="cursor-pointer bg-white text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2">
                    <Upload className="w-3 h-3" /> Değiştir
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload([...getUploadPath('images'), idx.toString(), 'url'], e)} />
                  </label>
                  <button 
                    onClick={() => {
                      const newList = [...block.content.images];
                      newList.splice(idx, 1);
                      updateBlockContent({ ...block.content, images: newList });
                    }}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button 
              onClick={() => updateBlockContent({ 
                ...block.content, 
                images: [...block.content.images, { url: 'https://images.unsplash.com/photo-1519003722824-191d440bd502?auto=format&fit=crop&q=80', title: 'Yeni' }] 
              })}
              className="aspect-square border-2 border-dashed border-slate-800 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2 text-sm font-bold"
            >
              <Plus className="w-4 h-4" /> Görsel Ekle
            </button>
          </div>
        </div>
      );
    case 'businessCard':
      return (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Ad Soyad" value={block.content.fullName} onChange={(val) => updateBlockContent({ ...block.content, fullName: val })} />
            <InputField label="Pozisyon" value={block.content.position} onChange={(val) => updateBlockContent({ ...block.content, position: val })} />
          </div>
          <TextAreaField label="Açıklama" value={block.content.description} onChange={(val) => updateBlockContent({ ...block.content, description: val })} />
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Bölüm Başlığı" value={block.content.sectionTitle} onChange={(val) => updateBlockContent({ ...block.content, sectionTitle: val })} />
            <InputField label="Alt Başlık" value={block.content.sectionHeading} onChange={(val) => updateBlockContent({ ...block.content, sectionHeading: val })} />
          </div>
        </div>
      );
    case 'contact':
      return (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Telefon" value={block.content.phone} onChange={(val) => updateBlockContent({ ...block.content, phone: val })} />
            <InputField label="E-Posta" value={block.content.email} onChange={(val) => updateBlockContent({ ...block.content, email: val })} />
          </div>
          <TextAreaField label="Adres" value={block.content.address} onChange={(val) => updateBlockContent({ ...block.content, address: val })} />
          <div className="grid md:grid-cols-2 gap-4">
             <InputField label="Üst Başlık" value={block.content.sectionHeading} onChange={(val) => updateBlockContent({ ...block.content, sectionHeading: val })} />
             <InputField label="Açıklama" value={block.content.sectionDescription} onChange={(val) => updateBlockContent({ ...block.content, sectionDescription: val })} />
          </div>
        </div>
      );
    case 'text':
      return (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800">
            <strong>İpucu:</strong> HTML etiketleri kullanarak (örneğin <code>&lt;h2&gt;</code>, <code>&lt;b&gt;</code>, <code>&lt;p&gt;</code>) metninizi zenginleştirebilirsiniz.
          </p>
          <TextAreaField label="HTML İçeriği" value={block.content.text} onChange={(val) => updateBlockContent({ ...block.content, text: val })} />
        </div>
      );
    default:
      return <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold ring-1 ring-red-500/20">Bu bölüm tipi için düzenleyici henüz hazır değil. ({block.type})</div>;
  }
};

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
