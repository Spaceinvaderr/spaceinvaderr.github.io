/*global require */

(function (root) {
    'use strict';

    let path = require('path');
    let gui = require('nw.gui');

    function MenuBuilder() {
        this.windowMenu = null;

        this.filesOpenMenuItem = null;
        this.fileSaveMenuItem = null;
        this.closeActiveWindowMenuItem = null;
        this.closeAllWindowsMenuItem = null;
        this.closeMenuItem = null;

        this.editRestoreMenuItem = null;

        this.toolsDuplicateMenuItem = null;
        this.toolsLutMenuItem = null;
        this.toolsUOPMenuItem = null;
        this.toolsObjectsRecognitionMenuItem = null;
        this.toolsStopMotionSequenceMenuItem = null;

        this.operationsFlatteningHistogramMediumMethodMenuItem = null;
        this.operationsFlatteningHistogramRandomMethodMenuItem = null;
        this.operationsFlatteningHistogramNeighboudhoodMethodMenuItem = null;
        this.operationsFlatteningHistogramCustomMethodMenuItem = null;

        this.operationsOnePointNegativeMenuItem = null;
        this.operationsOnePointThresholdMenuItem = null;
        this.operationsOnePointPosterizeMenuItem = null;
        this.operationsOnePointStretchingMenuItem = null;
        this.operationsOnePointBrightnessRegulationMenuItem = null;
        this.operationsOnePointContrastRegulationMenuItem = null;
        this.operationsOnePointGammaRegulationMenuItem = null;

        this.operationsOnePointArithmeticalLogicalMenuItem = null;

        this.operationsNeighbourhoodSmoothingMenuItem = null;
        this.operationsNeighbourhoodSharpenMediumMenuItem = null;
        this.operationsNeighbourhoodSharpenMinimalMenuItem = null;
        this.operationsNeighbourhoodSharpenMaximalMenuItem = null;

        this.morphologicalOperationsMenuItem = null;
        this.turtleOperationsMenuItem = null;
        this.imageColorfulOperationsMenuItem = null;

        this.aboutAuthorsMenuItem = null;
        this.aboutHelpMenuItem = null;

        this.initialize();
        this.setup();
        this.render();
    }

    MenuBuilder.prototype.initialize = function () {
        // Create main window menu.
        this.windowMenu = new gui.Menu({ type: 'menubar' });

        // If application run under Mac OS must set that option, to fixed main window menu.
        if (root.Utilities.isDarwin()) {
            this.windowMenu.createMacBuiltin(root.Locale.get('NAME'), {
                hideEdit: false,
                hideWindow: false
            });
        }
    };

    MenuBuilder.prototype.setup = function () {
        this.setupFileMenu();
        this.setupEditMenu();
        this.setupToolsMenu();
        this.setupOperationsMenu();
        this.setupHelpMenu();
    };

    MenuBuilder.prototype.render = function () {
        // Assign main menu to window.
        gui.Window.get().menu = this.windowMenu;
    };

    MenuBuilder.prototype.addMenuItem = function (label, callback, modifiers, key) {
        if (_.isString(modifiers) && _.isString(key)) {
            root.KeyboardShortcut.add(modifiers + '-' + key, callback);
        }

        let subMenu = new gui.MenuItem({
            type: 'normal',
            label: label,
            key: key,
            modifiers: modifiers
        });

        if (_.isFunction(callback)) {
            subMenu.on('click', callback);
        }

        return subMenu;
    };

    MenuBuilder.prototype.addSeparator = function (menu) {
        let separator = new gui.MenuItem({
            type: 'separator'
        });

        menu.append(separator);

        return separator;
    };

    // Setup methods.

    MenuBuilder.prototype.setupFileMenu = function () {
        let fileMenu = new gui.Menu();

        // true - OK, false - ERROR
        function validateParams(params) {
            let i, j, name, exp;
            let supportedArray = [];
            let names = _.pluck(params, 'name');
            let supported = root.AssetsLoader.SUPPORTED_EXTENSIONS;

            for (i = 0; i < names.length; i++) {
                name = names[i];

                for (j = 0; j < supported.length; j++) {
                    exp = supported[j];
                    supportedArray.push(exp.test(name));
                }

                if (_.compact(supportedArray).length === 0) {
                    return false;
                }
            }

            return true;
        }

        function buildCanvasFromImage(picture) {
            let canvas = new root.Canvas({
                width: picture.width,
                height: picture.height
            });
            canvas.$canvas.classList.add('canvas-picture');
            canvas.loadGrayScaleImage(picture.img, picture.width, picture.height);
            return canvas;
        }

        function loadImages(params, callback) {
            let picturesLoaders = [];

            // Loop through each of file (images).
            _.each(params, function (image, index) {
                picturesLoaders.push(function () {
                    let p = new root.promise.Promise();

                    // Load selected file.
                    root.AssetsLoader.loadImage(image.file, function (file) {
                        params[index].canvas = buildCanvasFromImage(file);
                        _.extend(params[index], file);
                        p.done();
                    });

                    return p;
                });
            });

            root.promise.chain(picturesLoaders).then(callback);
        }

        function openFilHandler() {
            let multipleFile = new root.FileOpenHelper();

            multipleFile.once(root.AbstractFileHelper.EVENTS.LOAD_FILES, function (params) {
                if (!validateParams(params)) {
                    root.alert(root.Locale.get('MSG_ERR_UNSUPPORTED'));
                    return;
                }

                loadImages(params, function () {
                    if (params.length === 1) {
                        new root.PictureWindow({
                            picture: params[0]
                        });
                    } else {
                        new root.MultiplePicturesWindow({
                            pictures: params
                        });
                    }
                });
            });
        }

        function saveFileHandler() {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                activeWindow.saveAsPicture();
            }
        }

        function closeActiveWindowHandler() {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow !== null) {
                root.App.windowManager.emit(root.AbstractWindow.EVENTS.CLOSE_WINDOW, { win: activeWindow });
            }
        }

        function closeAllWindowsHandler() {
            root.App.windowManager.closeAllWindows();
        }

        // -------------------------------------------------------------------------------------------------------------

        this.filesOpenMenuItem = this.addMenuItem(root.Locale.get('FILES_OPEN'), openFilHandler, 'Ctrl', 'O');
        fileMenu.append(this.filesOpenMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.fileSaveMenuItem = this.addMenuItem(root.Locale.get('FILE_SAVE_AS'), saveFileHandler, 'Ctrl-Shift', 'S');
        fileMenu.append(this.fileSaveMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.closeActiveWindowMenuItem = this.addMenuItem(root.Locale.get('CLOSE_ACTIVE_WINDOW'), closeActiveWindowHandler, 'Ctrl', 'W');
        fileMenu.append(this.closeActiveWindowMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.closeAllWindowsMenuItem = this.addMenuItem(root.Locale.get('CLOSE_ALL_WINDOW'), closeAllWindowsHandler, 'Ctrl-Shift', 'W');
        fileMenu.append(this.closeAllWindowsMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.closeMenuItem = this.addMenuItem(root.Locale.get('CLOSE_APPLICATION'), root.close.bind(root), 'Ctrl', 'Q');
        fileMenu.append(this.closeMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.windowMenu.append(new gui.MenuItem({
            label: root.Locale.get('FILE'),
            submenu: fileMenu
        }));
    };

    MenuBuilder.prototype.setupEditMenu = function () {
        let fileMenu = new gui.Menu();

        // -------------------------------------------------------------------------------------------------------------

        this.editRestoreMenuItem = this.addMenuItem(root.Locale.get('EDIT_RESTORE'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                activeWindow.setPrimaryState();
            }
        }, 'Ctrl', 'Z');
        fileMenu.append(this.editRestoreMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.windowMenu.append(new gui.MenuItem({
            label: root.Locale.get('EDIT'),
            submenu: fileMenu
        }));
    };

    MenuBuilder.prototype.setupToolsMenu = function () {
        let toolsMenu = new gui.Menu();

        // -------------------------------------------------------------------------------------------------------------

        this.toolsDuplicateMenuItem = this.addMenuItem(root.Locale.get('TOOLS_DUPLICATE'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                let original = activeWindow.getPicture();
                let copy = _.clone(original);

                copy.canvas = original.canvas.copy();
                copy.name += ' - ' + root.Locale.get('MSG_COPY');

                new root.PictureWindow({
                    picture: copy
                });
            }
        }, 'Ctrl-Shift', 'D');
        toolsMenu.append(this.toolsDuplicateMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.addSeparator(toolsMenu);

        // -------------------------------------------------------------------------------------------------------------

        this.toolsLutMenuItem = this.addMenuItem(root.Locale.get('TOOLS_LUT'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                // Save current version.
                let current = activeWindow.getPicture().canvas;

                // Restore to original version.
                let original = new root.Canvas(current.settings);
                original.ctx.drawImage(current.toImage(), 0, 0, activeWindow.getPicture().width, activeWindow.getPicture().height);

                new root.LookUpTableWindow(activeWindow, {
                    picture: activeWindow.getPicture(),
                    canvas: {
                        current: current,
                        original: original
                    }
                });
            }
        }, 'Ctrl-Shift', 'T');
        toolsMenu.append(this.toolsLutMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.toolsUOPMenuItem = this.addMenuItem(root.Locale.get('TOOLS_UOP'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                let original = activeWindow.getPicture();
                let copy = _.clone(original);

                copy.canvas = original.canvas.copy();

                new root.UOPWindow(activeWindow, {
                    picture: copy
                });
            }
        }, 'Ctrl-Shift', 'U');
        toolsMenu.append(this.toolsUOPMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.addSeparator(toolsMenu);

        // -------------------------------------------------------------------------------------------------------------

        this.toolsObjectsRecognitionMenuItem = this.addMenuItem(root.Locale.get('TOOLS_OBJECTS_RECOGNITION'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.MultiplePicturesWindow) {
                new root.ObjectsRecognitionWindow(activeWindow, {
                    picture: activeWindow.getSelectedPicture()
                });
            } else if (activeWindow instanceof root.PictureWindow) {
                new root.ObjectsRecognitionWindow(activeWindow, {
                    picture: activeWindow.getPicture()
                });
            }
        }, 'Ctrl', 'L');
        toolsMenu.append(this.toolsObjectsRecognitionMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.toolsStopMotionSequenceMenuItem = this.addMenuItem(root.Locale.get('TOOLS_STOP_MOTION_SEQUENCE'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.MultiplePicturesWindow) {
                new root.StopMotionSequenceWindow(activeWindow, {
                    pictures: activeWindow.getPictures()
                });
            }
        }, 'Ctrl', 'K');
        toolsMenu.append(this.toolsStopMotionSequenceMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.windowMenu.append(new gui.MenuItem({
            label: root.Locale.get('TOOLS'),
            submenu: toolsMenu
        }));
    };

    MenuBuilder.prototype.setupOperationsMenu = function () {
        let operationItem = new gui.MenuItem({
            label: root.Locale.get('OPERATIONS')
        });

        // Wygładzanie histogramu
        // ----------------------

        let flatteningHistogramOperationsMenu = new gui.Menu();

        this.operationsFlatteningHistogramMediumMethodMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.Operation(function () {
                    root.OperationsFlatteningHistogram.flatteningHistogramMedium(activeWindow);
                });
            }
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramMediumMethodMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsFlatteningHistogramRandomMethodMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.Operation(function () {
                    root.OperationsFlatteningHistogram.flatteningHistogramRandom(activeWindow);
                });
            }
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramRandomMethodMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsFlatteningHistogramNeighboudhoodMethodMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.Operation(function () {
                    root.OperationsFlatteningHistogram.flatteningHistogramNeighbourhood(activeWindow);
                });
            }
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramNeighboudhoodMethodMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsFlatteningHistogramCustomMethodMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.Operation(function () {
                    root.OperationsFlatteningHistogram.flatteningHistogramCustom(activeWindow);
                });
            }
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramCustomMethodMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        let histogramOperationsMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_FLATTENING_HISTOGRAM'));
        histogramOperationsMenuItem.submenu = flatteningHistogramOperationsMenu;

        // Jednopunktowe
        // -------------

        let onePointOperationsMenu = new gui.Menu();

        this.operationsOnePointNegativeMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_NEGATIVE'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.Operation(function () {
                    root.OperationsOnePoint.onePointNegative(activeWindow);
                });
            }
        });
        onePointOperationsMenu.append(this.operationsOnePointNegativeMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointThresholdMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_THRESHOLD'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.ThresholdTool(activeWindow, {
                    picture: activeWindow.getPicture()
                });
            }
        });
        onePointOperationsMenu.append(this.operationsOnePointThresholdMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointPosterizeMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_POSTERIZE'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.PosterizeTool(activeWindow, {
                    picture: activeWindow.getPicture()
                });
            }
        }, 'Ctrl-Shift', 'R');
        onePointOperationsMenu.append(this.operationsOnePointPosterizeMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointStretchingMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_STRETCHING'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.StretchTool(activeWindow, {
                    picture: activeWindow.getPicture()
                });
            }
        });
        onePointOperationsMenu.append(this.operationsOnePointStretchingMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointBrightnessRegulationMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.BrightnessRegulationTool(activeWindow, {
                    picture: activeWindow.getPicture()
                });
            }
        });
        onePointOperationsMenu.append(this.operationsOnePointBrightnessRegulationMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointContrastRegulationMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_CONTRAST_REGULATION'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.ContrastRegulationTool(activeWindow, {
                    picture: activeWindow.getPicture()
                });
            }
        });
        onePointOperationsMenu.append(this.operationsOnePointContrastRegulationMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointGammaRegulationMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_GAMMA_REGULATION'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.GammaRegulationTool(activeWindow, {
                    picture: activeWindow.getPicture()
                });
            }
        });
        onePointOperationsMenu.append(this.operationsOnePointGammaRegulationMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointArithmeticalLogicalMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_ARITHMETICAL_LOGICAL'), function () {
            return new root.ArithmeticalLogicalTool();
        });
        onePointOperationsMenu.append(this.operationsOnePointArithmeticalLogicalMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        let onePointOperationsMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT'));
        onePointOperationsMenuItem.submenu = onePointOperationsMenu;

        // Sąsiedztwa
        // ----------

        let neighbourhoodOperationsMenu = new gui.Menu();

        // -------------------------------------------------------------------------------------------------------------

        this.operationsNeighbourhoodSmoothingMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_NEIGHBOURHOOD_SMOOTHING'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.SmoothingTool(activeWindow, {
                    picture: activeWindow.getPicture()
                });
            }
        });
        neighbourhoodOperationsMenu.append(this.operationsNeighbourhoodSmoothingMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsNeighbourhoodSharpenMediumMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_NEIGHBOURHOOD_SHARPEN_MEDIUM'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.Operation(function () {
                    root.OperationsNeighbourhood.sharpen(activeWindow, {
                        type: 'med'
                    });
                });
            }
        });
        neighbourhoodOperationsMenu.append(this.operationsNeighbourhoodSharpenMediumMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsNeighbourhoodSharpenMinimalMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_NEIGHBOURHOOD_SHARPEN_MINIMAL'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.Operation(function () {
                    root.OperationsNeighbourhood.sharpen(activeWindow, {
                        type: 'min'
                    });
                });
            }
        });
        neighbourhoodOperationsMenu.append(this.operationsNeighbourhoodSharpenMinimalMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsNeighbourhoodSharpenMaximalMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_NEIGHBOURHOOD_SHARPEN_MAXIMAL'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.Operation(function () {
                    root.OperationsNeighbourhood.sharpen(activeWindow, {
                        type: 'max'
                    });
                });
            }
        });
        neighbourhoodOperationsMenu.append(this.operationsNeighbourhoodSharpenMaximalMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        let neighbourhoodOperationsMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_NEIGHBOURHOOD'));
        neighbourhoodOperationsMenuItem.submenu = neighbourhoodOperationsMenu;

        // Morfologiczne
        // -------------

        this.morphologicalOperationsMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_MORPHOLOGICAL'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.Operation(function () {
                    new root.MorphologicalTool(activeWindow, {
                        picture: activeWindow.getPicture()
                    });
                });
            }
        });

        // Algorytm Żółwia
        // ---------------

        this.turtleOperationsMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_TURTLE'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.Operation(function () {
                    new root.ChooseColorTurtleAlgorithmTool(activeWindow, {
                        picture: activeWindow.getPicture()
                    });
                });
            }
        });

        // Pokoloruj obraz
        // ---------------

        this.imageColorfulOperationsMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_IMAGE_COLORFUL'), function () {
            let activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new root.Operation(function () {
                    root.Colorize(activeWindow);
                });
            }
        });

        // ----

        let operationsMenu = new gui.Menu();
        operationsMenu.append(histogramOperationsMenuItem);
        operationsMenu.append(onePointOperationsMenuItem);
        operationsMenu.append(neighbourhoodOperationsMenuItem);
        operationsMenu.append(this.morphologicalOperationsMenuItem);
        operationsMenu.append(this.turtleOperationsMenuItem);
        operationsMenu.append(this.imageColorfulOperationsMenuItem);

        operationItem.submenu = operationsMenu;

        this.windowMenu.append(operationItem);
    };

    MenuBuilder.prototype.setupHelpMenu = function () {
        let helpMenu = new gui.Menu();

        let lines = [
            'Autorzy: Piotr Kowalski, Krzysztof Snopkiewicz',
            'Program stworzony na potrzeby zaliczenia APO.',
            'Prowadzący: dr inż. Marek Doros'
        ];

        this.aboutAuthorsMenuItem = this.addMenuItem(root.Locale.get('ABOUT_INFO'), function () {
            root.alert(lines.join('\n'));
        }, 'Ctrl-Shift', 'A');
        helpMenu.append(this.aboutAuthorsMenuItem);

        this.addSeparator(helpMenu);

        this.aboutHelpMenuItem = this.addMenuItem(root.Locale.get('ABOUT_HELP'), function () {
            let pdf = path.resolve('app', 'docs', '');
            gui.Shell.openItem(pdf);
        }, 'Ctrl-Shift', 'P');
        helpMenu.append(this.aboutHelpMenuItem);

        this.windowMenu.append(new gui.MenuItem({
            label: root.Locale.get('ABOUT'),
            submenu: helpMenu
        }));
    };

    // Extend `MenuBuilder` module with events.
    _.extend(MenuBuilder.prototype, root.EventEmitter);

    // Export `MenuBuilder`.
    return (root.MenuBuilder = MenuBuilder);

}(this));
