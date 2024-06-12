// bitmap on-chain index (OCI) module

const pages = Array(8).fill(0);

const allPages = [
    './pages/0.json',
    './pages/1.json',
    './pages/2.json',
    './pages/3.json',
    './pages/4.json',
    './pages/5.json',
    './pages/6.json',
    './pages/7.json',
    './pages/8.json',
]

async function fillPage(page) {
    const data = await fetch(allPages[page]).then(r => r.json())

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

    pages[page] = filledArray
}

export async function getBitmapSat(bitmapNumber) {

    const page = Math.floor(bitmapNumber / 100000)

    if (!pages[page]) {
        await fillPage(page)
    }

    return pages[page][bitmapNumber % 100000]
}

window.getBitmapSat = getBitmapSat
