<?php

namespace Database\Seeders;

use App\Models\BioParagraph;
use App\Models\ContentBlock;
use App\Models\Hobby;
use App\Models\Specialty;
use Illuminate\Database\Seeder;

/**
 * Seeds the content that used to be hardcoded in frontend/index.html and
 * existed nowhere in portfolio-data.json or the admin panel (§Faz 4):
 * the 4 biography paragraphs, 5 hobby items, 3 specialty panels, and
 * ~21 section headings / loose free-text strings. All text below is
 * copied verbatim from the pre-rewrite frontend/index.html (see the
 * exact line numbers cited per block) so nothing changes visually on
 * first deploy.
 *
 * `en`/`nl` are left "" wherever the source HTML had no English/Dutch
 * equivalent — TranslatedText::get() falls back to `tr`, so this is a
 * correct, visible starting state (see migration plan §Faz 2), not a
 * bug to fix here.
 *
 * Idempotent: safe to re-run (updateOrCreate keyed by `key` for content
 * blocks, by `position` for the ordered lists) — unlike
 * portfolio:import, this seeder is meant to be run as part of normal
 * `php artisan migrate --seed` on every fresh environment.
 */
class StaticContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedBioParagraphs();
        $this->seedHobbies();
        $this->seedSpecialties();
        $this->seedContentBlocks();
    }

    // frontend/index.html:360-378 (.about-bio-card)
    private function seedBioParagraphs(): void
    {
        $paragraphs = [
            "Merhaba, ben Alara. Rotterdam'da yaşayan; Hogeschool Rotterdam'da Uluslararası İşletme okuyan bir son sınıf öğrencisiyim. Dijital pazarlama, markalama ve örgütsel değişim yönetimi alanlarına odaklanıyorum.",
            "Aslen Kıbrıslıyım; şu anda Turkcell'de işveren markası, iç iletişim ve dijital içerik üretimi üzerine çalıştığım bir İK ve Marka stajı yapmaktayım. Hem görsel olarak çekici hem de stratejik olarak anlamlı projeler üretmek için yaratıcılık ile yapıyı bir araya getirmeyi seviyorum.",
            "Özellikle sade estetikten, düşünülmüş iletişimden ve tasarım yoluyla netlik yaratmaktan besleniyorum. İçerik, markalama veya dijital deneyimler üzerine çalışırken; dengeye, düzenli olmaya ve bilinçli detaylara değer veriyorum.",
            "Bu portfolyo; projelerimi, fikirlerimi, dijital çalışmalarımı ve görsel bakış açımı paylaştığım, yaratıcı ve profesyonel yolculuğumun bir yansımasıdır.",
        ];

        foreach ($paragraphs as $i => $body) {
            BioParagraph::query()->updateOrCreate(
                ['position' => $i],
                ['body' => ['tr' => $body, 'en' => '', 'nl' => '']]
            );
        }
    }

    // frontend/index.html:387-406 (.hobby-item)
    private function seedHobbies(): void
    {
        $hobbies = [
            ['icon' => '🧘🏻‍♀️', 'label' => 'Yoga'],
            ['icon' => '🍳', 'label' => 'Cooking'],
            ['icon' => '🎤', 'label' => 'Singing'],
            ['icon' => '📸', 'label' => 'Photography'],
            ['icon' => '🎨', 'label' => 'Coloring'],
        ];

        foreach ($hobbies as $i => $h) {
            Hobby::query()->updateOrCreate(
                ['position' => $i],
                [
                    'icon' => $h['icon'],
                    // These read the same in every language in the source
                    // HTML — seeded into all three locales rather than
                    // left to fall back, since they're already correct.
                    'label' => ['tr' => $h['label'], 'en' => $h['label'], 'nl' => $h['label']],
                ]
            );
        }
    }

    // frontend/index.html:467-497 (.specialty-panel)
    private function seedSpecialties(): void
    {
        $specialties = [
            [
                'image' => 'assets/images/social.jpg',
                'title' => 'Sosyal İçerik',
                'desc' => 'Görsel anlatı stratejileri, Instagram ızgara yerleşimleri ve estetik post tasarımları.',
                'cta_label' => 'projeleri gör',
                'cta_href' => '#portfolio',
            ],
            [
                'image' => 'assets/images/seo.jpg',
                'title' => 'SEO & Dijital Reklam',
                'desc' => 'Anahtar kelime stratejileri, Google Analytics entegrasyonu ve dijital kampanya kurulumu.',
                'cta_label' => 'sertifikaları gör',
                'cta_href' => '#certificates',
            ],
            [
                'image' => 'assets/images/branding.jpg',
                'title' => 'İşveren Markası',
                'desc' => 'Şirket içi marka algısının güçlendirilmesi ve employer branding içerik üretim süreçleri.',
                'cta_label' => 'özgeçmişi gör',
                'cta_href' => '#resume',
            ],
        ];

        foreach ($specialties as $i => $s) {
            Specialty::query()->updateOrCreate(
                ['position' => $i],
                [
                    'image' => $s['image'],
                    'title' => ['tr' => $s['title'], 'en' => '', 'nl' => ''],
                    'desc' => ['tr' => $s['desc'], 'en' => '', 'nl' => ''],
                    'cta_label' => ['tr' => $s['cta_label'], 'en' => '', 'nl' => ''],
                    'cta_href' => $s['cta_href'],
                ]
            );
        }
    }

    private function seedContentBlocks(): void
    {
        // [key, group, kind, tr] — en/nl left "" (falls back to tr).
        // Section tag/title pairs: frontend/index.html:350-352 (about),
        // 459-461 (specialties), 505-507 (portfolio), 666-668 (resume),
        // 855-857 (certificates), 958-960 (contact).
        $blocks = [
            ['section.about.tag', 'section', 'line', 'Hakkımda'],
            ['section.about.title', 'section', 'line', 'Netlik & Yapı'],
            ['section.specialties.tag', 'section', 'line', 'Odak Alanları'],
            ['section.specialties.title', 'section', 'line', 'Uzmanlık Alanlarım'],
            ['section.portfolio.tag', 'section', 'line', 'Yaratıcı Çalışmalar'],
            ['section.portfolio.title', 'section', 'line', 'Seçilmiş Kampanyalar'],
            ['section.resume.tag', 'section', 'line', 'Kariyer Geçmişi'],
            ['section.resume.title', 'section', 'line', 'Özgeçmiş & Yetenekler'],
            ['section.certificates.tag', 'section', 'line', 'Referanslar'],
            ['section.certificates.title', 'section', 'line', 'Sertifikalar'],
            ['section.contact.tag', 'section', 'line', 'İletişime Geçin'],
            ['section.contact.title', 'section', 'line', 'Bağlantı Kurun'],

            // frontend/index.html:309-323 (.hero-title-group, .hero-desc-folder, .hero-actions)
            ['hero.marketingLabel', 'hero', 'line', 'Dijital Markalama Öğrencisi'],
            ['hero.titleLine1', 'hero', 'line', 'Pazarlama'],
            ['hero.titleLine2', 'hero', 'line', 'Portfolyosu'],
            // Rendered as "{name} {bylineSuffix}" — see .hero-by-line.
            ['hero.bylineSuffix', 'hero', 'line', 'Tarafından'],
            ['hero.folderTab', 'hero', 'line', 'Hoş Geldiniz'],
            ['hero.intro', 'hero', 'rich', "Rotterdam merkezli, Kıbrıs kökenli, Rotterdam İşletme Okulu Uluslararası İşletme 3. sınıf öğrencisiyim. Dijital pazarlama, işveren markası ve sakin estetik tasarımlar geliştiriyorum."],
            ['hero.ctaPortfolio', 'hero', 'line', 'Portfolyo'],
            ['hero.ctaContact', 'hero', 'line', 'İletişim'],

            // frontend/index.html:359, 384-385, 414 (folder tabs + headings)
            ['about.bioTab', 'about', 'line', 'Biyografi'],
            ['about.interestsTab', 'about', 'line', 'İlgi Alanları'],
            ['about.interestsHeading', 'about', 'line', 'Hobiler & İlgi Alanları'],
            ['about.skillsHeading', 'about', 'line', 'Temel Yetenekler'],

            // frontend/index.html:677, 709, 763, 765, 806, 808
            ['resume.educationTab', 'resume', 'line', 'Eğitim'],
            ['resume.experienceTab', 'resume', 'line', 'Deneyim'],
            ['resume.languagesTab', 'resume', 'line', 'Languages'],
            ['resume.languagesHeading', 'resume', 'line', 'Dil Seviyeleri'],
            ['resume.toolkitTab', 'resume', 'line', 'Toolkit'],
            ['resume.toolkitHeading', 'resume', 'line', 'Beceriler & Araçlar'],

            // frontend/index.html:1000, 1008
            ['contact.location', 'contact', 'line', 'Rotterdam, Hollanda'],
            ['contact.formTitle', 'contact', 'line', 'Merhaba Deyin!'],

            // frontend/index.html:1106 (.footer-copy) — "{name}" and
            // "{year}" are placeholders the frontend interpolates
            // (year defaults to the current year; legacy hardcoded 2026).
            ['footer.copy', 'footer', 'line', '© {year} {name}. Vintage Marketing Concept.'],
        ];

        foreach ($blocks as [$key, $group, $kind, $tr]) {
            ContentBlock::query()->updateOrCreate(
                ['key' => $key],
                ['group' => $group, 'kind' => $kind, 'value' => ['tr' => $tr, 'en' => '', 'nl' => '']]
            );
        }
    }
}
