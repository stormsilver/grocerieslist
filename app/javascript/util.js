const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function sortByName(a, b) {
  return collator.compare(a.name.toUpperCase(), b.name.toUpperCase());
}
