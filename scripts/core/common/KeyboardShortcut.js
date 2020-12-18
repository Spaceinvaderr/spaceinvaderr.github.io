/*global WeakMap */

(function (root) {
    'use strict';

    let shortcuts = new WeakMap();

    let KeyboardShortcut = {

        handler: function (evt) {
            let shortcut = [];

            if (evt.metaKey) {
                if (root.Utilities.isDarwin()) {
                    shortcut.push('Ctrl');
                } else {
                    shortcut.push('Meta');
                }
            }

            if (evt.ctrlKey) {
                shortcut.push('Ctrl');
            }

            if (evt.shiftKey) {
                shortcut.push('Shift');
            }

            let char = String.fromCharCode(evt.keyCode);
            shortcut.push(char);

            let definedShortcut = shortcuts[shortcut];

            if (definedShortcut) {
                definedShortcut.call();
            }
        },

        add: function (type, callback) {
            let elements = _.map(type.split('-'), function (item) {
                return item.trim();
            });
            shortcuts[elements] = callback;
        }

    };

    // Export `KeyboardShortcut`.
    return (root.KeyboardShortcut = KeyboardShortcut);

}(this));
