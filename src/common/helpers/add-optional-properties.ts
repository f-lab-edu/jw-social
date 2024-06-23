export function addOptionalProperties<T extends Record<string, any>>(
  baseObject: T,
  properties: Partial<T>,
): T {
  return Object.entries(properties).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        (acc as any)[key] = value;
      }
      return acc;
    },
    { ...baseObject },
  );
}
