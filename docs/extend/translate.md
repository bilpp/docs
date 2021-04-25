# Translating Bilpp

### LanguagePack

As simplest extender, the [`LanguagePack` extender](https://github.com/bilpp/core/blob/master/src/Extend/LanguagePack.php) allows you to define that your extension is a language pack.

This extender has no setters. All you have to do is instantiate it, make sure you language pack is in the `locale` folder, and you're done!

Here's a quick example from [Bilpp English](https://github.com/bilpp/lang-english/blob/master/extend.php):

```php
<?php

return new Bilpp\Extend\LanguagePack;
```

*Easy, right?*


### Language Packs

However, the process is a bit different for language packs. With a language pack, the only thing you'll need to have in your `extend.php` is the following:

```php
<?php

return new Bilpp\Extend\LanguagePack;
```

The `composer.json` will also need to be updated. It now needs a `bilpp-locale` info object in `extra`, like `bilpp-extension`. You can simply insert the following underneath the value of `bilpp-extension` while remaining inside `extra`:

```json
"bilpp-locale": {
  "code": "en",
  "title": "English"
}
```

And that's it! It should work out of the box.
