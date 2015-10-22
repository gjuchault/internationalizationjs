'use strict';

import fs   from 'fs';
import path from 'path';
import { vsprintf } from 'sprintf';

class Internationalization {
    constructor (source = './locales', defaultLocale = 'en', fallbacks = {}) {
        this.source     = source;
        this.defaultLocale = defaultLocale;
        this.fallbacks     = fallbacks;

        this.locales    = {};
        this.locale     = null;
        this.localeName = null;

        this.init();
    }

    init () {
        let files;
        let fullPath = path.resolve(process.cwd(), this.source);

        try {
            files = fs.readdirSync(fullPath);
        } catch (e) {
            return;
        }

        files.forEach(file => {
            if (file.slice(-3) !== '.js') {
                return;
            }

            this.locales[file.slice(0, -3)] = require(path.join(fullPath, file));
        });

        this.setLocale(this.defaultLocale);
    }

    setLocale (lng_) {
        let lng = (this.fallbacks.hasOwnProperty(lng_)) ? this.fallbacks[lng_] : lng_;

        if (this.locales.hasOwnProperty(lng)) {
            this.locale     = this.locales[lng];
            this.localeName = lng;
        }
    }

    getLocale () {
        return this.localeName;
    }

    __ (name, ...args) {
        let str = this._dotNotation(this.locale, name);

        return (typeof str !== 'string') ? str : vsprintf(str, args);
    }

    __n (name, count, ...args) {
        let obj = this._dotNotation(this.locale, name);

        if (Object.prototype.toString.call(obj) !== '[object Object]' ||
            (obj.one === undefined || obj.more === undefined)) {
            return;
        }

        let str = (count > 1 || count < -1) ? obj.more : obj.one;

        return (typeof str !== 'string') ? str : vsprintf(str, args);
    }

    _dotNotation (obj, path) {
        let multiIndex = (obj, is) => {
            if (is.length && obj[is[0]] === undefined) {
                return;
            }

            return is.length ? multiIndex(obj[is[0]], is.slice(1)) : obj;
        };

        return multiIndex(obj, path.split('.'));
    }
}

export default Internationalization;
