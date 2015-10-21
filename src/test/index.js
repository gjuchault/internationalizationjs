'use strict';

/* globals describe, it */

import assert               from 'assert';
import Internationalization from '../i18n';

describe('Internationalization', () => {
    it('should construct an i18n object', () => {
        let i18n = new Internationalization();
        let i18n2 = new Internationalization('./locales/', 'fr', {
            en: 'fr'
        });

        assert.equal('./locales', i18n.source);
        assert.equal('./locales/', i18n2.source);
        assert.equal('en', i18n.defaultLocale);
        assert.equal('fr', i18n2.defaultLocale);
        assert.equal(0, Object.keys(i18n.fallbacks).length);
        assert.equal(1, Object.keys(i18n2.fallbacks).length);
    });

    it('should load a directory', done => {
        let i18n = new Internationalization('./lib/test/locales');
        i18n
            .init()
            .then(() => {
                assert.equal(true, 'en' in i18n.locales);
                done();
            });
    });

    it('should set locale to the default one if available', done => {
        let i18n = new Internationalization('./lib/test/locales');
        i18n
            .init()
            .then(() => {
                assert.equal(true, 'en' in i18n.locales);
                assert.notEqual(null, i18n.locale);
                assert.equal('en', i18n.locale.lng);
                done();
            });
    });

    it('should translate basic sentence', done => {
        let i18n = new Internationalization('./lib/test/locales');
        i18n
            .init()
            .then(() => {
                assert.equal('English', i18n.__('language'));
                done();
            });
    });

    it('should not translate unkown sentences', done => {
        let i18n = new Internationalization('./lib/test/locales');
        i18n
            .init()
            .then(() => {
                assert.equal(undefined, i18n.__('languxage'));
                done();
            });
    });

    it('should translate sentences with a dot notation', done => {
        let i18n = new Internationalization('./lib/test/locales');
        i18n
            .init()
            .then(() => {
                assert.equal('ok', i18n.__('foo.bar'));
                done();
            });
    });

    it('should translate numbered sentences', done => {
        let i18n = new Internationalization('./lib/test/locales');
        i18n
            .init()
            .then(() => {
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
                done();
            });
    });

    it('should translate numbered sentences after a language change', done => {
        let i18n = new Internationalization('./lib/test/locales');
        i18n
            .init()
            .then(() => {
                i18n.setLocale('fr');
            })
            .then(() => {
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
                done();
            });
    });

    it('should not translate numbered sentences that are not numbered sentences', done => {
        let i18n = new Internationalization('./lib/test/locales');
        i18n
            .init()
            .then(() => {
                assert.equal(undefined, i18n.__n('foo.bar', 1));
                done();
            });
    });

    it('should change language', done => {
        let i18n = new Internationalization('./lib/test/locales');
        i18n
            .init()
            .then(() => {
                i18n.setLocale('fr');
            })
            .then(() => {
                assert.equal('fr', i18n.__('lng'));
                assert.equal('ok', i18n.__('foo.bar'));
                done();
            });
    });

    it('should get language', done => {
        let i18n = new Internationalization('./lib/test/locales');

        i18n
            .init()
            .then(() => {
                assert.equal('en', i18n.getLocale().lng);
            })
            .then(() => {
                i18n.setLocale('fr');
                assert.equal('fr', i18n.getLocale().lng);
                done();
            });
    });
});
