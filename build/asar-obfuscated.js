function a0_0x9d4c(_0x5e96af, _0x1e8e8f) {
  const _0x52c1d3 = a0_0x52c1();
  return (
    (a0_0x9d4c = function (_0x9d4cfa, _0x3dab47) {
      _0x9d4cfa = _0x9d4cfa - 0xfb;
      let _0x2e9822 = _0x52c1d3[_0x9d4cfa];
      return _0x2e9822;
    }),
    a0_0x9d4c(_0x5e96af, _0x1e8e8f)
  );
}
function a0_0x52c1() {
  const _0x18efd8 = [
    '8wkWzqx',
    '92bxhyPw',
    'basename',
    '_resolveLookupPaths',
    '2268790ATRkLt',
    '1542CobNHO',
    '395483GUHWBZ',
    '27480QtHtNn',
    '3097059SElaRa',
    '.asar',
    '9944230TwrKfM',
    '11EMdOpx',
    '1219545sNajpu',
    'call',
    'module',
    'node_modules',
    'splice',
    '29691tNuNCk',
    'length',
  ];
  a0_0x52c1 = function () {
    return _0x18efd8;
  };
  return a0_0x52c1();
}
const a0_0x146e0f = a0_0x9d4c;
(function (_0x2ad72b, _0x380e6b) {
  const _0x364fd4 = a0_0x9d4c,
    _0x39c3a6 = _0x2ad72b();
  while (!![]) {
    try {
      const _0x23c0fb =
        -parseInt(_0x364fd4(0xff)) / 0x1 +
        parseInt(_0x364fd4(0xfd)) / 0x2 +
        (parseInt(_0x364fd4(0x10a)) / 0x3) *
          (parseInt(_0x364fd4(0x10d)) / 0x4) +
        (parseInt(_0x364fd4(0x100)) / 0x5) * (parseInt(_0x364fd4(0xfe)) / 0x6) +
        -parseInt(_0x364fd4(0x101)) / 0x7 +
        (-parseInt(_0x364fd4(0x10c)) / 0x8) *
          (parseInt(_0x364fd4(0x105)) / 0x9) +
        (parseInt(_0x364fd4(0x103)) / 0xa) *
          (-parseInt(_0x364fd4(0x104)) / 0xb);
      if (_0x23c0fb === _0x380e6b) break;
      else _0x39c3a6['push'](_0x39c3a6['shift']());
    } catch (_0x1acff4) {
      _0x39c3a6['push'](_0x39c3a6['shift']());
    }
  }
})(a0_0x52c1, 0xc4efa);
const path = require('path'),
  Module = require(a0_0x146e0f(0x107)),
  originalResolveLookupPaths = Module[a0_0x146e0f(0xfc)];
Module[a0_0x146e0f(0xfc)] =
  originalResolveLookupPaths['length'] === 0x2
    ? function (_0x3c54e6, _0x4f72dd) {
        const _0x3402b6 = a0_0x146e0f,
          _0x1750ad = originalResolveLookupPaths['call'](
            this,
            _0x3c54e6,
            _0x4f72dd
          );
        if (!_0x1750ad) return _0x1750ad;
        for (
          let _0x1155d9 = 0x0;
          _0x1155d9 < _0x1750ad[_0x3402b6(0x10b)];
          _0x1155d9++
        ) {
          path[_0x3402b6(0xfb)](_0x1750ad[_0x1155d9]) === 'node_modules' &&
            (_0x1750ad[_0x3402b6(0x109)](
              _0x1155d9 + 0x1,
              0x0,
              _0x1750ad[_0x1155d9] + _0x3402b6(0x102)
            ),
            _0x1155d9++);
        }
        return _0x1750ad;
      }
    : function (_0x43ad5a, _0x50135a, _0x4fdf0b) {
        const _0x48cb16 = a0_0x146e0f,
          _0x2ca41a = originalResolveLookupPaths[_0x48cb16(0x106)](
            this,
            _0x43ad5a,
            _0x50135a,
            _0x4fdf0b
          ),
          _0x1c465b = _0x4fdf0b ? _0x2ca41a : _0x2ca41a[0x1];
        for (
          let _0x490336 = 0x0;
          _0x490336 < _0x1c465b[_0x48cb16(0x10b)];
          _0x490336++
        ) {
          path[_0x48cb16(0xfb)](_0x1c465b[_0x490336]) === _0x48cb16(0x108) &&
            (_0x1c465b[_0x48cb16(0x109)](
              _0x490336 + 0x1,
              0x0,
              _0x1c465b[_0x490336] + _0x48cb16(0x102)
            ),
            _0x490336++);
        }
        return _0x2ca41a;
      };
