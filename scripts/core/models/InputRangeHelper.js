(function (root) {
    'use strict';

    const InputRangeHelper = {
        _triggerEvent: function (element, type) {
            const evObj;

            if (element.fireEvent) {
                element.fireEvent('on' + type);
            } else {
                evObj = root.document.createEvent('Events');
                evObj.initEvent(type, true, false);
                element.dispatchEvent(evObj);
            }
        },

        bindKeyShortcuts: function ($input) {
            $input.addEventListener('keydown', function (evt) {
                const shortButton = root.Utilities.isDarwin() ? evt.metaKey : evt.ctrlKey;
                const cacheValue = $input.value;

                if (shortButton) {
                    switch (evt.keyCode) {
                        case 48: $input.value = $input.defaultValue; break;
                        case 189: $input.value--; break;
                        case 187: $input.value++; break;
                    }
                }

                if ($input.value !== cacheValue) {
                    InputRangeHelper._triggerEvent($input, 'change');
                }
            });
        }
    };

    // Exports `InputRangeHelper`
    return (root.InputRangeHelper = InputRangeHelper);

}(this));
