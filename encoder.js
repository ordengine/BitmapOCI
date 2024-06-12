const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, '0.csv');
const outputFilePath = path.join(__dirname, 'pages/0.json');

fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const rows = data.trim().split('\n');
    const sats = rows.map(row => parseInt(row.split(',')[2]));

    const indexedArray = sats.map((element, index) => ({ index, satNumber: element }));

    indexedArray.sort((a, b) => a.satNumber - b.satNumber);

    const satArray = []
    const indexArray = []

    indexedArray.forEach((data, i) => {
            if (i === 0) {
                console.log(data.satNumber)
                satArray.push(data.satNumber)
                indexArray.push((data.index))
            } else {
                const delta = indexedArray[i].satNumber - indexedArray[i-1].satNumber

                satArray.push(delta)
                indexArray.push((data.index))
            }
    })

    fs.writeFile(outputFilePath, JSON.stringify([satArray, indexArray], null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`output written to ${outputFilePath}`);
    });
});
