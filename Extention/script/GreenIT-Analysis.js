var isChrome = !!window.chrome;
let browserType = null;
if (isChrome) {
    browserType = chrome;
} else {
    browserType = browser;
}

browserType.devtools.panels.create("GreenIT",
    "../Pages/icons/logo-48.png",
    "../Pages/GreenPanel.html",
    (panel) => {
        // code invoked on panel creation
    }
);