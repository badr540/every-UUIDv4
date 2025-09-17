const N = 1_000_000n; 
const a = 3n; 
const b = 123n; 
const aInv = 333_333_667n; 


export function permute(x: bigint): bigint {
  return (a * x + b) % N;
}

export function invert(y: bigint): bigint {
  return (aInv * (y - b + N)) % N;
}