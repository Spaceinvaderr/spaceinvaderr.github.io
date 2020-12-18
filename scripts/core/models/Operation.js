(function (root) {
    'use strict';

    let Operation = function (op, ctx) {
        ctx = ctx || this;

        root.Status.wait();

        setTimeout(function () {
            op.call(ctx);

            root.Status.idle();
        }, 10);
    };

    // Exports `Operation`.
    return (root.Operation = Operation);

}(this));
