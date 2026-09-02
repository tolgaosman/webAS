#!/bin/bash
# ==============================================================================
# webAS Hetzner Deployment & Update Script
# ==============================================================================
# Bu betik, github'dan en son güncellemeleri çeker, docker imajlarını yeniden
# inşa eder, veritabanı migration'larını çalıştırır ve cache'leri temizler.
# ==============================================================================

set -e

echo "🚀 webAS deployment başlatılıyor..."

# 1. Klasördeki değişiklikleri sıfırla ve güncel kodu çek
echo "📥 Git reposu güncelleniyor..."
git fetch origin main
git reset --hard origin/main

# 2. Uploads klasörü yoksa oluştur (Nginx ve PHP'nin erişmesi için gerekli)
if [ ! -d "uploads" ]; then
    echo "📁 'uploads' klasörü oluşturuluyor..."
    mkdir -p uploads
    chmod -R 775 uploads
fi

# 3. Docker konteynerlerini yeniden inşa et ve ayağa kaldır
echo "🐳 Docker konteynerleri (Nginx, PHP, MySQL, Redis) ayağa kaldırılıyor..."
docker compose up -d --build

# MySQL'in tam olarak ayağa kalkması için kısa bir süre bekle (İlk kurulumda gerekli olabilir)
echo "⏳ Veritabanı bağlantısı bekleniyor..."
sleep 5

# 4. Laravel veritabanı migration ve optimizasyon komutları
echo "🛠️ Laravel: Migration ve Cache optimizasyonları yapılıyor..."

# Artisan komutlarını 'php' isimli konteynerin içinde çalıştırıyoruz
docker compose exec -T php php artisan migrate --force --seed
docker compose exec -T php php artisan optimize:clear
docker compose exec -T php php artisan config:cache
docker compose exec -T php php artisan route:cache
docker compose exec -T php php artisan view:cache

# 5. İzinleri düzelt (storage klasörünün yazılabilir olması gerekir)
echo "🔐 Laravel Storage izinleri ayarlanıyor..."
docker compose exec -T php chown -R www-data:www-data /var/www/backend/storage /var/www/backend/bootstrap/cache

echo "✅ Deployment başarıyla tamamlandı! Site yayında."
