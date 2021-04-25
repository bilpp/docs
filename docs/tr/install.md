# Kurulum

::: danger Uyarı
Bilpp **beta yazılımıdır**. Bu, hala bazı eksik özelliklere ve hatalara sahip olduğu anlamına gelir 🐛🐞 ve bir noktada - er ya da geç - muhtemelen kırılacaktır! 💥

Beta, tamamen bu sorunları çözmek ve Bilpp'u iyileştirmekle ilgilidir. **Ne yaptığınızı bilmiyorsanız lütfen üretimde Bilpp kullanmayın**. İşler ters giderse sizi destekleyemeyiz. Sonraki sürümlere yükseltmek mümkün olacak, ancak ellerinizi kirletmeyi içerebilir.
:::

::: tip Hızlı test?
Bilpp'u [gösteri forumlarımızdan](https://discuss.bilpp.com/d/21101) birinde denemekten çekinmeyin. Veya Bilpp ekibine bağlı olmayan ücretsiz bir topluluk hizmeti olan [Free Bilpp](https://www.freebilpp.com)'da kendi forumunuzu birkaç saniye içinde kurun.
:::

## Sunucu Gereksinimleri

Bilpp'u kurmadan önce, sunucunuzun gereksinimleri karşılayıp karşılamadığını kontrol etmeniz önemlidir. Bilpp'u çalıştırmak için şunlara ihtiyacınız olacak:

* **Apache** (mod_rewrite etkin) veya **Nginx**
* **PHP 7.3+** şu uzantılar aktif olmalı: curl, dom, gd, json, mbstring, openssl, pdo\_mysql, tokenizer, zip
* **MySQL 5.6 +** veya **MariaDB10.0.5+**
Composer'ı çalıştırmak için **SSH (komut satırı) erişimi**

