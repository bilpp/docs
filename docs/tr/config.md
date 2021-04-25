# Yapılandırma Dosyası

Bilpp yapılandırmasının Bilpp yönetici panosu (veritabanı hariç) aracılığıyla değiştirilemeyeceği tek bir yer vardır ve bu, Bilpp kurulu klasörde bulunan `config.php` dosyasıdır.

Bu dosya küçük de olsa Bilpp kurulumunuzun çalışması için çok önemli olan ayrıntıları içerir.

Dosya varsa, Bilpp'a zaten kurulu olduğunu söyler.
Ayrıca Bilpp'a veritabanı bilgisi ve daha fazlasını sağlar.

Örnek bir dosyayla her şeyin ne anlama geldiğine dair hızlı bir genel bakış:

```php
<?php return array (
  'debug' => false, // sorunları gidermek için kullanılan hata ayıklama modunu etkinleştirir veya devre dışı bırakır
  'database' =>
  array (
    'driver' => 'mysql', // veritabanı sürücüsü, yani MySQL, MariaDB...
    'host' => 'localhost', // bağlantının ana bilgisayarı, harici bir hizmet kullanılmadığı sürece çoğu durumda localhost
    'database' => 'bilpp', // veritabanının adı
    'username' => 'root', // veritabanı kullanıcı adı
    'password' => '', // veritabanı şifresi
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '', // veritabanındaki tablolar için önek, aynı veritabanını başka bir hizmetle paylaşıyorsanız kullanışlıdır
    'port' => '3306', // veritabanı bağlantısının portu, MySQL ile varsayılan olarak 3306'dır
    'strict' => false,
  ),
  'url' => 'https://bilpp.localhost', // URL kurulumu, etki alanlarını değiştirirseniz bunu değiştirmek isteyeceksiniz
  'paths' =>
  array (
    'api' => 'api', // /api , API'ye gider.
    'admin' => 'admin', // /admin , yönetici paneline gider.
  ),
);
```
