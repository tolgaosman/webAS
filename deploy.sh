#!/bin/bash
# ==============================================================================
# webAS Hetzner Deployment & Update Script
# ==============================================================================
# Bu betik, github'dan en son güncellemeleri çeker, docker imajlarını yeniden
# inşa eder, veritabanı migration'larını çalıştırır ve cache'leri temizler.
# ==============================================================================

set -e

echo "🚀 webAS deployment başlatılıyor..."

# 1. Git adımı burada yok — deploy öncesi `git pull` komutunu elle çalıştırın.

# 2. Uploads klasörü yoksa oluştur (Nginx ve PHP'nin erişmesi için gerekli).
# Koşulsuz çalışır (klasör zaten varsa da) çünkü sahiplik php konteyneri
# içindeki www-data kullanıcısına adım 5'te ayrıca veriliyor — burada
# sadece dizinin var olduğundan emin oluyoruz.
echo "📁 'uploads' klasörü kontrol ediliyor..."
mkdir -p uploads
chmod -R 775 uploads

# 3. Docker konteynerlerini yeniden inşa et ve ayağa kaldır
echo "🐳 Docker konteynerleri (Nginx, PHP, MySQL, Redis) ayağa kaldırılıyor..."
docker compose up -d --build

# MySQL'in tam olarak ayağa kalkması için kısa bir süre bekle (İlk kurulumda gerekli olabilir)
echo "⏳ Veritabanı bağlantısı bekleniyor..."
sleep 5

# 4. İzinleri düzelt (storage ve uploads klasörlerinin yazılabilir olması
# gerekir). php konteyneri normalde www-data kullanıcısıyla çalışıyor
# (backend/Dockerfile'daki USER www-data), chown için root'a ihtiyaç var
# — bu yüzden -u root ile çalıştırıyoruz. Bu adım 5'ten (Laravel
# migration/cache) ÖNCE gelmeli: config:cache ve route:cache
# bootstrap/cache'e www-data olarak yazıyor, izinler verilmeden
# çalıştırılırsa taze bir sunucuda patlar. uploads chown'u önceden hiç
# yapılmıyordu; bu, admin panelindeki görsel yüklemenin "Sunucu hatası
# oluştu" ile 500 vermesinin ana sebebiydi (uploads root:root 775 ile
# oluşuyor, www-data yazamıyordu).
echo "🔐 Laravel Storage ve uploads izinleri ayarlanıyor..."
docker compose exec -T -u root php chown -R www-data:www-data /var/www/backend/storage /var/www/backend/bootstrap/cache
docker compose exec -T -u root php chown -R www-data:www-data /var/www/uploads

# uploads klasörünün gerçekten www-data tarafından yazılabildiğini
# doğrula — chown sessizce başarısız olabilir (ör. yanlış bind-mount
# yolu), bu adım olmadan sorun bir sonraki admin panel yüklemesine kadar
# fark edilmezdi.
echo "🧪 uploads klasörü yazma testi..."
docker compose exec -T php sh -c \
  'touch /var/www/uploads/.write-test && rm /var/www/uploads/.write-test' \
  || { echo "❌ uploads klasörü www-data tarafından yazılamıyor — deploy durduruldu."; exit 1; }

# 5. Laravel veritabanı migration ve optimizasyon komutları
echo "🛠️ Laravel: Migration ve Cache optimizasyonları yapılıyor..."

# Artisan komutlarını 'php' isimli konteynerin içinde çalıştırıyoruz
docker compose exec -T php php artisan migrate --force --seed
docker compose exec -T php php artisan optimize:clear
docker compose exec -T php php artisan config:cache
docker compose exec -T php php artisan route:cache

echo "✅ Deployment başarıyla tamamlandı! Site yayında."
