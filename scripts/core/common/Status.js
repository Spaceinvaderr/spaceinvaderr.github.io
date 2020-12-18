(function (root) {
    'use strict';

    // Aliases.
    const doc = root.document;

    let $status;

    let Status = {

        init: function () {
            $status = doc.querySelector('#status');
            $status.innerText = root.Locale.get('MSG_WAITING');
        },

        wait: function () {
            $status.classList.remove('hidden');
        },

        idle: function () {
            setTimeout(function () {
                $status.classList.add('hidden');
            }, 200);
        }

    };

    // Exports `Status`;
    return (root.Status = Status);

}(this));
