(function (root) {
    'use strict';

    let OperationsMorphological = {
        erode: function (contextWindow, params) {
            let can = contextWindow.settings.picture.canvas;
            let ctx = can.ctx;
            let figure = params.figure;
            let width = can.settings.width;
            let height = can.settings.height;

            let pixelsChannels = can.getDataImage();
            let pixelsChannelsData = pixelsChannels.data;
            let len = pixelsChannelsData.length;

            // Get only first channel per each pixel from image.
            let pixelsArray = can.getOneChannelOfPixels();

            // Convert list of pixels to matrix for quicker calculation.
            let pixelsMatrix = root.CanvasHelper.toPixelMatrix(pixelsArray, width);

            // Add border to matrix of pixels.
            let pixelsWithBorder = root.CanvasHelper.completePixelArray(pixelsMatrix, -1);

            let i, color, x, y, dimensions, ne;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];
                dimensions = root.CanvasHelper.convertPositionIndexToXY(width, height, i);

                x = dimensions.x;
                y = dimensions.y;

                ne = root.CanvasHelper.getNeighbors(pixelsWithBorder, x + 1, y + 1, figure);

                color = _.min(ne);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        dilate: function (contextWindow, params) {
            let can = contextWindow.settings.picture.canvas;
            let ctx = can.ctx;
            let figure = params.figure;
            let width = can.settings.width;
            let height = can.settings.height;

            let pixelsChannels = can.getDataImage();
            let pixelsChannelsData = pixelsChannels.data;
            let len = pixelsChannelsData.length;

            // Get only first channel per each pixel from image.
            let pixelsArray = can.getOneChannelOfPixels();

            // Convert list of pixels to matrix for quicker calculation.
            let pixelsMatrix = root.CanvasHelper.toPixelMatrix(pixelsArray, width);

            // Add border to matrix of pixels.
            let pixelsWithBorder = root.CanvasHelper.completePixelArray(pixelsMatrix, -1);

            let i, color, x, y, dimensions, ne;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];
                dimensions = root.CanvasHelper.convertPositionIndexToXY(width, height, i);

                x = dimensions.x;
                y = dimensions.y;

                ne = root.CanvasHelper.getNeighbors(pixelsWithBorder, x + 1, y + 1, figure);

                color = _.max(ne);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        open: function () {
            this.erode.apply(this, arguments);
            this.dilate.apply(this, arguments);
        },

        close: function () {
            this.dilate.apply(this, arguments);
            this.erode.apply(this, arguments);
        }
    };

    // Exports `OperationsMorphological`.
    return (root.OperationsMorphological = OperationsMorphological);

}(this));
