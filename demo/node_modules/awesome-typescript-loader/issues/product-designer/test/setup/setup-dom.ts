import 'reflect-metadata';
import * as jsdom from 'jsdom';
import { StorageShim } from './StorageShim';

declare var global: any;

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = {
  userAgent: 'node.js',
};

global.window.localStorage = new StorageShim();
global.window.sessionStorage = new StorageShim();

propagateToGlobal(global.window);

function propagateToGlobal(window: any) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) { continue; };
    if (key in global) { continue; };
    if (key === 'XMLHttpRequest') { continue; };
    global[key] = window[key];
  }
}

global.jQuery = require('jquery');
global.$ = jQuery;
