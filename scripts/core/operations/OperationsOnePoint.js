(function (root) {
    'use strict';

    const OperationsOnePoint = {

        // Operacje -> Jednopunktowe -> Odwrotność (negacja)
        onePointNegative: function (contextWindow) {
            const can = contextWindow.settings.picture.canvas;
            const ctx = can.ctx;

            const pixelsChannels = can.getDataImage();
            const pixelsChannelsData = pixelsChannels.data;
            const len = pixelsChannelsData.length;

            let i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                // Negative value.
                color = 255 - color;

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Progowanie
        onePointThreshold: function (contextWindow, params) {
            const can = contextWindow.settings.picture.canvas;
            const ctx = can.ctx;

            const pixelsChannels = can.getDataImage();
            const pixelsChannelsData = pixelsChannels.data;
            const len = pixelsChannelsData.length;
            const hold = parseInt(params.value, 10);

            let i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                // If more than holder returns 255 (white) otherwise 0 (black).
                color = (color > hold) ? 255 : 0;

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Redukcja poziomów szarości
        onePointPosterize: function (contextWindow, params) {
            const can = contextWindow.settings.picture.canvas;
            const ctx = can.ctx;

            const pixelsChannels = can.getDataImage();
            const pixelsChannelsData = pixelsChannels.data;
            const len = pixelsChannelsData.length;
            const levels = parseInt(params.value, 10);

            let numOfAreas = 256 / levels;
            let numOfValues = 255 / (levels - 1);

            let i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                // for more comments see http://www.axiomx.com/posterize.htm
                let colorAreaFloat = color / numOfAreas;
                let colorArea = parseInt(colorAreaFloat, 10);

                if (colorArea > colorAreaFloat) {
                    colorArea = colorArea - 1;
                }

                let newColorFloat = numOfValues * colorArea;
                let newColor = parseInt(newColorFloat, 10);

                if (newColor > newColorFloat) {
                    newColor = newColor - 1;
                }

                color = newColor;

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Rozciąganie
        onePointStretching: function (contextWindow, params) {
            const can = contextWindow.settings.picture.canvas;
            const ctx = can.ctx;

            const pixelsChannels = can.getDataImage();
            const pixelsChannelsData = pixelsChannels.data;
            const len = pixelsChannelsData.length;
            const min = parseInt(params.value.min, 10);
            const max = parseInt(params.value.max, 10);

            let i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                if (color <= min || color > max) {
                    color = 0;
                } else {
                    color = Math.round((color - min) * (255 / (max - min)));
                }

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Regulacja jasnością
        onePointBrightnessRegulation: function (contextWindow, params) {
            const can = contextWindow.settings.picture.canvas;
            const ctx = can.ctx;

            const pixelsChannels = can.getDataImage();
            const pixelsChannelsData = pixelsChannels.data;
            const len = pixelsChannelsData.length;
            const hold = parseInt(params.value, 10);

            let i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                color += color * (hold / 100);

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Regulacja kontrastem
        onePointContrastRegulation: function (contextWindow, params) {
            const can = contextWindow.settings.picture.canvas;
            const ctx = can.ctx;

            const pixelsChannels = can.getDataImage();
            const pixelsChannelsData = pixelsChannels.data;
            const len = pixelsChannelsData.length;
            const hold = parseInt(params.value, 10);

            const uniquePixelsChannels = can.getUniqueChannels();
            const multiplier = (100.0 + hold) / 100.0;
            const lmax = (uniquePixelsChannels.length - 1);

            let i, color, temp;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                temp = (color / lmax) - 0.5;
                temp = temp * multiplier + 0.5;
                color = Math.max(0, Math.min(uniquePixelsChannels.length - 1, temp * lmax));

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Regulacja korekcją gamma
        onePointGammaRegulation: function (contextWindow, params) {
            const can = contextWindow.settings.picture.canvas;
            const ctx = can.ctx;

            const pixelsChannels = can.getDataImage();
            const pixelsChannelsData = pixelsChannels.data;
            const len = pixelsChannelsData.length;
            const hold = parseInt(params.value, 10);

            let uniquePixelsChannels = can.getUniqueChannels();
            let upo = new Array(uniquePixelsChannels.length);
            let lmax = (uniquePixelsChannels.length - 1);

            let j, pos;

            for (j = 0; j < uniquePixelsChannels.length; ++j) {
                pos = (lmax * Math.pow(j / lmax, 1.0 / hold)) + 0.5;
                pos = Math.min(Math.max(pos, 0), uniquePixelsChannels.length - 1);
                upo[j] = pos;
            }

            const i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                color = upo[color];

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Arytmetyczne i Logiczne
        onePointArithmeticalLogical: function (contextWindow, params) {
            const can = contextWindow.settings.picture.canvas;
            const ctx = can.ctx;

            const pixelsChannels = can.getDataImage();
            const pixelsChannelsData = pixelsChannels.data;
            const len = pixelsChannelsData.length;

            const firstPicturePixels = params.firstPicture.canvas.getAllChannelsOfPixels();
            const secondPicturePixels = params.secondPicture.canvas.getAllChannelsOfPixels();

            let i, color, first, second;

            switch (params.operation) {
                case 'add':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = (first + second) / 2;

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;

                case 'sub':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = Math.abs(first - second);

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;

                case 'mul':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = (first * second) + first;

                        // Save protection (0 - 255).
                        color = root.Utilities.intToByte(color);

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;
                case 'or':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = first || second;

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;

                case 'and':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = first && second;

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;

                case 'xor':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = first ^ second;

                        // Save protection (0 - 255).
                        color = root.Utilities.intToByte(color);

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Okno -> UOP
        onePointUOP: function (contextWindow, params) {
            const can = contextWindow.settings.picture.canvas;
            const canCopy = params.copy.canvas;

            const pixelsChannels = canCopy.getDataImage();
            const pixelsChannelsData = pixelsChannels.data;
            const len = pixelsChannelsData.length;

            let i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                // When current color is color from start position, change it to ending color.
                color = params.colors[color];

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            can.ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        }
    };

    // Exports `OperationsOnePoint`.
    return (root.OperationsOnePoint = OperationsOnePoint);

}(this));
