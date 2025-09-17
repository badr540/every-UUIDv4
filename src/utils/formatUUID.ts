
function formatUUID(index: bigint): string {
    const FREE_BITS = 122n;
    //if (index >= (1n << FREE_BITS)) throw new Error(`Index too large ${index.toString(16)}`);

    let binary: string = index.toString(2).padStart(Number(FREE_BITS), '0');

    let uuidBits: string = '';
    uuidBits += binary.slice(0, 48);
    uuidBits += '0100';
    uuidBits += binary.slice(48, 60);
    uuidBits += '10' + binary.slice(60, 62);
    uuidBits += binary.slice(62);

    let hex = '';
    for (let i = 0; i < 128; i += 4) {
        hex += parseInt(uuidBits.slice(i, i + 4), 2).toString(16);
    }

    return (
        hex.substring(0, 8)  + '-' +
        hex.substring(8, 12) + '-' +
        hex.substring(12, 16)+ '-' +
        hex.substring(16, 20)+ '-' +
        hex.substring(20)
    );
}

export default formatUUID;