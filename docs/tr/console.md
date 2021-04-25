# Konsol

Yönetici kontrol paneline ek olarak Bilpp, forumunuzu terminal üzerinden yönetmenize yardımcı olmak için çeşitli konsol komutları sağlar.

Konsolu kullanmak için:

1. Bilpp kurulumunuzun barındırıldığı sunucuya `ssh `ile bağlanın.
2. Bilpp yüklü klasöre `cd` komutu ile gidin.
3. `php bilpp [command]` komutunu çalıştırın.

## Varsayılan Komutlar

### list

Mevcut tüm yönetim komutlarını ve ayrıca yönetim komutlarını kullanma talimatlarını listeler.

### help

`php bilpp help [command_name]`

Belirli bir komut için yardım çıktısını görüntüler.

`--format` seçeneğini kullanarak yardımın çıktısını başka formatlarda da yapabilirsiniz:

`php bilpp help --format=xml list`

Mevcut komutların listesini görüntülemek için lütfen `list` komutunu kullanın.

### info

`php bilpp info`

Bilpp’un çekirdek ve kurulu uzantıları hakkında bilgi toplayın. Bu, hata ayıklama sorunları için çok kullanışlıdır ve destek talep edilirken paylaşılmalıdır.

### cache:clear

`php bilpp cache:clear`

Oluşturulan js/css, metin biçimlendirici önbelleği ve önbelleğe alınmış çeviriler dahil olmak üzere arka uç Bilpp önbelleğini temizler. Bu, uzantıları yükledikten veya kaldırdıktan sonra çalıştırılmalıdır ve sorun ortaya çıktığında bunu çalıştırmak ilk adım olmalıdır.

### migrate

`php bilpp migrate`

Bekleyen tüm geçişleri çalıştırır. Bu, veritabanını değiştiren bir uzantı eklendiğinde veya güncellendiğinde kullanılmalıdır.

### migrate:reset

`php bilpp migrate:reset --extension [extension_id]`

Bir uzantı için tüm geçişleri sıfırlayın. Bu, çoğunlukla uzantı geliştiricileri tarafından kullanılır, ancak bazen, bir uzantıyı kaldırıyorsanız ve tüm verilerini veritabanından temizlemek istiyorsanız bunu çalıştırmanız gerekebilir. Lütfen bunun çalışması için söz konusu uzantının şu anda yüklü olması ancak mutlaka etkinleştirilmesi gerekmediğini unutmayın.
