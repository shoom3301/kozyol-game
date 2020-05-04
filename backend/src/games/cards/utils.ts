export const randomEnumValue = <T extends Enumerator>(enumeration: T): T => {
  const values = Object.keys(enumeration);
  const enumKey = values[Math.floor(Math.random() * values.length)];
  return enumeration[enumKey];
};

export const randomArrayValue = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];
