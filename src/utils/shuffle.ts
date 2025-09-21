const N = (1n << 122n) + 1n; 
const a = 3802123759143173362854049715225897627n;
const b = 3802123759143173362854049715225897628n;

export function permute(x: bigint): bigint {
  return (a * x + b) % N;
}