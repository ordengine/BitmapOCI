# bitmap on-chain index - data test




### inscribed module:
https://ordinals.com/content/840bc0df4ffc5a7ccedbee35e97506c9577160e233982e627d0045d06366e362i0

### data chunks:

https://ordinals.com/content/01bba6c58af39d7f199aa2bceeaaba1ba91b23d2663bc4ef079a4b5e442dbf74i0
https://ordinals.com/content/bb01dfa977a5cd0ee6e900f1d1f896b5ec4b1e3c7b18f09c952f25af6591809fi0
https://ordinals.com/content/bb02e94f3062facf6aa2e47eeed348d017fd31c97614170dddb58fc59da304efi0
https://ordinals.com/content/bb037ec98e6700e8415f95d1f5ca1fe1ba23a3f0c5cb7284d877e9ac418d0d32i0
https://ordinals.com/content/bb9438f4345f223c6f4f92adf6db12a82c45d1724019ecd7b6af4fcc3f5786cei0
https://ordinals.com/content/bb0542d4606a9e7eb4f31051e91f7696040db06ca1383dff98505618c34d7df7i0
https://ordinals.com/content/bb06a4dffba42b6b513ddee452b40a67688562be4a1345127e4d57269e6b2ab6i0
https://ordinals.com/content/bb076934c1c22007b315dd1dc0f8c4a2f9d52f348320cfbadc7c0bd99eaa5e18i0
https://ordinals.com/content/bb986a1208380ec7db8df55a01c88c73a581069a51b5a2eb2734b41ba10b65c2i0


.



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

this ends up looking like:

```
[
  [
    393366314270,
    546,
    3835,
    3835,
    3835,
    3835,
    3835,
    3835,
    3835,
    3835,
    3835,
```

this works because a lot of bitmaps were minted in bulk transactions, so the deltas between the sat numbers of sequential bitmaps end up being the same (3835 in the example above), since the UTXO's were split into the same amount of padding/postage.  brotli compression can then take advantage of this by only saving the number once + how many times it's repeated.

basically the repeating parts of the array [3835,3835,3835,3835,3835,3835,3835, 3835] gets saved as just [3835 x 8]

the encoder file shows how the chunks are built from the full CSV's: https://github.com/ordengine/BitmapOCI/blob/main/encoder.js

the module shows how these compressed lists are then rebuilt for querying - https://github.com/ordengine/BitmapOCI/blob/main/indexModule.mjs

[chisel.xyz](https://chisel.xyz) script for brotli inscriptions (with custom ambifix, metadata, parents etc) https://github.com/ordengine/BitmapOCI/blob/main/chisel.mjs