::: tip Paylaşımlı Hosting
Bu aşamada, bir ZIP dosyası indirerek ve dosyaları web sunucunuza yükleyerek Bilpp'u kurmanız mümkün değildir. Bunun nedeni, Bilpp'un komut satırında çalışması gereken [Composer](https://getcomposer.org) adlı bir bağımlılık yönetim sistemi kullanmasıdır.

Bu mutlaka bir VPS'ye ihtiyacınız olduğu anlamına gelmez. Bazı paylaşılan ana bilgisayarlar size, Composer ve Bilpp'u sorunsuz bir şekilde yükleyebilmeniz için SSH erişimi sağlar. SSH'siz diğer ana bilgisayarlar için [Pockethold](https://github.com/andreherberth/pockethold) gibi geçici çözümleri deneyebilirsiniz.
:::

## Yükleme

Bilpp, bağımlılıklarını ve uzantılarını yönetmek için [Composer](https://getcomposer.org) kullanır. Bilpp'u kurmadan önce, makinenize [Composer'ı kurmanız](https://getcomposer.org) gerekir. Daha sonra, bu komutu Bilpp'un yüklenmesini istediğiniz boş bir konumda çalıştırın:

```bash
composer create-project bilpp/bilpp . --stability=beta
```

Bu komut çalışırken web sunucunuzu yapılandırabilirsiniz. Root klasörünüzü `/path/to/your/forum/public` olarak ayarlandığından emin olmanız ve aşağıdaki talimatlara göre [URL Yeniden Yazma] (# url-yeniden yazma) ayarlamanız gerekir.

Her şey hazır olduğunda, bir web tarayıcısında forumunuza gidin ve kurulumu tamamlamak için talimatları izleyin.

## URL Yönlendirme

### Apache

Bilpp, `public` dizininde bir `.htaccess` dosyası içerir - doğru şekilde yüklendiğinden emin olun. **`mod_rewrite` etkin değilse veya `.htaccess` e izin verilmiyorsa Bilpp düzgün çalışmayacaktır.** Bu özelliklerin etkin olup olmadığını barındırma sağlayıcınıza danışın. Kendi sunucunuzu yönetiyorsanız, `.htaccess` dosyalarını etkinleştirmek için site yapılandırmanıza aşağıdakileri eklemeniz gerekebilir:

```
<Directory "/path/to/bilpp/public">
    AllowOverride All
</Directory>
```

Bu, htaccess geçersiz kılmalarına izin verilmesini sağlar, böylece Bilpp URL'leri düzgün şekilde yeniden yazabilir.

`mod_rewrite` ı etkinleştirme yöntemleri işletim sisteminize bağlı olarak değişir. Ubuntu'da `sudo a2enmod rewrite` çalıştırarak etkinleştirebilirsiniz. CentOS'ta `mod_rewrite` varsayılan olarak etkindir. Değişiklikler yaptıktan sonra Apache'yi yeniden başlatmayı unutmayın!

### Nginx

Bilpp bir `.nginx.conf` dosyası içerir - doğru şekilde yüklendiğinden emin olun. Ardından, Nginx içinde kurulmuş bir PHP siteniz olduğunu varsayarak, sunucunuzun yapılandırma bloğuna aşağıdakileri ekleyin:

```nginx
include /path/to/bilpp/.nginx.conf;
```

### Caddy

Caddy, Bilpp'un düzgün çalışması için çok basit bir konfigürasyon gerektirir. URL'yi kendi URL'niz ile ve dizinide de kendi `public` klasörünüzün dizini ile değiştirmeniz gerektiğini unutmayın. PHP'nin farklı bir sürümünü kullanıyorsanız, doğru PHP yükleme soketinize veya URL'nize işaret etmek için `fastcgi` dizinini de değiştirmeniz gerekecektir.

```
www.example.com {
    root * /var/www/bilpp/public
    try_files {path} {path}/ /index.php
    php_fastcgi / /var/run/php/php7.4-fpm.sock php
    header /assets {
        +Cache-Control "public, must-revalidate, proxy-revalidate"
        +Cache-Control "max-age=25000"
        Pragma "public" 
    }
    encode gzip
}
```

## Klasör Sahipliği

Kurulum sırasında Bilpp, belirli dizinleri yazılabilir hale getirmenizi isteyebilir. Linux'ta bir dizine yazma erişimine izin vermek için aşağıdaki komutu yürütün:

```bash
chmod 775 /path/to/directory
```

Bilpp hem dizine hem de içeriğine yazma erişimi isterse, dizin içindeki tüm dosyalar ve klasörler için izinlerin güncellenmesi için `-R` bayrağını eklemeniz gerekir:

```bash
chmod 775 -R /path/to/directory
```

Bu adımları tamamladıktan sonra, Bilpp izinleri değiştirmenizi istemeye devam ederse, dosyalarınızın doğru gruba ve kullanıcıya ait olup olmadığını kontrol etmeniz gerekebilir.

Varsayılan olarak, çoğu Linux dağıtımında `www-data` hem PHP'nin hem de web sunucusunun altında çalıştığı grup ve kullanıcıdır. Çoğu Linux işletim sisteminde klasör sahipliğini, `chown -R www-data:www-data foldername/` komutunu çalıştırarak değiştirebilirsiniz.

Linux'ta dosya izinleri ve sahipliğinin yanı sıra bu komutlar hakkında daha fazla bilgi edinmek için [bu öğretici](https://www.thegeekdiary.com/understanding-basic-file-permissions-and-ownership-in-linux/)'yi okuyun . Windows'ta Bilpp kuruyorsanız cevaplarınızı bulabilirsiniz, [Bu Süper Kullanıcı sorusunun](https://superuser.com/questions/106181/equivalent-of-chmod-to-change-file-permissions-in-windows) kullanışlı.

::: tip Ortamlar değişiklik gösterebilir
Ortamınız sağlanan belgelerden farklı olabilir, lütfen PHP ve web sunucusunun altında çalıştığı uygun kullanıcı ve grup için web sunucusu yapılandırmanıza veya web barındırma sağlayıcınıza danışın.
:::

::: danger Asla izinlerde 777 kullanma
Bu izin düzeyi, kullanıcı veya gruptan bağımsız olarak herkesin klasör ve dosyanın içeriğine erişmesine izin verdiğinden, hiçbir klasör veya dosyayı asla `777` izin düzeyine ayarlamamalısınız.
:::

## Dizinleri Özelleştirme

Varsayılan olarak Bilpp'un dizin yapısı, yalnızca herkesin erişebileceği dosyaları içeren bir `public` dizini içerir. Bu, tüm hassas kaynak kodu dosyalarının web kökünden tamamen erişilemez olmasını sağlayan en iyi güvenlik uygulamasıdır.

Bununla birlikte, Bilpp'u bir alt dizinde (`siteniz.com/forum` gibi) barındırmak isterseniz veya sunucunuz web kökünüz üzerinde kontrol sağlamazsa (`public_html` veya `htdocs` gibi), Bilpp'u `public` dizini olmadan kurabilirsiniz.

Basitçe `public` dizini (`.htaccess` dahil) içindeki tüm dosyaları Bilpp'a hizmet vermek istediğiniz dizine taşıyın. Daha sonra hassas kaynakları korumak için `.htaccess` i düzenleyin ve 9-15 satırlarının `#` işaretini kaldırın. Nginx için `.nginx.conf` un 8-11 satırlarının `#` işaretini kaldırın.

Ayrıca `index.php` dosyasını düzenlemeniz ve aşağıdaki satırı değiştirmeniz gerekecektir:

```php
$site = require './site.php';
```

Son olarak, `site.php` dosyasını düzenleyin ve aşağıdaki satırlardaki yolları yeni dizin yapınızı yansıtacak şekilde güncelleyin:

```php
'base' => __DIR__,
'public' => __DIR__,
'storage' => __DIR__.'/storage',
```

## Verileri İçe Aktarma

Mevcut bir topluluğunuz varsa ve sıfırdan başlamak istemiyorsanız, mevcut verilerinizi Bilpp'a aktarabilirsiniz. Henüz resmi uzantı bulunmamakla birlikte, topluluk birkaç resmi olmayan uzantı yaptı:

* [FluxBB](https://discuss.bilpp.com/d/3867-fluxbb-to-bilpp-migration-tool)
* [MyBB](https://discuss.bilpp.com/d/5506-mybb-migrate-script)
* [phpBB](https://discuss.bilpp.com/d/1117-phpbb-migrate-script-updated-for-beta-5)
* [SMF2](https://github.com/ItalianSpaceAstronauticsAssociation/smf2_to_bilpp)

Bunlar, önce phpBB'ye, sonra Bilpp'a geçerek diğer forum yazılımları için de kullanılabilir. Bunların işe yarayacağını garanti edemeyeceğimizi ve onlar için destek sunamayacağımızı unutmayın.
