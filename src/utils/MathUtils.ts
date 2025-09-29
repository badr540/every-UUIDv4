export function isBigNumber(n: bigint, cutoff = 10_000_000_000n): boolean {
  return n >= cutoff || n <= -cutoff;
}

export function formatBigNumber(n: bigint, digits = 2): string {
  if (!isBigNumber(n)) return n.toString();

  const s = n.toString();
  const exponent = s.length - 1;
  const mantissa = s[0] + (s.length > 1 ? "." + s.slice(1, digits) : "");
  return `${mantissa}×10^${exponent}`
}

export function hexToBinary(hex: string): string{
  return hex
    .split("")
    .map(c => parseInt(c, 16).toString(2).padStart(4, "0"))
    .join("")
}

export function isValidHex(hex: string): boolean{
    hex = hex.toUpperCase()
    for(let c of hex){
        const charCode = c.charCodeAt(0)
        if((charCode < 48 || charCode > 57)     // 0-9
        && (charCode < 65 || charCode > 70)){   // A-F
          return false
        }
    }

    return true
}

export function modCycle<T extends number | bigint>(n: T, m: T): T {
  
  if (typeof n === "bigint" && typeof m === "bigint") {
    if(m == 0n) return 0n as T
    return ((n % m) + m) % m as T
  }

  if (typeof n === "number" && typeof m === "number") {
    if(m == 0) return 0 as T
    return ((n % m) + m) % m as T
  }

  throw new TypeError("Arguments must both be number or both be bigint")
}
