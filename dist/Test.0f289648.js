// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"elbaT":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "4943a1030f289648";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"gNc1f":[function(require,module,exports,__globalThis) {
// src/main.ts
// @ts-ignore
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _deckJson = require("./data/deck.json");
var _deckJsonDefault = parcelHelpers.interopDefault(_deckJson);
var _sessionJs = require("./logic/session.js");
var _indexJs = require("./renderers/index.js");
var _storageJs = require("./storage/storage.js");
const app = document.getElementById('app');
const deck = (0, _deckJsonDefault.default);
let session = null;
let cardRevealed = false;
// Domyślne ustawienia z pliku JSON (w razie braku zapisu)
let currentFilterSettings = {
    filterTag: null,
    repeatOnlyHard: false,
    shuffle: deck.session.shuffle
};
/**
 * Eksportuje wyniki bieżącej sesji do pliku JSON.
 */ function exportResultsToJson(deckTitle, state) {
    const filename = `${deckTitle.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0, 10)}_results.json`;
    const exportData = {
        deckTitle: state.deckTitle,
        sessionStartTime: new Date(state.sessionStartTime).toLocaleString(),
        isCompleted: state.isCompleted,
        filterSettings: state.filterSettings,
        summary: session?.getSummary(),
        results: state.results
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([
        jsonString
    ], {
        type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`Wyniki pomy\u{15B}lnie wyeksportowano do ${filename}`);
}
function updateStatsPanel(totalTime, cardTime) {
    const totalTimer = document.getElementById('session-timer');
    const cardTimer = document.getElementById('card-timer');
    if (totalTimer) totalTimer.textContent = totalTime;
    if (cardTimer) cardTimer.textContent = cardTime;
}
/**
 * Przełącza do ekranu głównego, resetując bieżący stan sesji.
 */ function goToStartScreen() {
    if (session) session.stopTimer();
    session = null;
    cardRevealed = false;
    showStartScreen();
}
/**
 * Renderuje widok fiszki i podpina event listenery.
 */ function showCardView(newCard = true) {
    if (!session) return;
    if (session.getState().cardOrderIds.length === 0) {
        alert("Brak fiszek spe\u0142niaj\u0105cych kryteria filtrowania/powt\xf3rki. Zmie\u0144 ustawienia i spr\xf3buj ponownie.");
        goToStartScreen();
        return;
    }
    // Resetujemy 'cardRevealed', jeśli to nowa karta, lub używamy stanu oceny
    if (newCard) cardRevealed = session.isCurrentCardGraded();
    const isCardGraded = session.isCurrentCardGraded();
    app.innerHTML = (0, _indexJs.renderCardViewHtml)(session, cardRevealed);
    session.stopTimer();
    if (deck.session.showTimer) session.startTimer(updateStatsPanel);
    // --- Event Listenery ---
    document.getElementById('main-menu-btn')?.addEventListener('click', goToStartScreen);
    document.getElementById('show-answer-btn')?.addEventListener('click', ()=>{
        cardRevealed = true;
        showCardView(false);
    });
    // Przyciski oceniania - aktywne tylko dla nieocenionych kart
    if (!isCardGraded) {
        document.getElementById('grade-known-btn')?.addEventListener('click', ()=>{
            session.gradeCard('Known');
            handleCardGraded();
        });
        document.getElementById('grade-notyet-btn')?.addEventListener('click', ()=>{
            session.gradeCard('NotYet');
            handleCardGraded();
        });
    }
    document.getElementById('prev-card-btn')?.addEventListener('click', ()=>{
        if (session.goToPrevious()) showCardView();
    });
    document.getElementById('next-card-btn')?.addEventListener('click', ()=>{
        if (session.goToNext()) showCardView();
    });
    // Akcja zakończenia: aktywowana tylko, gdy wszystkie fiszki ocenione
    document.getElementById('finish-session-btn')?.addEventListener('click', ()=>{
        if (session?.isFinishButtonActive()) {
            session.stopTimer();
            showSummary();
        } else alert("Musisz oceni\u0107 wszystkie fiszki, aby zako\u0144czy\u0107 sesj\u0119!");
    });
}
/**
 * Obsługa zdarzenia po ocenie fiszki (automatyczne przejście).
 */ function handleCardGraded() {
    // Jeśli nie ukończono, próbujemy przejść do następnej karty.
    if (!session.isSessionCompleted() && session.goToNext()) showCardView();
    else // Jeśli jesteśmy na ostatniej karcie i właśnie ją oceniliśmy, odświeżamy 
    // widok, aby przycisk "Zakończ sesję" stał się aktywny.
    showCardView(false);
}
/**
 * Renderuje widok podsumowania.
 */ function showSummary() {
    if (!session) return;
    session.stopTimer();
    const summary = session.getSummary();
    app.innerHTML = (0, _indexJs.renderSummaryScreen)(deck.deckTitle, summary);
    (0, _indexJs.drawBarChart)(summary.known, summary.notYet);
    document.getElementById('return-to-start-btn')?.addEventListener('click', goToStartScreen);
    document.getElementById('export-json-btn')?.addEventListener('click', ()=>{
        if (session) exportResultsToJson(deck.deckTitle, session.getState());
    });
    document.getElementById('repeat-hard-btn')?.addEventListener('click', ()=>{
        // Tworzymy nową sesję z włączonym trybem powtórki trudnych
        const initialSettings = {
            shuffle: currentFilterSettings.shuffle,
            filterTag: null,
            repeatOnlyHard: true
        };
        const newSession = new (0, _sessionJs.FlashcardSession)(deck, initialSettings);
        if (newSession.getState().cardOrderIds.length > 0) {
            // Wymagane czyszczenie stanu dla nowej sesji, by zacząć "od zera"
            (0, _storageJs.clearSession)(deck.deckTitle);
            session = newSession;
            currentFilterSettings = session.getState().filterSettings;
            showCardView();
        } else {
            alert("Brak trudnych fiszek do powt\xf3rki.");
            goToStartScreen();
        }
    });
}
/**
 * Renderuje widok startowy i podpina event listenery.
 */ function showStartScreen() {
    app.innerHTML = (0, _indexJs.renderStartScreen)(deck, currentFilterSettings);
    // Ustawienie aktualnych wartości filtrów w UI
    document.getElementById('tag-filter').value = currentFilterSettings.filterTag || '';
    document.getElementById('shuffle-setting').checked = currentFilterSettings.shuffle;
    document.getElementById('repeat-hard-setting').checked = currentFilterSettings.repeatOnlyHard;
    // Event Listenery dla zmian filtrów (aktualizują currentFilterSettings)
    document.getElementById('tag-filter')?.addEventListener('change', (e)=>{
        currentFilterSettings.filterTag = e.target.value || null;
        currentFilterSettings.repeatOnlyHard = false;
        document.getElementById('repeat-hard-setting').checked = false;
    });
    document.getElementById('shuffle-setting')?.addEventListener('change', (e)=>{
        currentFilterSettings.shuffle = e.target.checked;
    });
    document.getElementById('repeat-hard-setting')?.addEventListener('change', (e)=>{
        currentFilterSettings.repeatOnlyHard = e.target.checked;
        if (currentFilterSettings.repeatOnlyHard) {
            currentFilterSettings.filterTag = null;
            document.getElementById('tag-filter').value = '';
        }
    });
    // Start sesji
    document.getElementById('start-session-btn')?.addEventListener('click', ()=>{
        // Tworzenie nowej sesji z aktualnymi ustawieniami filtrów
        session = new (0, _sessionJs.FlashcardSession)(deck, currentFilterSettings);
        currentFilterSettings = session.getState().filterSettings; // Użyj finalnych ustawień z sesji (np. po resecie repeatOnlyHard)
        if (session.getState().cardOrderIds.length > 0) showCardView();
        else {
            alert("Brak fiszek spe\u0142niaj\u0105cych kryteria filtrowania. Zmie\u0144 ustawienia i spr\xf3buj ponownie.");
            session = null;
        }
    });
}
/**
 * Inicjalizacja aplikacji.
 */ function initApp() {
    const savedSessionState = (0, _storageJs.loadSession)(deck.deckTitle);
    if (savedSessionState) {
        // Wczytanie zapisanych filtrów, nawet jeśli sesja jest ukończona, by z nich wystartować
        currentFilterSettings = savedSessionState.filterSettings;
        // Próbujemy kontynuować zapisaną sesję
        session = new (0, _sessionJs.FlashcardSession)(deck, currentFilterSettings);
    }
    if (session && session.isSessionCompleted()) showSummary();
    else if (session && session.getState().sessionStartTime !== 0) showCardView();
    else {
        // Jeśli brak zapisu lub sesja jest świeżo zainicjalizowana bez postępu, resetujemy filtry.
        if (!savedSessionState) currentFilterSettings = {
            filterTag: null,
            repeatOnlyHard: false,
            shuffle: deck.session.shuffle
        };
        showStartScreen();
    }
}
// Uruchomienie aplikacji
initApp();

},{"./data/deck.json":"5jEuQ","./logic/session.js":"heedG","./renderers/index.js":"fKEhE","./storage/storage.js":"lXxpO","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"5jEuQ":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse('{"deckTitle":"Angielski: Podstawowe czasowniki i rzeczowniki (22 szt.)","cards":[{"id":1,"front":"to go","back":"i\u015B\u0107, jecha\u0107","tag":"czasowniki"},{"id":2,"front":"to make","back":"robi\u0107, tworzy\u0107","tag":"czasowniki"},{"id":3,"front":"house","back":"dom","tag":"rzeczowniki"},{"id":4,"front":"water","back":"woda","tag":"rzeczowniki"},{"id":5,"front":"to see","back":"widzie\u0107","tag":"czasowniki"},{"id":6,"front":"book","back":"ksi\u0105\u017Cka","tag":"rzeczowniki"},{"id":7,"front":"to take","back":"bra\u0107, zabiera\u0107","tag":"czasowniki"},{"id":8,"front":"time","back":"czas","tag":"rzeczowniki"},{"id":9,"front":"to come","back":"przychodzi\u0107","tag":"czasowniki"},{"id":10,"front":"person","back":"osoba","tag":"rzeczowniki"},{"id":11,"front":"to think","back":"my\u015Ble\u0107","tag":"czasowniki"},{"id":12,"front":"world","back":"\u015Bwiat","tag":"rzeczowniki"},{"id":13,"front":"to look","back":"patrze\u0107","tag":"czasowniki"},{"id":14,"front":"hand","back":"r\u0119ka","tag":"rzeczowniki"},{"id":15,"front":"to give","back":"dawa\u0107","tag":"czasowniki"},{"id":16,"front":"money","back":"pieni\u0105dze","tag":"rzeczowniki"},{"id":17,"front":"to tell","back":"m\xf3wi\u0107, opowiada\u0107","tag":"czasowniki"},{"id":18,"front":"fact","back":"fakt","tag":"rzeczowniki"},{"id":19,"front":"to find","back":"znajdowa\u0107","tag":"czasowniki"},{"id":20,"front":"problem","back":"problem","tag":"rzeczowniki"},{"id":21,"front":"to use","back":"u\u017Cywa\u0107","tag":"czasowniki"},{"id":22,"front":"system","back":"system","tag":"rzeczowniki"}],"session":{"shuffle":true,"showTimer":true}}');

},{}],"heedG":[function(require,module,exports,__globalThis) {
// src/logic/session.ts
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FlashcardSession", ()=>FlashcardSession);
var _storageJs = require("../storage/storage.js");
const ONE_SECOND = 1000;
class FlashcardSession {
    constructor(deckData, filterSettings){
        this.cardsInSession = [];
        this.cardStartTime = 0;
        this.timerInterval = null;
        this.deck = deckData;
        this.defaultFilterSettings = filterSettings;
        const savedState = (0, _storageJs.loadSession)(deckData.deckTitle);
        // Sprawdzenie, czy bieżące filtry odpowiadają zapisanym filtrom
        const filterChanged = savedState && JSON.stringify(savedState.filterSettings) !== JSON.stringify(filterSettings);
        if (savedState && !filterChanged) {
            this.state = savedState;
            this.cardsInSession = savedState.cardOrderIds.map((id)=>this.deck.cards.find((c)=>c.id === id)).filter((c)=>c !== undefined);
        } else this.state = this.initializeNewSession();
        if (!this.state.isCompleted && this.cardsInSession.length > 0) this.cardStartTime = Date.now();
    }
    // --- Inicjalizacja i Pomocnicze ---
    shuffleArray(array) {
        for(let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [
                array[j],
                array[i]
            ];
        }
    }
    initializeNewSession() {
        let cardsPool = [
            ...this.deck.cards
        ];
        const settings = this.defaultFilterSettings;
        // 1. FILTROWANIE DLA TRYBU POWTÓRKI
        if (settings.repeatOnlyHard) {
            const allResults = (0, _storageJs.getDeckResults)(this.deck.deckTitle);
            const hardCardIds = new Set(allResults.filter((r)=>r.grade === 'NotYet').map((r)=>r.cardId));
            let cardsToRepeat = this.deck.cards.filter((c)=>hardCardIds.has(c.id));
            if (cardsToRepeat.length > 0) {
                cardsPool = cardsToRepeat;
                // Zastosowanie filtru tagów na zbiorze KART DO POWTÓRKI (jeśli jest ustawiony)
                if (settings.filterTag) cardsPool = cardsPool.filter((c)=>c.tag === settings.filterTag);
            } else {
                // Jeśli brak trudnych, wracamy do normalnej puli, ale zachowujemy filtry tagów, jeśli są ustawione
                if (settings.filterTag) cardsPool = this.deck.cards.filter((c)=>c.tag === settings.filterTag);
                else cardsPool = [
                    ...this.deck.cards
                ];
                settings.repeatOnlyHard = false; // Musimy zresetować ustawienie filtra w stanie
            }
        } else // 2. NORMALNE FILTROWANIE PO TAGACH (gdy tryb powtórki jest WYŁĄCZONY)
        if (settings.filterTag) cardsPool = cardsPool.filter((c)=>c.tag === settings.filterTag);
        this.cardsInSession = cardsPool;
        // 3. Losowanie
        if (settings.shuffle) this.shuffleArray(this.cardsInSession);
        // W przypadku braku kart
        if (this.cardsInSession.length === 0) return {
            deckTitle: this.deck.deckTitle,
            cardOrderIds: [],
            currentCardIndex: 0,
            sessionStartTime: 0,
            results: [],
            isCompleted: true,
            lastReviewDate: 0,
            filterSettings: settings
        };
        const initialResults = this.cardsInSession.map((card)=>({
                cardId: card.id,
                grade: null,
                timeSpentMs: 0,
                reviewedAt: 0
            }));
        return {
            deckTitle: this.deck.deckTitle,
            cardOrderIds: this.cardsInSession.map((c)=>c.id),
            currentCardIndex: 0,
            sessionStartTime: Date.now(),
            results: initialResults,
            isCompleted: false,
            lastReviewDate: 0,
            filterSettings: settings
        };
    }
    /**
     * Zapisuje bieżący czas na karcie (o ile nie została oceniona) przed nawigacją.
     */ updateTimeSpentBeforeNavigation() {
        const currentResult = this.getCurrentResult();
        if (currentResult.grade === null && this.cardStartTime !== 0) {
            const timeElapsed = Date.now() - this.cardStartTime;
            currentResult.timeSpentMs += timeElapsed;
        }
    }
    getCurrentCard() {
        if (this.cardsInSession.length === 0) throw new Error("Brak fiszek w sesji. Sprawd\u017A filtry.");
        return this.cardsInSession[this.state.currentCardIndex];
    }
    getCurrentResult() {
        const currentCardId = this.getCurrentCard().id;
        return this.state.results.find((r)=>r.cardId === currentCardId);
    }
    getState() {
        return this.state;
    }
    gradeCard(grade) {
        const currentResult = this.getCurrentResult();
        // Wymaganie: Po ocenie, edycja jest zablokowana.
        if (currentResult.grade !== null) {
            console.warn("Fiszka ju\u017C oceniona, edycja zablokowana.");
            return;
        }
        const now = Date.now();
        const timeSpent = currentResult.timeSpentMs + (now - this.cardStartTime);
        currentResult.grade = grade;
        currentResult.timeSpentMs = timeSpent;
        currentResult.reviewedAt = now;
        (0, _storageJs.saveSession)(this.state);
        this.checkCompletion();
        // Ustawiamy 0, bo czas od teraz będzie mierzony na kolejnej karcie.
        this.cardStartTime = Date.now();
    }
    // --- Nawigacja ---
    goToNext() {
        if (this.state.currentCardIndex < this.cardsInSession.length - 1) {
            // Zapisz czas na bieżącej karcie PRZED przejściem
            this.updateTimeSpentBeforeNavigation();
            this.state.currentCardIndex++;
            this.cardStartTime = Date.now();
            (0, _storageJs.saveSession)(this.state);
            return true;
        }
        return false;
    }
    goToPrevious() {
        if (this.state.currentCardIndex > 0) {
            // Zapisz czas na bieżącej karcie PRZED przejściem
            this.updateTimeSpentBeforeNavigation();
            this.state.currentCardIndex--;
            this.cardStartTime = Date.now();
            (0, _storageJs.saveSession)(this.state);
            return true;
        }
        return false;
    }
    checkCompletion() {
        const allGraded = this.state.results.every((r)=>r.grade !== null);
        if (allGraded && !this.state.isCompleted) {
            this.state.isCompleted = true;
            this.stopTimer();
            (0, _storageJs.saveSession)(this.state);
        }
    }
    // --- Statystyki i Timery ---
    getTimeOnCurrentCardMs() {
        const currentResult = this.getCurrentResult();
        if (currentResult.grade !== null) return currentResult.timeSpentMs;
        return currentResult.timeSpentMs + (Date.now() - this.cardStartTime);
    }
    getTotalSessionTimeMs() {
        // Jeśli ukończona, obliczamy czas na podstawie sessionStartTime i ostatniej recenzowanej karty
        if (this.state.isCompleted) {
            const lastReviewedTime = Math.max(0, ...this.state.results.map((r)=>r.reviewedAt));
            return lastReviewedTime > 0 ? lastReviewedTime - this.state.sessionStartTime : 0;
        }
        // Sumujemy czas spędzony na już opuszczonych kartach i dodajemy czas bieżącej
        const timeInPreviousCards = this.state.results.reduce((sum, r, index)=>{
            // Dodajemy czas tylko, jeśli karta została opuszczona (index < currentCardIndex) 
            // lub jeśli jest to bieżąca karta, obsłużymy ją później
            if (index < this.state.currentCardIndex) return sum + r.timeSpentMs;
            return sum;
        }, 0);
        return timeInPreviousCards + this.getTimeOnCurrentCardMs();
    }
    startTimer(callback) {
        if (this.timerInterval !== null || this.state.isCompleted) return;
        this.timerInterval = setInterval(()=>{
            const totalTimeStr = this.formatTime(this.getTotalSessionTimeMs());
            const cardTimeStr = this.formatTime(this.getTimeOnCurrentCardMs());
            callback(totalTimeStr, cardTimeStr);
        }, ONE_SECOND);
    }
    stopTimer() {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    getKnownCount() {
        return this.state.results.filter((r)=>r.grade === 'Known').length;
    }
    getNotYetCount() {
        return this.state.results.filter((r)=>r.grade === 'NotYet').length;
    }
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / ONE_SECOND);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const pad = (num)=>num.toString().padStart(2, '0');
        return `${pad(minutes)}:${pad(seconds)}`;
    }
    getSummary() {
        // Upewniamy się, że czas dla ostatniej karty jest zaktualizowany (jeśli była ręcznie opuszczona/ukończona)
        if (!this.state.isCompleted) this.updateTimeSpentBeforeNavigation();
        const gradedResults = this.state.results.filter((r)=>r.grade !== null);
        const totalTimeGraded = gradedResults.reduce((sum, r)=>sum + r.timeSpentMs, 0);
        const finalTotalTimeMs = this.getTotalSessionTimeMs();
        const avgTimeMs = gradedResults.length > 0 ? totalTimeGraded / gradedResults.length : 0;
        const hardCardsIds = this.state.results.filter((r)=>r.grade === 'NotYet').map((r)=>r.cardId);
        const hardCards = this.cardsInSession.filter((card)=>hardCardsIds.includes(card.id));
        return {
            known: this.getKnownCount(),
            notYet: this.getNotYetCount(),
            totalTime: this.formatTime(finalTotalTimeMs),
            avgTime: this.formatTime(avgTimeMs),
            hardCards: hardCards
        };
    }
    isFinishButtonActive() {
        return this.state.isCompleted;
    }
    isCurrentCardGraded() {
        return this.getCurrentResult().grade !== null;
    }
    isSessionCompleted() {
        return this.state.isCompleted;
    }
    getTagsInDeck() {
        const tags = new Set();
        this.deck.cards.forEach((card)=>{
            if (card.tag) tags.add(card.tag);
        });
        return Array.from(tags).sort();
    }
}

},{"../storage/storage.js":"lXxpO","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"lXxpO":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Zapisuje stan sesji do localStorage.
 * @param state - aktualny stan sesji.
 */ parcelHelpers.export(exports, "saveSession", ()=>saveSession);
/**
 * Wczytuje stan sesji z localStorage.
 * @param deckTitle - tytuł talii.
 * @returns Zapisany stan sesji lub null.
 */ parcelHelpers.export(exports, "loadSession", ()=>loadSession);
/**
 * Usuwa stan sesji z localStorage.
 * @param deckTitle - tytuł talii.
 */ parcelHelpers.export(exports, "clearSession", ()=>clearSession);
/**
 * Wczytuje poprzednie wyniki (CardResult[]) dla danej talii (do trybu powtórki).
 * @param deckTitle - tytuł talii.
 * @returns Tablica CardResult[] lub pusta tablica, jeśli brak danych.
 */ parcelHelpers.export(exports, "getDeckResults", ()=>getDeckResults);
const STORAGE_KEY_PREFIX = 'flashcard_session_';
function saveSession(state) {
    const key = STORAGE_KEY_PREFIX + state.deckTitle;
    try {
        state.lastReviewDate = Date.now();
        localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
        console.error("B\u0142\u0105d zapisu do localStorage", e);
    }
}
function loadSession(deckTitle) {
    const key = STORAGE_KEY_PREFIX + deckTitle;
    try {
        const json = localStorage.getItem(key);
        if (json) {
            const loadedState = JSON.parse(json);
            return {
                ...loadedState,
                // Zapewnienie kompatybilności wstecznej dla starszych zapisów
                filterSettings: loadedState.filterSettings || {
                    shuffle: true,
                    filterTag: null,
                    repeatOnlyHard: false
                }
            };
        }
    } catch (e) {
        console.error("B\u0142\u0105d odczytu z localStorage", e);
    }
    return null;
}
function clearSession(deckTitle) {
    const key = STORAGE_KEY_PREFIX + deckTitle;
    localStorage.removeItem(key);
}
function getDeckResults(deckTitle) {
    const state = loadSession(deckTitle);
    return state ? state.results : [];
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"fKEhE":[function(require,module,exports,__globalThis) {
// src/renderers/index.ts
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// --- Pomocnicze funkcje HTML ---
/**
 * Rysuje prosty wykres słupkowy na elemencie Canvas.
 */ parcelHelpers.export(exports, "drawBarChart", ()=>drawBarChart);
parcelHelpers.export(exports, "renderStartScreen", ()=>renderStartScreen);
/**
 * Generuje HTML dla widoku pojedynczej fiszki.
 */ parcelHelpers.export(exports, "renderCardViewHtml", ()=>renderCardViewHtml);
/**
 * Generuje HTML dla ekranu podsumowania sesji.
 */ parcelHelpers.export(exports, "renderSummaryScreen", ()=>renderSummaryScreen);
var _filtersJs = require("./filters.js");
function drawBarChart(known, notYet) {
    const canvas = document.getElementById('summary-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 400;
    canvas.height = 200;
    const total = known + notYet;
    const knownHeight = total > 0 ? known / total * canvas.height * 0.8 : 0;
    const notYetHeight = total > 0 ? notYet / total * canvas.height * 0.8 : 0;
    const barWidth = 100;
    const padding = 20;
    const startX = (canvas.width - 2 * barWidth - padding) / 2;
    const baseY = canvas.height * 0.9;
    // Słupek "Znam" (zielony)
    ctx.fillStyle = '#28a745';
    ctx.fillRect(startX, baseY - knownHeight, barWidth, knownHeight);
    // Słupek "Jeszcze nie" (czerwony)
    ctx.fillStyle = '#dc3545';
    ctx.fillRect(startX + barWidth + padding, baseY - notYetHeight, barWidth, notYetHeight);
    // Etykiety
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Znam', startX + barWidth / 2, baseY + 15);
    ctx.fillText('Nie znam', startX + barWidth + padding + barWidth / 2, baseY + 15);
}
function getStatsPanelHtml(session, cardRevealed) {
    const state = session.getState();
    let totalTime = '00:00';
    let cardTime = '00:00';
    // Aktualny czas jest pobierany na żywo, chyba że sesja jest zakończona
    if (!state.isCompleted) {
        totalTime = session.formatTime(session.getTotalSessionTimeMs());
        cardTime = session.formatTime(session.getTimeOnCurrentCardMs());
    } else {
        // Po zakończeniu używamy czasów z podsumowania (które są już wyliczone)
        const summary = session.getSummary();
        totalTime = summary.totalTime;
        cardTime = session.formatTime(session.getTimeOnCurrentCardMs()); // Czas ostatniej karty
    }
    return `
\xa0 \xa0 \xa0 \xa0 <div class="stats-panel">
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <div class="stat-item">Bie\u{17C}\u{105}ca fiszka: <strong>${state.currentCardIndex + 1}/${state.cardOrderIds.length}</strong></div>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <div class="stat-item">Znam: <strong style="color: #28a745;">${session.getKnownCount()}</strong></div>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <div class="stat-item">Jeszcze nie: <strong style="color: #dc3545;">${session.getNotYetCount()}</strong></div>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <div class="stat-item">Czas na fiszce: <strong id="card-timer">${cardTime}</strong></div>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <div class="stat-item">\u{141}\u{105}czny czas: <strong id="session-timer">${totalTime}</strong></div>
\xa0 \xa0 \xa0 \xa0 </div>
\xa0 \xa0 `;
}
function renderStartScreen(deck, currentSettings) {
    return `
\xa0 \xa0 \xa0 \xa0 <h1>\u{1F4D6} ${deck.deckTitle}</h1>
\xa0 \xa0 \xa0 \xa0 <p>Witaj w aplikacji do nauki s\u{142}\xf3wek. Got\xf3w na powt\xf3rk\u{119}?</p>
\xa0 \xa0 \xa0 \xa0 <div class="summary-item">Liczba fiszek w talii: <strong>${deck.cards.length}</strong></div>
\xa0 \xa0 \xa0 \xa0 
\xa0 \xa0 \xa0 \xa0 ${(0, _filtersJs.renderFilterPanel)(deck, currentSettings)}
\xa0 \xa0 \xa0 \xa0 
\xa0 \xa0 \xa0 \xa0 <div class="controls" style="text-align: center; margin-top: 30px;">
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <button id="start-session-btn" class="btn btn-primary">Rozpocznij sesj\u{119}</button>
\xa0 \xa0 \xa0 \xa0 </div>
\xa0 \xa0 `;
}
function renderCardViewHtml(session, cardRevealed) {
    const card = session.getCurrentCard();
    const result = session.getCurrentResult();
    const isGraded = result.grade !== null;
    // Odpowiedź jest widoczna, jeśli została odkryta LUB karta została oceniona (spełnienie wymagania)
    const showBackContent = cardRevealed || isGraded;
    const backContent = showBackContent ? `<div class="card-back">${card.back}</div>` : `<p style="font-size: 0.8em; color: #888;">Naci\u{15B}nij "Poka\u{17C} odpowied\u{17A}"</p>`;
    const gradingControls = `
\xa0 \xa0 \xa0 \xa0 <div class="grading-controls" style="display: ${showBackContent ? 'block' : 'none'};">
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <p>Jak oceniasz swoj\u{105} znajomo\u{15B}\u{107}?</p>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <button id="grade-known-btn" class="btn btn-success" ${isGraded || !cardRevealed ? 'disabled' : ''}>Znam</button>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <button id="grade-notyet-btn" class="btn btn-danger" ${isGraded || !cardRevealed ? 'disabled' : ''}>Jeszcze nie</button>
\xa0 \xa0 \xa0 \xa0 </div>
\xa0 \xa0 `;
    const showAnswerButton = `
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <button id="show-answer-btn" class="btn btn-secondary" style="display: ${!showBackContent && !isGraded ? 'block' : 'none'}; margin: 10px auto;">Poka\u{17C} odpowied\u{17A}</button>
\xa0 \xa0 `;
    const isLastCard = session.getState().currentCardIndex === session.getState().cardOrderIds.length - 1;
    const isFinishActive = session.isFinishButtonActive();
    // Blokada "Następna": na ostatniej karcie LUB jeśli wszystkie karty zostały ocenione i to nie jest ostatnia 
    // (co jest obsługiwane przez isLastCard, ale dla pewności)
    const nextDisabled = isLastCard && !isFinishActive;
    const navigationControls = `
\xa0 \xa0 \xa0 \xa0 <div class="controls">
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <button id="main-menu-btn" class="btn btn-nav">Powr\xf3t do menu</button>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <button id="prev-card-btn" class="btn btn-nav" ${session.getState().currentCardIndex === 0 ? 'disabled' : ''}>Poprzednia</button>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <button id="next-card-btn" class="btn btn-nav" ${nextDisabled ? 'disabled' : ''}>Nast\u{119}pna</button>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <button id="finish-session-btn" class="btn btn-primary" ${isFinishActive ? '' : 'disabled'}>Zako\u{144}cz sesj\u{119}</button>
\xa0 \xa0 \xa0 \xa0 </div>
\xa0 \xa0 `;
    let gradedInfo = '';
    if (isGraded) {
        const gradeText = result.grade === 'Known' ? "\u2705 ZNANA" : "\u274C JESZCZE NIE";
        gradedInfo = `<p style="margin-top: 10px; font-weight: bold; color: ${result.grade === 'Known' ? 'green' : 'red'};">Fiszka ju\u{17C} oceniona: ${gradeText}</p>`;
    }
    return `
\xa0 \xa0 \xa0 \xa0 <h1>${session.getState().deckTitle}</h1>
\xa0 \xa0 \xa0 \xa0 ${getStatsPanelHtml(session, showBackContent)}
\xa0 \xa0 \xa0 \xa0 <div class="card-view">
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <div class="flashcard">
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <div class="card-front">${card.front} ${card.tag ? `(${card.tag})` : ''}</div>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 ${backContent}
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 </div>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 ${gradedInfo}
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 ${showAnswerButton}
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 ${gradingControls}
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 ${navigationControls}
\xa0 \xa0 \xa0 \xa0 </div>
\xa0 \xa0 `;
}
function renderSummaryScreen(title, summary) {
    const hardCardsList = summary.hardCards.length > 0 ? `
\xa0 \xa0 \xa0 \xa0 <h3>Trudne fiszki (${summary.notYet} szt.) do powt\xf3rki:</h3>
\xa0 \xa0 \xa0 \xa0 <ul class="hard-cards-list">
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 ${summary.hardCards.map((card)=>`<li><strong>${card.front}</strong> - ${card.back} (${card.tag || 'Bez tagu'})</li>`).join('')}
\xa0 \xa0 \xa0 \xa0 </ul>
\xa0 \xa0 \xa0 \xa0 <button id="repeat-hard-btn" class="btn btn-danger" style="margin-top: 15px;">Powt\xf3rz tylko trudne</button>
\xa0 \xa0 \xa0 \xa0 ` : `<p>Brak fiszek oznaczonych jako "Jeszcze nie". \u{15A}wietna robota!</p>`;
    const chartHtml = `
\xa0 \xa0 \xa0 \xa0 <h2>\u{1F4CA} Rozk\u{142}ad Ocen</h2>
\xa0 \xa0 \xa0 \xa0 <div style="text-align: center; margin-bottom: 20px;">
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <canvas id="summary-chart" width="400" height="200" style="border: 1px solid #ccc;"></canvas>
\xa0 \xa0 \xa0 \xa0 </div>
\xa0 \xa0 `;
    return `
\xa0 \xa0 \xa0 \xa0 <h1>\u{1F389} Podsumowanie Sesji: ${title}</h1>
\xa0 \xa0 \xa0 \xa0 
\xa0 \xa0 \xa0 \xa0 ${chartHtml}

\xa0 \xa0 \xa0 \xa0 <h2>Wyniki</h2>
\xa0 \xa0 \xa0 \xa0 <div class="stats-panel">
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <div class="stat-item">Znam: <strong style="color: #28a745;">${summary.known}</strong></div>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <div class="stat-item">Jeszcze nie: <strong style="color: #dc3545;">${summary.notYet}</strong></div>
\xa0 \xa0 \xa0 \xa0 </div>
\xa0 \xa0 \xa0 \xa0 <h2>Czasy</h2>
\xa0 \xa0 \xa0 \xa0 <div class="summary-item">\u{141}\u{105}czny czas sesji: <strong>${summary.totalTime}</strong></div>
\xa0 \xa0 \xa0 \xa0 <div class="summary-item">\u{15A}redni czas na fiszk\u{119}: <strong>${summary.avgTime}</strong></div>
\xa0 \xa0 \xa0 \xa0 
\xa0 \xa0 \xa0 \xa0 <h2>Lista do powt\xf3rki</h2>
\xa0 \xa0 \xa0 \xa0 ${hardCardsList}
\xa0 \xa0 \xa0 \xa0 
\xa0 \xa0 \xa0 \xa0 <div class="controls" style="text-align: center; margin-top: 30px;">
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <button id="export-json-btn" class="btn btn-secondary">Eksportuj wyniki (JSON)</button>
\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 <button id="return-to-start-btn" class="btn btn-primary">Powr\xf3t do ekranu startowego</button>
\xa0 \xa0 \xa0 \xa0 </div>
\xa0 \xa0 `;
}

},{"./filters.js":"hxUaN","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"hxUaN":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Generuje HTML dla panelu ustawień i filtrów na ekranie startowym.
 */ parcelHelpers.export(exports, "renderFilterPanel", ()=>renderFilterPanel);
var _sessionJs = require("../logic/session.js");
function renderFilterPanel(deck, currentSettings) {
    const tempSession = new (0, _sessionJs.FlashcardSession)(deck, currentSettings);
    const uniqueTags = tempSession.getTagsInDeck();
    const tagOptions = uniqueTags.map((tag)=>`<option value="${tag}" ${currentSettings.filterTag === tag ? 'selected' : ''}>${tag}</option>`).join('');
    return `
        <h2>\u{2699}\u{FE0F} Opcje Sesji</h2>
        <div class="filter-panel">
            <div class="filter-group">
                <label for="tag-filter">Filtruj po tagach:</label>
                <select id="tag-filter">
                    <option value="">Wszystkie tagi</option>
                    ${tagOptions}
                </select>
            </div>
            
            <div class="filter-group">
                <label for="shuffle-setting">Losowanie:</label>
                <input type="checkbox" id="shuffle-setting" ${currentSettings.shuffle ? 'checked' : ''}>
                <span>Losuj kolejno\u{15B}\u{107} fiszek</span>
            </div>
            
            <div class="filter-group">
                <label for="repeat-hard-setting">Tryb powt\xf3rki:</label>
                <input type="checkbox" id="repeat-hard-setting" ${currentSettings.repeatOnlyHard ? 'checked' : ''}>
                <span>Tylko nieznane/trudne fiszki</span>
            </div>
        </div>
    `;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","../logic/session.js":"heedG"}]},["elbaT","gNc1f"], "gNc1f", "parcelRequire170a", {})

//# sourceMappingURL=Test.0f289648.js.map
