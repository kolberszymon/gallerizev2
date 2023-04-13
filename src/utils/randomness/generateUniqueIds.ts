export default function generateUniqueIds(
  concepts: string[],
  result: Record<string, number>,
  length: number
): string[] {
  const usedIds: string[] = [];
  const ids: string[] = [];

  while (ids.length < length) {
    const conceptIndex = Math.floor(Math.random() * concepts.length);
    const concept = concepts[conceptIndex];
    const count = result[concept];

    if (count <= usedIds.length) {
      continue;
    }

    let id: string;
    let idNumber: number;

    do {
      idNumber = Math.floor(Math.random() * count) + 1;
      if (idNumber < 10) {
        id = `${concept}_0${idNumber}`;
      } else {
        id = `${concept}_${idNumber}`;
      }
    } while (usedIds.includes(id));

    usedIds.push(id);
    ids.push(id);
  }

  return ids;
}
