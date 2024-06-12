const data = new FormData();
data.append('fee_rate', 22);
data.append('compress', 'brotli');
data.append('postage', '10000');
// data.append('grind_ambifix', 'bbbb');
data.append('split_revelations', false);
data.append('ordinal_receive_address', 'bc1qdr06k926axngldcpz48fe7vg72085muzxcsfzgp3eajnptnjlk5s5yz38y');
data.append('return_address', 'bc1qguzk63exy7h5uygg8m2tcenca094a8t464jfyvrmr0s6wkt74wls3zr5m3');
data.append('parent_inscription_ids[]', '4cc26939b8c375b75d283c44c1c1a02f9b28a33417d233a9b8fccbc4482aa102i0');

// const inputFilePath = path.join(__dirname, '7.json');

// const d = fs.promises.readFile('7.json', {encoding: 'text/json'});

const d = await fetch('http://localhost:8080/pages/1.json').then(r => r.text())

for (let i = 0; i < 1; i++) {
    const blob = new Blob([JSON.stringify(d)], {type: 'text/html'});
    data.append('inscriptions', blob);

    // const met = new Blob(['{"foo": "bar"}'], {type: 'text/json'});
    // data.append('metadata', met);

    // data.append('destination_address_overrides', 'bc1qguzk63exy7h5uygg8m2tcenca094a8t464jfyvrmr0s6wkt74wls3zr5m3');
}

// submit inscription
const a = await fetch('https://chisel.xyz/api/inscribe', {
    method: 'POST',
    body: data
}).then(r => r.json());

console.log(a)
