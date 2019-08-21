# @xtcry/blessed-contrib
Custom selection of Blessed library

## Slight differences (Upgrade your code)

### Before

```js
const Blessed = require('blessed');
const Contrib = require('blessed-contrib');
```
or
```js
const Blessed = require('neo-blessed');
const Contrib = require('neo-blessed-contrib');
```

### After

```js
const Blessed = require('blessed');
const Contrib = new (require('@xtcry/blessed-contrib'))(Blessed);
```
or
```js
const Blessed = require('@xtcry/blessed');
const Contrib = new (require('@xtcry/blessed-contrib'))(Blessed);
```
or
```js
const Blessed = require('neo-blessed');
const Contrib = new (require('@xtcry/blessed-contrib'))(Blessed);
```


## Docs

See original [documentation](https://github.com/yaronn/blessed-contrib#blessed-contrib).

## Changes

- Custom selection of Blessed library
- Merged changes from [coral/blessed-contrib](https://github.com/coral/blessed-contrib)

## License

MIT
