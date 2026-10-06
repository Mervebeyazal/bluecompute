# BlueCompute

Denizdeki veri merkezleri için enerji ve soğutma kısıtlarını dikkate alan bağımsız eğitim simülatörü. Atomarine fikrinden ilham almıştır; şirketle bağlantısı veya entegrasyonu yoktur.

## Çalıştırma

Klasörü birlikte tutarak `index.html` dosyasını güncel bir tarayıcıda açın. Kurulum, internet bağlantısı veya sunucu gerekmez. Senaryoyu seçin, işlerin güç/süre/başlangıç/son bitiş alanlarını düzenleyin ve **Planları karşılaştır** düğmesine basın. JSON sonuçlarını indirebilirsiniz.

## Model

- 24 saat, birer saatlik zaman dilimleri; her iş kesintisiz çalışır.
- Elektrik ve soğutma sınırının küçüğü saatlik kullanılabilir güçtür. Soğutma kapasitesi, desteklenen IT gücü eşdeğeri olarak modellenir.
- Başlangıç yöntemi: geliş sırasıyla ilk uygun aralığa yerleştirir.
- Akıllı yöntem: son bitiş zamanı yakın işleri önce ele alır; uygun aralıklar arasında elektrik maliyeti en düşük olanı seçer.
- Maliyet = MW × saat × USD/MWh. Aynı iş kümesinin tamamı iki yöntemde de bitmediyse yüzde tasarruf gösterilmez.
- Bu bir açgözlü sezgisel algoritmadır. Küresel optimumu, daha düşük maliyeti veya tüm mümkün işleri yerleştirmeyi garanti etmez.

## Test

Node.js kuruluysa: `node test.js`

Testler 400 senaryo/yöntem kombinasyonunda kapasite, son tarih, enerji ve maliyet tutarlılığını; uygun olmayan işlerin reddini ve tekrarlanabilirliği kontrol eder.

## Sınırlar

Tüm veriler sentetiktir. Elektrik fiyatı gerçek tarife veya Atomarine verisi değildir. Deniz sıcaklığı, PUE, iletişim, bakım ve yakıt sistemleri ayrıntılı fizik modelleriyle temsil edilmez. Arıza tahmini, gerçek dijital ikiz ve reaktör kontrolü uygulanmamıştır. Bu proje iş planlama prototipidir.

## GitHub

Bu klasörün içeriğini bir depoya ekleyin. GitHub Pages ayarlarında ana dalı ve kök klasörü seçerek statik demoyu yayınlayabilirsiniz. Herhangi bir API anahtarı gerektirmez.

## İlham kaynağı

- https://www.ycombinator.com/companies/atomarine
- https://atomarine.co/

## Lisans

MIT — LICENSE dosyasına bakın.
