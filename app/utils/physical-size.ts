export type PhysicalDimensions = {
  width: number;
  height: number;
  depth?: number;
};

export function parsePhysicalDimensions(
  value: unknown,
  fallback: PhysicalDimensions = { width: 100, height: 100 },
): PhysicalDimensions {
  const label = String(value || "").trim();
  const values = (label.match(/[\d.]+/g) || [])
    .map(Number)
    .filter((number) => Number.isFinite(number) && number > 0);

  if (!values.length) return fallback;

  const isDiameter = /[Ø⌀]|diameter/i.test(label);
  if (isDiameter) {
    return {
      width: values[0],
      height: values[0],
      ...(values[1] ? { depth: values[1] } : {}),
    };
  }

  return {
    width: values[0],
    height: values[1] || values[0],
    ...(values[2] ? { depth: values[2] } : {}),
  };
}
