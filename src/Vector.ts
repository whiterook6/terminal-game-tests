export type Vector = [number, number];

export const add = (a: Vector, b: Vector, out: Vector) => {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
};

export const subtract = (a: Vector, b: Vector, out: Vector) => {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
};

export const scale = (a: Vector, scalar: number, out: Vector) => {
  out[0] = a[0] * scalar;
  out[1] = a[1] * scalar;
};

export const lengthSquared = (a: Vector): number => {
  return a[0] * a[0] + a[1] * a[1];
};

export const length = (a: Vector): number => {
  return Math.sqrt(lengthSquared(a));
};

export const normalize = (a: Vector, out: Vector) => {
  const len = length(a);
  out[0] = a[0] / len;
  out[1] = a[1] / len;
};

export const dot = (a: Vector, b: Vector): number => {
  return a[0] * b[0] + a[1] * b[1];
};

export const angleBetween = (a: Vector, b: Vector): number => {
  return Math.acos(dot(a, b) / (length(a) * length(b)));
};

export const project = (a: Vector, b: Vector, out: Vector) => {
  const scalar = dot(a, b) / lengthSquared(b);
  scale(b, scalar, out);
};
