(function (root) {
    'use strict';

    // Aliases.
    let doc = root.document;

    let FileOpenHelper = function FileOpenHelper(params) {
        this.settings = {

        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(root.WindowManager.RENDER_AREA_ID);
        this.$input = null;

        this.initialize();
    };

    FileOpenHelper.prototype = new root.AbstractFileHelper();
    FileOpenHelper.prototype.constructor = FileOpenHelper;

    FileOpenHelper.prototype.createInput = function () {
        let self = this;

        this.$input = doc.createElement('input');
        this.$input.setAttribute('type', 'file');
        this.$input.setAttribute('multiple', 'multiple');
        this.$input.classList.add('hide');
        this.$input.addEventListener('change', function () {
            let files = [];

            _.each(self.$input.files, function (image) {
                files.push({
                    file: image.path,
                    name: image.name
                });
            });

            self.emit(root.AbstractFileHelper.EVENTS.LOAD_FILES, files);
            self.remove();
        });
        this.$input.click();
    };

    // Export `FileOpenHelper`.
    return (root.FileOpenHelper = FileOpenHelper);

}(this));
