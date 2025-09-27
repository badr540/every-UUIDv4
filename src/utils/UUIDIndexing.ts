import { isValidHex, hexToBinary } from "./MathUtils";

export function getUUID(index: bigint): string {
    let binary: string = index.toString(2).padStart(Number(122), '0');

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

export function getUUIDIndex(UUID: string){

    let hex = UUID.replaceAll('-', '')
    
    if(hex.length != 32 || !isValidHex(hex)) return -1n

    let decimal = BigInt('0x' + hex)

    let binary = decimal.toString(2).padStart(128, '0')

    let uuidBits = '0b';
    uuidBits += binary.slice(0, 48);
    uuidBits += binary.slice(52, 64);
    uuidBits += binary.slice(66)

    return BigInt(uuidBits);
}

export function searchUUIDIndex(searchTerm: string, searchIndex: bigint){
    searchTerm = searchTerm.replaceAll('-', '')
    
    if(!isValidHex(searchTerm)) return -1n
    if(searchTerm.length == 32){
        return getUUIDIndex(searchTerm)
    }
    const matches: bigint = findNumOfMatches(searchTerm)
    if(matches == 0n){
        return -1n
    }
    
    searchIndex = ((searchIndex % matches) + matches) % matches;
    let UUID = findMatch(searchTerm, searchIndex)
    return getUUIDIndex(UUID)
}

export function findNumOfMatches(searchTerm: string): bigint{
    searchTerm = searchTerm.replaceAll('-', '')
    if(searchTerm==='') return 0n

    let numOfVariations: bigint = 0n
    let hex: string = "00000000000040008000000000000000"
  
    for(let i = hex.length-searchTerm.length; i >= 0; i--){

        let numOfHexDigits = hex.length-searchTerm.length
        numOfHexDigits -= (12 > i && 12 < i+searchTerm.length) ? 0 : 1
        numOfHexDigits -= (16 > i && 16 < i+searchTerm.length) ? 0 : 1

        let outputhex = hex.slice(0, i) + searchTerm + hex.slice(i+searchTerm.length)
        let bits = hexToBinary(outputhex)
        const versionBits = bits.slice(48, 52)
        const variantBits = bits.slice(64, 66)
        
        if(!(versionBits === "0100" && variantBits === "10")){
          continue
        }
        
        numOfVariations += 16n ** BigInt(numOfHexDigits)

    }
    
  return numOfVariations
}

function findMatch(searchTerm: string, searchIndex: bigint): string{

    let hex = "00000000000040008000000000000000".replaceAll('0', 'X')
    for(let i = hex.length-searchTerm.length; i >= 0; i--){
        let numOfHexDigits = hex.length-searchTerm.length
        numOfHexDigits -= (12 > i && 12 < i+searchTerm.length) ? 0 : 1
        numOfHexDigits -= (16 > i && 16 < i+searchTerm.length) ? 0 : 1
        let outputhex = hex.slice(0, i) + searchTerm + hex.slice(i+searchTerm.length)
        let bits = hexToBinary(outputhex)
        const versionBits = bits.slice(48, 52)
        const variantBits = bits.slice(64, 66)
        if(!(versionBits === "0100" && variantBits === "10")){
          continue
        }

        if(searchIndex <= 16n ** BigInt(numOfHexDigits)){
            let res: string[] = searchIndex.toString(16).padStart(numOfHexDigits, '0').split("")
            let hexArray: string[] = outputhex.split("")
            hexArray = hexArray.map<string>(digit => (digit == 'X')? res.shift() || '0' : digit)
            return hexArray.join("")
        }
        else{
            searchIndex -= 16n ** BigInt(numOfHexDigits)
        }
    }

    return ""
}