# internationalizationjs

ES6 Simple i18n

## Initialization

```js
let directory     = './locales';  // Relative to the working directory [default = './locales']
let defaultLocale = 'fr';         // Default locale (loaded at first)  [default = 'fr']
let fallbacks     = { en: 'de' }; // If switching to en, switch to de  [default = {}]

let i18n = new Internationalization(directory, defaultLocale, fallbacks)
    .init()
    .then(/* ... */);
```

## Translation files

A translation file is a js file that should exports a JSON.

```js
export default {
    key: 'value',
    objA: {
        objB: {
            key: 'value'
        }
    },
    cats: {
        one: 'a cat',
        more: 'cats'
    }
};
```

## Translation

```js
let i18n = new Internationalization()
    .init()
    .then(() => {
        console.log(i18n.__('key')); // Basic translation
        console.log(i18n.__('objA.objB.key')); // Object path finding (dot notation)
        console.log(i18n.__n('cats', 1)); // "a cat"
        console.log(i18n.__n('cats', 5)); // "cats"
    });
```

## Get/Set locale

```js
let i18n = new Internationalization()
    .init()
    .then(() => {
        i18n.setLocale('fr');
        i18n.__('cat'); // french translation
        i18n.getLocale(); // 'fr'
    });
```
