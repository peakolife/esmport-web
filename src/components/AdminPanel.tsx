import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Image as ImageIcon, 
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
  Eye
} from 'lucide-react';
import { getSupabase, uploadImage } from '../lib/supabase';

interface AdminPanelProps {
  initialContent: any;
  onSave: (newContent: any) => Promise<void>;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ initialContent, onSave, onClose }) => {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState('general');
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
    // In a real app, you'd use Supabase Auth. 
    // Here we use a secure password or environment-checked one if available.
    // For now, using a default "esmport2025" as requested "special password"
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

  const handleFileUpload = async (path: string[], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = await uploadImage(file);
    if (url) {
      updateNestedField(path, url);
    }
    setIsUploading(false);
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
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-orange-600/10"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
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
            <SidebarLink icon={<ImageIcon />} label="Galeri" active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
            <SidebarLink icon={<ContactIcon />} label="İletişim" active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} />
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
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
                  <ImageUploadField 
                    label="Favicon Bildirimi" 
                    value={content.general.faviconUrl} 
                    onUpload={(e) => handleFileUpload(['general', 'faviconUrl'], e)}
                    onUrlChange={(val) => updateNestedField(['general', 'faviconUrl'], val)}
                    isUploading={isUploading}
                  />
                </div>
              </section>
            )}

            {/* Hero Section */}
            {activeTab === 'hero' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Layout className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold">Giriş Bölümü (Hero)</h2>
                </div>
                {content.pages[0].blocks.find((b: any) => b.type === 'hero') && (
                  <div className="grid gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <InputField 
                      label="Ana Başlık" 
                      value={content.pages[0].blocks.find((b: any) => b.type === 'hero').content.title} 
                      onChange={(val) => {
                        const newPages = [...content.pages];
                        const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'hero');
                        newPages[0].blocks[blockIndex].content.title = val;
                        setContent({...content, pages: newPages});
                      }} 
                    />
                    <TextAreaField 
                      label="Alt Metin" 
                      value={content.pages[0].blocks.find((b: any) => b.type === 'hero').content.subtitle} 
                      onChange={(val) => {
                        const newPages = [...content.pages];
                        const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'hero');
                        newPages[0].blocks[blockIndex].content.subtitle = val;
                        setContent({...content, pages: newPages});
                      }} 
                    />
                    <ImageUploadField 
                      label="Arka Plan Görseli" 
                      value={content.pages[0].blocks.find((b: any) => b.type === 'hero').content.backgroundImage} 
                      onUpload={(e) => {
                        const newPages = [...content.pages];
                        const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'hero');
                        handleFileUpload(['pages', '0', 'blocks', blockIndex.toString(), 'content', 'backgroundImage'], e);
                      }}
                      onUrlChange={(val) => {
                        const newPages = [...content.pages];
                        const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'hero');
                        newPages[0].blocks[blockIndex].content.backgroundImage = val;
                        setContent({...content, pages: newPages});
                      }}
                      isUploading={isUploading}
                    />
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
                </div>
                <div className="space-y-4">
                  {(() => {
                    const servicesBlock = content.pages[0].blocks.find((b: any) => b.type === 'services');
                    return servicesBlock?.content?.items?.map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-orange-500 uppercase">Hizmet #{idx + 1}</span>
                        </div>
                        <InputField 
                          label="Hizmet Adı" 
                          value={item.title} 
                          onChange={(val) => {
                            const newPages = [...content.pages];
                            const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'services');
                            newPages[0].blocks[blockIndex].content.items[idx].title = val;
                            setContent({...content, pages: newPages});
                          }} 
                        />
                        <TextAreaField 
                          label="Açıklama" 
                          value={item.description} 
                          onChange={(val) => {
                            const newPages = [...content.pages];
                            const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'services');
                            newPages[0].blocks[blockIndex].content.items[idx].description = val;
                            setContent({...content, pages: newPages});
                          }} 
                        />
                      </div>
                    ));
                  })()}
                </div>
              </section>
            )}

            {/* Gallery */}
            {activeTab === 'gallery' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">Galeri Görselleri</h2>
                  </div>
                  <button 
                    onClick={() => {
                      const newPages = [...content.pages];
                      const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'gallery');
                      newPages[0].blocks[blockIndex].content.images.push({
                        url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80',
                        caption: 'Yeni Görsel'
                      });
                      setContent({...content, pages: newPages});
                    }}
                    className="flex items-center gap-2 text-sm bg-orange-600/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                  >
                    <Plus className="w-4 h-4" /> Görsel Ekle
                  </button>
                </div>
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
                                  const newPages = [...content.pages];
                                  const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'gallery');
                                  handleFileUpload(['pages', '0', 'blocks', blockIndex.toString(), 'content', 'images', idx.toString(), 'url'], e);
                                }}
                              />
                            </label>
                            <button 
                              onClick={() => {
                                const newPages = [...content.pages];
                                const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'gallery');
                                newPages[0].blocks[blockIndex].content.images.splice(idx, 1);
                                setContent({...content, pages: newPages});
                              }}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <InputField 
                          label="Alt Başlık" 
                          value={img.caption} 
                          onChange={(val) => {
                            const newPages = [...content.pages];
                            const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'gallery');
                            newPages[0].blocks[blockIndex].content.images[idx].caption = val;
                            setContent({...content, pages: newPages});
                          }}
                        />
                      </div>
                    ));
                  })()}
                </div>
              </section>
            )}

            {/* Contact */}
            {activeTab === 'contact' && (() => {
              const contactBlock = content.pages[0].blocks.find((b: any) => b.type === 'contact');
              if (!contactBlock) return (
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 text-center">
                  <p className="text-slate-400">İletişim bloğu bulunamadı.</p>
                </div>
              );
              
              const contactContent = contactBlock.content || {};
              const socials = contactContent.socials || {};

              return (
                <section className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <ContactIcon className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">İletişim Bilgileri</h2>
                  </div>
                  <div className="grid gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField 
                        label="Telefon" 
                        value={contactContent.phone || ''} 
                        onChange={(val) => {
                          const newPages = [...content.pages];
                          const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'contact');
                          newPages[0].blocks[blockIndex].content.phone = val;
                          setContent({...content, pages: newPages});
                        }} 
                      />
                      <InputField 
                        label="E-posta" 
                        value={contactContent.email || ''} 
                        onChange={(val) => {
                          const newPages = [...content.pages];
                          const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'contact');
                          newPages[0].blocks[blockIndex].content.email = val;
                          setContent({...content, pages: newPages});
                        }} 
                      />
                    </div>
                    <TextAreaField 
                      label="Adres" 
                      value={contactContent.address || ''} 
                      onChange={(val) => {
                        const newPages = [...content.pages];
                        const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'contact');
                        newPages[0].blocks[blockIndex].content.address = val;
                        setContent({...content, pages: newPages});
                      }} 
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField 
                        label="Instagram" 
                        value={socials.instagram || ''} 
                        onChange={(val) => {
                          const newPages = [...content.pages];
                          const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'contact');
                          if (!newPages[0].blocks[blockIndex].content.socials) newPages[0].blocks[blockIndex].content.socials = {};
                          newPages[0].blocks[blockIndex].content.socials.instagram = val;
                          setContent({...content, pages: newPages});
                        }} 
                      />
                      <InputField 
                        label="LinkedIn" 
                        value={socials.linkedin || ''} 
                        onChange={(val) => {
                          const newPages = [...content.pages];
                          const blockIndex = newPages[0].blocks.findIndex((b: any) => b.type === 'contact');
                          if (!newPages[0].blocks[blockIndex].content.socials) newPages[0].blocks[blockIndex].content.socials = {};
                          newPages[0].blocks[blockIndex].content.socials.linkedin = val;
                          setContent({...content, pages: newPages});
                        }} 
                      />
                    </div>
                  </div>
                </section>
              );
            })()}
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
        {value ? <img src={value} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-slate-800" /></div>}
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
