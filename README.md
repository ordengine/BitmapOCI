# bitmap on-chain index - data test

try it out:
https://ordengine.github.io/BitmapOCI

this index uses compressed chunks (100k each) of bitmap Satoshi numbers, which can then be read using a module function.  chunks are fetched only when needed, so if you are requesting 500.bitmap, the module will only fetch the first chunk (~200kb with brotli) vs fetching+decompressing the entire index (~2mb)

## module usage:


```
const bitdex = await import('./indexModule.mjs')
const sat = await bitdex.getBitmapSat(609)

// returns the sat number: 1610426053896395
```

## compression

instead of just a raw array of each satoshi number compressed with brotli, we are able to compress the index even more:

1. sort satoshi numbers in order from lowest to highest
2. convert this sorted array into an array of just the deltas (difference between current and last sat)
3. append an array of the original sat positions for rebuilding

this works because a lot of bitmaps were minted in bulk transactions, so the deltas between the sat numbers of sequential bitmaps end up being the same, since the UTXO's were split into the same amount of padding/postage.

the encoder file shows how the chunks are built from the full CSV's: https://github.com/ordengine/BitmapOCI/blob/main/encoder.js

the module shows how these compressed lists are then rebuilt for querying - https://github.com/ordengine/BitmapOCI/blob/main/indexModule.mjs

[chisel.xyz](https://chisel.xyz) script for brotli inscriptions (with custom ambifix, metadata, parents etc) https://github.com/ordengine/BitmapOCI/blob/main/chisel.mjs
