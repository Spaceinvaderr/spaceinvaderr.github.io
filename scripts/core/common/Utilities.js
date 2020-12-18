/*global process */

(function (root) {
    'use strict';

    const Utilities = {

        isDarwin: function () {
            return process.platform === 'darwin';
        },

        max: function () {
            let args = _.toArray(arguments);

            // Remove non-numbers elements, ex. all `undefined` values.
            let numbers = _.filter(args, function (item) {
                return !isNaN(item);
            });

            // Get maximum of numbers list.
            return Math.max.apply(Math, numbers);
        },

        average: function () {
            let args = _.toArray(arguments);

            // Remove non-numbers elements, ex. all `undefined` values.
            let numbers = _.filter(args, function (item) {
                return !isNaN(item);
            });

            // Calculate summary of all numbers.
            let sum = numbers.reduce(function (mem, item) {
                return mem + (item || 0);
            }, 0);

            // Calculate arithmetic average: sum of all elements by their count.
            return sum / numbers.length;
        },

        intToByte: function (i) {
            // When value is more than 255, should be equal 255.
            i = (i > 255) ? 255 : i;

            // When value is less than 0, should be equal 0.
            i = (i < 0) ? 0 : i;

            // If is that numbers return them. Otherwise return modify value.
            return i;
        },

        walkTheDOM: function (node, func) {
            func(node);
            node = node.firstChild;

            while (node) {
                this.walkTheDOM(node, func);
                node = node.nextSibling;
            }
        },

        sortNumbers: function (a, b) {
            let type = 0;

            if (a > b) {
                type = 1;
            } else if (a < b) {
                type = -1;
            }

            return type;
        },

        sum: function (array) {
            return _.reduce(array, function (memo, i) {
                return memo + i;
            }, 0);
        },

        hex2rgb: function (hex) {
            let bigint = parseInt(hex, 16);
            let r = (bigint >> 16) & 255;
            let g = (bigint >> 8) & 255;
            let b = bigint & 255;

            return [r, g, b];
        }

    };

    // Export `Utilities`.
    return (root.Utilities = Utilities);

}(this));
