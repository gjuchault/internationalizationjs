'use strict';

import fs   from 'fs';
import path from 'path';

class Internationalization {
    constructor (source = './locales', defaultLocale = 'en', fallbacks = {}) {
        this.source     = source;
        this.defaultLocale = defaultLocale;
        this.fallbacks     = fallbacks;

        this.locales = {};
        this.locale  = null;
    }

    init () {
        return new Promise((resolve, reject) => {
            let fullPath = path.resolve(process.cwd(), this.source);
            fs.readdir(fullPath, (err, files) => {
                if (err) {
                    return reject(err);
                }

                files.forEach(file => {
                    if (file.slice(-3) !== '.js') {
                        return;
                    }

                    this.locales[file.slice(0, -3)] = require(path.join(fullPath, file));
                });

                if (this.locales.hasOwnProperty(this.defaultLocale)) {
                    this.locale = this.locales[this.defaultLocale];
                }

                return resolve();
            });
        });
    }

    setLocale (lng) {
        if (this.locales.hasOwnProperty(lng)) {
            this.locale = this.locales[lng];
        }
    }

    getLocale () {
        return this.locale;
    }

    __ (name) {
        return this._dotNotation(this.locale, name);
    }

    __n (name, count) {
        let obj = this._dotNotation(this.locale, name);

        if (Object.prototype.toString.call(obj) !== '[object Object]' ||
            (obj.one === undefined || obj.more === undefined)) {
            return;
        }

        return (count > 1 || count < -1) ? obj.more : obj.one;
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
