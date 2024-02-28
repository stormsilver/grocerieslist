export function sortByName(a, b) {
  return a.name.localeCompare(b.name);
}

// (a, b) => {
//   const nameA = a.name.toUpperCase();
//   const nameB = b.name.toUpperCase();
//   if (nameA < nameB) return -1;
//   if (nameA > nameB) return 1;
//   return 0;
// }
