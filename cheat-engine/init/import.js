function applyCheat () {
    const currentScript = document.currentScript
    const cheatEngineBaseUrl = window.CheatEngine && window.CheatEngine.baseUrl
        ? window.CheatEngine.baseUrl
        : currentScript && currentScript.src
            ? currentScript.src.replace(/\/init\/import\.js(?:[?#].*)?$/, '/')
            : 'cheat-engine/'

    function __resolveCheatPath(src) {
        return new URL(src, cheatEngineBaseUrl).href
    }

    function __addScript(type, src) {
        var cheatScript = document.createElement('script');
        cheatScript.type = type;
        cheatScript.src = __resolveCheatPath(src)

        document.body.appendChild(cheatScript)
    }

    function __loadJavaScript(src) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = __resolveCheatPath(src);
        script.async = false;
        script._url = src;
        document.body.appendChild(script);
    }

    // load libs
    __loadJavaScript('libs/axios.min.js')

    // add <div id='app'> node for vue
    const appDiv = document.createElement('div')

    appDiv.id = 'app'
    appDiv.innerHTML = `
<v-app
    app
    dark
    style="background-color: black;">
    <v-main
        dark>
        <main-component></main-component>
    </v-main>
</v-app>
`

    document.body.appendChild(appDiv)

    // import in head
    document.head.innerHTML += `
<link href="${__resolveCheatPath('css/materialdesignicons.min.css')}" rel="stylesheet">
<link href="${__resolveCheatPath('css/vuetify.min.css')}" rel="stylesheet">
<link href="${__resolveCheatPath('css/main.css')}" rel="stylesheet">
`

    // import in body
    // __loadJavaScript('init/setup.js')
    __addScript('module', 'init/setup.js')
}

applyCheat()
