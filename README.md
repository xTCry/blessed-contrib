[![npm][npm]][npm-url]
[![used by][used-by]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]

# @xtcry/blessed-contrib
Custom selection of Blessed library

## Slight differences (Upgrade your code)

### blessed-contrib
#### Before

```js
const Blessed = require('blessed');
const Contrib = require('blessed-contrib');
// ...
```

#### After

```js
const Blessed = require('blessed');
const Contrib = new (require('@xtcry/blessed-contrib'))(Blessed);
// ...
```

### neo-blessed-contrib
#### Before
```js
const Blessed = require('neo-blessed');
const Contrib = require('neo-blessed-contrib');
// ...
```

#### After

```js
const Blessed = require('neo-blessed');
const Contrib = new (require('@xtcry/blessed-contrib'))(Blessed);
// ...
```


## Docs

See original [documentation](https://github.com/yaronn/blessed-contrib#blessed-contrib).

## Changes

- Custom selection of Blessed library
- Merged changes from [coral/blessed-contrib](https://github.com/coral/blessed-contrib)

## License

MIT



[npm]: https://img.shields.io/npm/v/@xtcry/blessed.svg?style=flat-square
[used-by]: https://img.shields.io/npm/dt/@xtcry/blessed?label=used%20by&style=flat-square
[npm-url]: https://npmjs.com/package/@xtcry/blessed

[node]: https://img.shields.io/node/v/@xtcry/blessed.svg?style=flat-square
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/xTCry/blessed.svg?style=flat-square
[deps-url]: https://david-dm.org/xTCry/blessed