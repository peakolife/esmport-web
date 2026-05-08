# Supabase Kurulum Kılavuzu (ESM PORT)

Bu proje, web sitenizin içeriğini (yazılar, resimler, renkler) kod yazmadan tek bir yerden yönetebilmeniz için Supabase (bir bulut veritabanı servisi) ile konuşacak şekilde hazırlandı. 

Hiç bilmeyenler için adım adım kurulum rehberi:

---

## 1. Supabase Hesabı ve Proje Oluşturma
1. [supabase.com](https://supabase.com/) adresine gidin ve GitHub hesabınızla giriş yapın.
2. **"New Project"** butonuna basın.
3. Bir isim verin (örneğin: `esm-port-db`) ve veritabanı şifrenizi bir yere not edin.
4. Projenin kurulması 1-2 dakika sürebilir, bekleyin.

## 2. Anahtarları (API Keys) Alma
Proje kurulduğunda ana ekranda (veya sol menüdeki **Project Settings > API** kısmında) iki önemli bilgi göreceksiniz:
- **Project URL:** `https://xxxx.supabase.co` şeklinde bir link.
- **Anon Key:** `eyJhbGci...` şeklinde uzun bir kod.

Bu iki bilgiyi kopyalayın.

## 3. Kod ve Veritabanı Bağlantısını Kurma
StackBlitz veya yerel bilgisayarınızda projenin ana dizininde `.env` isimli bir dosya oluşturun (veya `.env.example` dosyasını kopyalayıp adını `.env` yapın) ve anahtarları yapıştırın:

```env
VITE_SUPABASE_URL=Buraya_Project_URL_Gelecek
VITE_SUPABASE_ANON_KEY=Buraya_Anon_Key_Gelecek
```

---

## 4. Veritabanını Hazırlama (En Önemli Kısım)
Supabase'de sol menüdeki **"SQL Editor"** (terminale benzeyen simge) sekmesini açın ve **"New Query"** butonuna basarak aşağıdaki kodu içine yapıştırıp **"Run"** butonuna basın:

```sql
-- 1. Tabloyu oluştur: Bu tablo tüm site içeriğini tek bir satırda tutacak.
create table site_content (
  id uuid default gen_random_uuid() primary key,
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Güvenlik ayarı: Sitenin bu veriyi okuyabilmesi için izin ver.
alter table site_content enable row level security;
create policy "Herkes okuyabilir" on site_content for select using (true);

-- 3. İlk Veriyi Ekle: Aşağıdaki kod sitenizin mevcut görüntüsünü veritabanına kopyalar.
insert into site_content (content) values ('{
  "general": {
    "siteName": "ESM PORT",
    "logoUrl": "",
    "faviconUrl": "",
    "seo": {
      "title": "ESM PORT | Lojistik ve Taşımacılık",
      "description": "Profesyonel lojistik ve konteyner taşımacılığı.",
      "keywords": "lojistik, konteyner, taşımacılık, liman, antrepo"
    },
    "social": {
      "instagram": "https://instagram.com",
      "facebook": "https://facebook.com",
      "linkedin": "https://linkedin.com"
    }
  },
  "design": {
    "primaryColor": "#ea580c",
    "secondaryColor": "#0f172a",
    "menuColor": "#ffffff",
    "logoTextColor": "#ffffff",
    "logoIconColor": "#ea580c",
    "animations": {
      "buttonHover": true,
      "pageTransitions": true,
      "scrollAnimations": true,
      "speed": 0.5
    }
  },
  "menu": [
    {"id": "1", "label": "Ana Sayfa", "path": "/", "order": 0},
    {"id": "2", "label": "Hizmetler", "path": "#services", "order": 1},
    {"id": "3", "label": "Vizyon", "path": "#vision", "order": 2},
    {"id": "4", "label": "Filomuz", "path": "#gallery", "order": 3},
    {"id": "5", "label": "İletişim", "path": "#contact", "order": 4}
  ],
  "pages": [
    {
      "id": "home",
      "title": "Ana Sayfa",
      "blocks": [
        {"id": "b1", "type": "hero", "content": {"title": "TİCARETİN GÜCÜNÜ <span class=\"text-orange-500\">ESM PORT</span> İLE KEŞFEDİN", "subtitle": "HIZ, GÜVEN VE ÜSTÜN HİZMET", "description": "ESM PORT, lojistik dünyasında yeni nesil çözümler sunan öncü bir markadır.", "image": "input_file_1.png"}},
        {"id": "b2", "type": "stats", "content": [{"label": "Sevkiyat", "value": "15K+", "icon": "Truck"}, {"label": "Müşteri", "value": "2.5K+", "icon": "Users"}]}
      ]
    }
  ]
}');
```

---

## 5. Nasıl Test Ederim?
Kurulumu yaptıktan sonra sayfayı yenileyin. `App.tsx` içindeki kod otomatik olarak bu tabloya bağlanacak ve eğer veri varsa onu çekecektir. Eğer veriyi Supabase'den değiştirmek isterseniz:
1. Supabase'de **"Table Editor"** sekmesine gidin.
2. `site_content` tablosuna tıklayın.
3. `content` hüçresindeki JSON verisini istediğiniz gibi düzenleyip kaydedin. Siteniz anında güncellenecektir.

---
**Önemli:** StackBlitz ayarlarında (Gears simgesi > Environment Variables) `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` değişkenlerini tanımladığınızdan emin olun.
