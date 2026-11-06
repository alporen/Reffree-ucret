# Hakem Ücret Takibi — Windows uygulaması

## Çalıştırma

`HakemUygulamasi.exe` dosyasına çift tıklayın. Kurulum veya Node.js gerekmez. Uygulama bu bilgisayarda açılır; internet bağlantısı olmadan maç kaydı, aylık tablo ve sezon sıfırlama özellikleri kullanılabilir. Grafik ve Excel dışa aktarma için internet bağlantısı gerekebilir.

## Veriler

Her bilgisayar kendi SQLite veritabanını kullanır. Taşınabilir `.exe` dosyasını arkadaşınıza gönderirken `data` klasörünü göndermeyin. Program ilk açılışta exe'nin yanına `data\hakem.sqlite` dosyasını oluşturur. Aynı bilgisayarda exe'yi aynı klasörden açmaya devam edin; veriler o klasörde kalır.

Bu sürümde kullanıcı girişi ve yönetici hesabı yoktur. Bilgisayara erişebilen herkes uygulamadaki maç kayıtlarını görebilir ve düzenleyebilir. Bir bilgisayardaki kayıtlar diğer bilgisayara aktarılmaz.

Sezon değişiminde üstteki profil simgesini açıp **Yeni sezon** bölümünden kayıtları sıfırlayabilirsiniz. Bu işlem o bilgisayardaki tüm maç kayıtlarını kalıcı olarak siler. Yedek almak için uygulamayı kapatıp `data` klasörünü kopyalayın.

## Windows uygulamasını yeniden derleme

Node.js 22 veya üzeri kurulu bir geliştirme bilgisayarında proje klasöründe:

```powershell
npm install
npm run dist:win
```

Oluşan tek dosyalık uygulama `dist\HakemUygulamasi.exe` yolunda olur. Derleme paketine hiçbir bilgisayarın `data` klasörü eklenmez.
