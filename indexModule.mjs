/// bitmap on-chain index (OCI) module (0-839,999.bitmap)
//
// to get a full list, use await getBitmapSatsRange(0, 839999)
//
/// thanks to @_lefrog for finding + fixing multiple bugs - reinscriptions are now accounted for

const pages = Array(8).fill(0);

const allPages = [
    '/content/01bba6c58af39d7f199aa2bceeaaba1ba91b23d2663bc4ef079a4b5e442dbf74i0',
    '/content/bb01dfa977a5cd0ee6e900f1d1f896b5ec4b1e3c7b18f09c952f25af6591809fi0',
    '/content/bb02e94f3062facf6aa2e47eeed348d017fd31c97614170dddb58fc59da304efi0',
    '/content/bb037ec98e6700e8415f95d1f5ca1fe1ba23a3f0c5cb7284d877e9ac418d0d32i0',
    '/content/bb9438f4345f223c6f4f92adf6db12a82c45d1724019ecd7b6af4fcc3f5786cei0',
    '/content/bb0542d4606a9e7eb4f31051e91f7696040db06ca1383dff98505618c34d7df7i0',
    '/content/bb06a4dffba42b6b513ddee452b40a67688562be4a1345127e4d57269e6b2ab6i0',
    '/content/bb076934c1c22007b315dd1dc0f8c4a2f9d52f348320cfbadc7c0bd99eaa5e18i0',
    '/content/bb986a1208380ec7db8df55a01c88c73a581069a51b5a2eb2734b41ba10b65c2i0',
]

// ?origin= query param to set URL beginnings, like https://ordinals.com
const url = new URL(import.meta.url);
const params = new URLSearchParams(url.search);
let originParam = params.get('origin');

async function fillPage(page) {
    let data = await fetch((originParam || '') + allPages[page]).then(r => r.text())

    // fix for inconsistent (page 2 & 3) formatting (due to different mime types accident)
    if (page === 2 || page === 3) {
        data = '[' + data + ']'
        data = JSON.parse(data)
        data = [data.slice(0, 99999), data.slice(100000, 199999)]
    } else {
        try {
            data = JSON.parse(data.replaceAll('\\n  ', ''))
        } catch (e) {}
        try {
            data = JSON.parse(data.replaceAll('  ', ''))
        } catch (e) {}

    }

    // rebuild full sat numbers from deltas
    const fullSats = []
    data[0].forEach((sat, i) => {
        if (i === 0) {
            fullSats.push(parseInt(sat))
        } else {
            fullSats.push(parseInt(fullSats[i-1]) + parseInt(sat))
        }
    })

    // put them back into correct order
    let filledArray = Array(100000).fill(0);
    data[1].forEach((index, i) => {
        filledArray[index] = fullSats[i]
    })

    // page of sats is cached in the pages array
    pages[page] = filledArray
}

export async function getBitmapSat(bitmapNumber) {

    if (bitmapNumber < 0) {
        console.error('getBitmapSat: number is below 0!')
    } else if (bitmapNumber > 839999) {
        console.error('getBitmapSat: number is above 839,999!')
    }

    // determine which page this bitmap is in
    const page = Math.floor(bitmapNumber / 100000)

    // if the page has not yet been fetched and cached, then get it
    if (!pages[page]) {
        await fillPage(page)
    }

    return pages[page][bitmapNumber % 100000]
}

// some bitmaps are not the first inscription on their sat - data from @_lefrog
const satIndices = {92871: 1,92970: 1, 123132: 1,365518: 1,700181: 1,826151: 1,827151: 1,828151: 1,828239: 1,828661: 1,829151: 1,830151: 1,832104: 2,832249: 2,832252: 2,832385: 4,833067: 1,833101: 3,833105: 4,833109: 4,833121: 8,834030: 2,834036: 2,834051: 17,834073: 4,836151: 1,837115: 2,837120: 2,837151: 1,837183: 3,837188: 2,838058: 5,838068: 2,838076: 2,838096: 1,838151: 1,838821: 1,839151: 1,839377: 1,839378: 2,839382: 2,839397: 1,840151: 1,841151: 1,842151: 1,845151: 1}

export function getBitmapSatIndex(bitmapNumber) {
    return satIndices[bitmapNumber] || 0
}

export async function getBitmapInscriptionId(bitmapNumber) {

    // first get the sat
    const sat = await getBitmapSat(bitmapNumber)

    // get inscription ID from sat endpoint
    const id = await fetch((originParam || '') + '/r/sat/' + sat + '/at/' + getBitmapSatIndex(bitmapNumber)).then(r => r.json())

    return id.id
}

export async function getBitmapSatsRange(start, end) {
    const arr = []

    const total = (end+1) - start

    for (let i = start; i < (start + total); i++) {
        const sat = await getBitmapSat(i)
        arr.push(sat)
    }

    return arr
}
