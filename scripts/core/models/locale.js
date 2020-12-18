(function (root) {
    'use strict';

    const Locale = (root.Locale = root.Locale || {});

    Locale.__name__ = 'pl_PL';

    Locale.get = function (key) {
        return Locale[Locale.__name__][key];
    };

}(this));
