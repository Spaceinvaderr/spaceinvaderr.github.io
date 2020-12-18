(function (root) {
    'use strict';

    let InputRangeHelper = {
        _triggerEvent: function (element, type) {
            let evObj;

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
                let shortButton = root.Utilities.isDarwin() ? evt.metaKey : evt.ctrlKey;
                let cacheValue = $input.value;

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
