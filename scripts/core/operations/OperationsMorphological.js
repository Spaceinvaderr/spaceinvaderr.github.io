(function (root) {
    'use strict';

    const OperationsMorphological = {
        erode: function (contextWindow, params) {
            const can = contextWindow.settings.picture.canvas;
            const ctx = can.ctx;
            const figure = params.figure;
            const width = can.settings.width;
            const height = can.settings.height;

            const pixelsChannels = can.getDataImage();
            const pixelsChannelsData = pixelsChannels.data;
            const len = pixelsChannelsData.length;

            // Get only first channel per each pixel from image.
            const pixelsArray = can.getOneChannelOfPixels();

            // Convert list of pixels to matrix for quicker calculation.
            const pixelsMatrix = root.CanvasHelper.toPixelMatrix(pixelsArray, width);

            // Add border to matrix of pixels.
            const pixelsWithBorder = root.CanvasHelper.completePixelArray(pixelsMatrix, -1);

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
            const can = contextWindow.settings.picture.canvas;
            const ctx = can.ctx;
            const figure = params.figure;
            const width = can.settings.width;
            const height = can.settings.height;

            const pixelsChannels = can.getDataImage();
            const pixelsChannelsData = pixelsChannels.data;
            const len = pixelsChannelsData.length;

            // Get only first channel per each pixel from image.
            const pixelsArray = can.getOneChannelOfPixels();

            // Convert list of pixels to matrix for quicker calculation.
            const pixelsMatrix = root.CanvasHelper.toPixelMatrix(pixelsArray, width);

            // Add border to matrix of pixels.
            const pixelsWithBorder = root.CanvasHelper.completePixelArray(pixelsMatrix, -1);

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
