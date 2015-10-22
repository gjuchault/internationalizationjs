'use strict';

/* globals describe, it */

import assert               from 'assert';
import Internationalization from '../i18n';

describe('Internationalization', () => {
    it('should construct an i18n object', () => {
        let i18n = new Internationalization();
        let i18n2 = new Internationalization('./lib/test/locales/', 'fr', {
            en: 'fr'
        });

        assert.equal('./locales', i18n.source);
        assert.equal('./lib/test/locales/', i18n2.source);
        assert.equal('en', i18n.defaultLocale);
        assert.equal('fr', i18n2.defaultLocale);
        assert.equal(0, Object.keys(i18n.fallbacks).length);
        assert.equal(1, Object.keys(i18n2.fallbacks).length);
    });

    it('should load a directory', () => {
        let i18n = new Internationalization('./lib/test/locales');

        assert.equal(true, 'en' in i18n.locales);
    });

    it('should set locale to the default one if available', () => {
        let i18n = new Internationalization('./lib/test/locales');

        assert.equal(true, 'en' in i18n.locales);
        assert.notEqual(null, i18n.locale);
        assert.equal('en', i18n.locale.lng);
    });

    it('should translate basic sentence', () => {
        let i18n = new Internationalization('./lib/test/locales');

        assert.equal('English', i18n.__('language'));
    });

    it('should not translate unkown sentences', () => {
        let i18n = new Internationalization('./lib/test/locales');
        assert.equal(undefined, i18n.__('languxage'));
    });

    it('should translate sentences with a dot notation', () => {
        let i18n = new Internationalization('./lib/test/locales');

        assert.equal('ok', i18n.__('foo.bar'));
    });

    it('should translate numbered sentences', () => {
        let i18n = new Internationalization('./lib/test/locales');

        assert.equal('a cat', i18n.__n('cats', 1));
        assert.equal('a cat', i18n.__n('cats', 0));
        assert.equal('a cat', i18n.__n('cats', -1));
        assert.equal('cats', i18n.__n('cats', 2));
        assert.equal('cats', i18n.__n('cats', -2));

        assert.equal('a cat', i18n.__n('foo.cats', 1));
        assert.equal('a cat', i18n.__n('foo.cats', 0));
        assert.equal('a cat', i18n.__n('foo.cats', -1));
        assert.equal('cats', i18n.__n('foo.cats', 2));
        assert.equal('cats', i18n.__n('foo.cats', -2));
    });

    it('should translate numbered sentences after a language change', () => {
        let i18n = new Internationalization('./lib/test/locales');
        i18n.setLocale('fr');

        assert.equal('un chat', i18n.__n('cats', 1));
        assert.equal('un chat', i18n.__n('cats', 0));
        assert.equal('un chat', i18n.__n('cats', -1));
        assert.equal('des chats', i18n.__n('cats', 2));
        assert.equal('des chats', i18n.__n('cats', -2));

        assert.equal('un chat', i18n.__n('foo.cats', 1));
        assert.equal('un chat', i18n.__n('foo.cats', 0));
        assert.equal('un chat', i18n.__n('foo.cats', -1));
        assert.equal('des chats', i18n.__n('foo.cats', 2));
        assert.equal('des chats', i18n.__n('foo.cats', -2));
    });

    it('should not translate numbered sentences that are not numbered sentences', () => {
        let i18n = new Internationalization('./lib/test/locales');

        assert.equal(undefined, i18n.__n('foo.bar', 1));
    });

    it('should change language', () => {
        let i18n = new Internationalization('./lib/test/locales');
        i18n.setLocale('fr');

        assert.equal('fr', i18n.__('lng'));
        assert.equal('ok', i18n.__('foo.bar'));
    });

    it('should get language', () => {
        let i18n = new Internationalization('./lib/test/locales');

        assert.equal('en', i18n.getLocale());
        i18n.setLocale('fr');
        assert.equal('fr', i18n.getLocale());
    });

    it('should fallback when specified', () => {
        let i18n = new Internationalization('./lib/test/locales', 'fr', {
            fr: 'en'
        });

        assert.equal('en', i18n.__('lng'));
    });

    it('should use vsprinf', () => {
        let i18n = new Internationalization('./lib/test/locales');

        assert.equal('I have 1 mouse', i18n.__('mouse', 1));
    });
});
