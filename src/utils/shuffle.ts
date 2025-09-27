
function egcd(a: bigint, b: bigint): [bigint, bigint, bigint] {
  if (b === 0n) return [a, 1n, 0n];
  const [g, x1, y1] = egcd(b, a % b);
  return [g, y1, x1 - (a / b) * y1];
}

function modInverse(a: bigint, n: bigint): bigint {
  const [g, x] = egcd(a, n);
  if (g !== 1n) throw new Error("No modular inverse exists");
  return ((x % n) + n) % n;
}

const N = (1n << 122n) + 1n; 
const a = 3802123759143173362854049715225897627n;
const b = 3802123759143173362854049715225897628n;
const aInv = modInverse(a, N);

export function permute(x: bigint): bigint {
  return (a * x + b) % N;
}

export function invert(y: bigint): bigint {
  return (aInv * ((y - b + N) % N)) % N;
}