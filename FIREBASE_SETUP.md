# Firebase Kurulum Rehberi

## ❌ Sorun: "User not found or Duplicated" Hatası

Bu hata, Firebase yapılandırmanızın doğru yüklenmediğini gösterir. URL'de `projects/undefined` görünüyorsa, environment değişkenleri yüklenmemiş demektir.

## ✅ Çözüm Adımları

### 1. Environment Dosyasını Kontrol Edin

Proje kök dizininde `.env.local` dosyası oluşturun (veya mevcut `.env` dosyanızı kontrol edin):

```bash
# .env.local veya .env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Firebase Console'dan Bilgileri Alın

1. [Firebase Console](https://console.firebase.google.com/) 'a gidin
2. Projenizi seçin
3. ⚙️ Settings → Project Settings
4. "Your apps" bölümünde web app'inizi seçin
5. "SDK setup and configuration" altında "Config" seçeneğini seçin
6. Oradaki değerleri kopyalayın

### 3. Önemli Notlar

⚠️ **NEXT_PUBLIC_ prefix'i zorunludur!**
- Next.js'de client-side'da kullanılacak environment değişkenleri `NEXT_PUBLIC_` ile başlamalıdır
- Prefix olmadan tanımlarsanız, değişkenler sadece server-side'da erişilebilir olur

⚠️ **Dosya adı önemlidir:**
- `.env.local` → Tüm environment'larda çalışır (önerilen)
- `.env` → Genel ayarlar
- `.env.development` → Sadece development
- `.env.production` → Sadece production

### 4. Development Server'ı Yeniden Başlatın

Environment değişkenleri değiştiğinde mutlaka server'ı yeniden başlatmalısınız:

```bash
# Server'ı durdurun (Ctrl+C)
# Sonra tekrar başlatın
npm run dev
```

### 5. Kontrol Edin

Tarayıcı console'unda şu mesajları göreceksiniz:

```
Firebase Config Check: {
  hasApiKey: true,
  hasProjectId: true,
  projectId: "your-project-id"
}
```

Eğer `projectId: undefined` görüyorsanız, environment değişkenleri yüklenmemiştir.

## 🔍 Debug Adımları

### Console'da Kontrol

1. Tarayıcıda F12'ye basın
2. Console sekmesine gidin
3. Şu log'ları arayın:
   - `🔍 Attempting login for:` - Login denemesi
   - `📊 Users found:` - Bulunan kullanıcı sayısı
   - `✅ User found:` - Kullanıcı bulundu
   - `✅ Login successful!` - Giriş başarılı

### Hata Mesajları

- **"Firebase yapılandırması eksik"** → `.env.local` dosyanızı kontrol edin
- **"Firebase bağlantı hatası"** → Firebase rules'larınızı kontrol edin
- **"Kullanıcı bulunamadı"** → Email yanlış veya kullanıcı kayıtlı değil
- **"Şifre hatalı"** → Şifre yanlış

## 🔐 Firebase Security Rules

Firestore rules'larınızın doğru olduğundan emin olun:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if true; // Geliştirme için - Production'da değiştirin!
    }
    
    // Diğer collection'lar için de benzer rules ekleyin
  }
}
```

⚠️ **Güvenlik Uyarısı:** Yukarıdaki rules sadece geliştirme içindir. Production'da mutlaka authentication kontrolü ekleyin!

## 📝 Örnek .env.local Dosyası

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myproject-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=myproject-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myproject-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123DEF4
```

## ✅ Test Etme

1. `.env.local` dosyasını oluşturun/güncelleyin
2. Development server'ı yeniden başlatın
3. Login sayfasına gidin
4. Console'u açın (F12)
5. Login deneyin
6. Console'da log'ları kontrol edin

## 🆘 Hala Çalışmıyor mu?

1. `.env.local` dosyasının proje kök dizininde olduğundan emin olun
2. Dosya adının tam olarak `.env.local` olduğundan emin olun (`.env.local.txt` değil!)
3. Tüm değişkenlerin `NEXT_PUBLIC_` ile başladığından emin olun
4. Server'ı tamamen durdurup yeniden başlatın
5. Browser cache'ini temizleyin (Ctrl+Shift+Delete)
6. Farklı bir tarayıcıda deneyin

## 📞 İletişim

Sorun devam ederse:
1. Console'daki tüm hata mesajlarını kaydedin
2. `.env.local` dosyanızın formatını kontrol edin (değerleri paylaşmayın!)
3. Firebase Console'da projenizin aktif olduğunu doğrulayın
