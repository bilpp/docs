var locale, dir, file_path, tip, outdated_tip, processing_tip, is_processing;

function initTip(locale) {
    switch (locale) {
        case 'en':
            outdated_tip = 'The translation of this page may not be up to date, please refer to the <a>English document</a> for the latest information. If there is a problem with the translation, please <a>let us know</a>.';
            processing_tip = 'The translation of extend documents is still a work in progress, please refer to the <a>English document</a> for the latest information. If you have problems with the translation, please <a>let us know</a>.';
            is_processing = false;
            break;
        case 'tr':
            outdated_tip = 'The translation of this page may not be up to date, please refer to the <a>English document</a> for the latest information. If there is a problem with the translation, please <a>let us know</a>.';
            processing_tip = 'The translation of extend documents is still a work in progress, please refer to the <a>English document</a> for the latest information. If you have problems with the translation, please <a>let us know</a>.';
            is_processing = true;
            break;
        default:
            break;
    }
}


var title = document.title;
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var target = document.querySelector('head > title');
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
        if (title != document.title) {
            showTip();
            title = document.title;
        }
    });
});

observer.observe(target, {
    subtree: true,
    characterData: true,
    childList: true,
});


locale = document.getElementsByTagName("html").item(0).getAttribute("lang").substring(0, 2);
initTip(locale);

function showTip() {

    url = window.location.pathname;

    locale = document.getElementsByTagName("html").item(0).getAttribute("lang").substring(0, 2);
    if (locale != 'en') {
        dir = url.substring(3, url.lastIndexOf('/'));
        file_path = url.substring(url.lastIndexOf('/'));
        href = dir + file_path;

        initTip(locale);

        tip = (dir == '/extend' && is_processing) ? processing_tip : outdated_tip;
        try {
            document.querySelector('div.theme-default-content').insertAdjacentHTML('afterbegin', '<div class="notification-container blue"><div class="outdated-tip"><p>' + tip + '</p></div></div>'
            );

            var tip_a = document.querySelectorAll('div.outdated-tip p a');

            tip_a[0].setAttribute("href", href);
            tip_a[0].setAttribute("target", "_blank");
            tip_a[1].setAttribute("href", "https://github.com/bilpp/docs/issues");
            tip_a[1].setAttribute("target", "_blank");
        } catch (error) {

        }
    }
}

window.onload = showTip;
