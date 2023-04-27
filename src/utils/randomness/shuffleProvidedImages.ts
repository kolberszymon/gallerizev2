type Item = {
  id: string;
  concept: string;
};

function getRandomIds(items: Item[], count: number): string[] {
  // Create a Set to store unique IDs
  const uniqueIds = new Set<string>();

  // Check if the requested count is larger than the number of available items
  if (count > items.length) {
    throw new Error(
      "Requested count is larger than the number of available items"
    );
  }

  while (uniqueIds.size < count) {
    // Get a random item from the input array
    const randomItem = items[Math.floor(Math.random() * items.length)];

    // Add the item's ID to the Set (duplicates will be ignored)
    uniqueIds.add(randomItem.id);
  }

  // Convert the Set to an array and return it
  return Array.from(uniqueIds);
}

function shuffleProvidedImages(
  items: Item[],
  count: number,
  valid: boolean
): Item[] {
  const randomIds = getRandomIds(items, count);
  const uniqueItems = items
    .filter((item) => randomIds.includes(item.id))
    .map((item) => {
      return {
        ...item,
        valid,
      };
    });

  console.log(Array.from(uniqueItems));
  // Convert the Set to an array and return it
  return Array.from(uniqueItems);
}

export default shuffleProvidedImages;
