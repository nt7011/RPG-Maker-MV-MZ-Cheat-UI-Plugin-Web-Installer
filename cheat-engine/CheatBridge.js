//=============================================================================
// CheatBridge.js
//=============================================================================
/*:
 * @target MV MZ
 * @plugindesc Loads the Cheat UI runtime.
 *
 * @help
 * This plugin loads the Cheat UI payload from js/plugins/cheat-engine.
 */

(() => {
    const currentScript = document.currentScript
    const pluginBaseUrl = currentScript && currentScript.src
        ? currentScript.src.replace(/\/[^/]*$/, '/')
        : 'js/plugins/'
    const cheatEngineBaseUrl = new URL('cheat-engine/', pluginBaseUrl).href

    window.CheatEngine = window.CheatEngine || {}
    if (window.CheatEngine.loaded) {
        return
    }

    window.CheatEngine.loaded = true
    window.CheatEngine.baseUrl = cheatEngineBaseUrl

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = new URL('init/import.js', cheatEngineBaseUrl).href
    script.async = false

    const target = document.body || document.head || document.documentElement
    target.appendChild(script)
})()
