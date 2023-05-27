export const kebabToPascal = (kebabString: string): string => {
  return kebabString
    .toLowerCase()
    .split("-")
    .map((v) => v[0].toUpperCase() + v.slice(1))
    .join("");
};
