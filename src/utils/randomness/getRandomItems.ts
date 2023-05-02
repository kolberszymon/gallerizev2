import { Item } from "@/types/Item";
import Chance from "chance";

const chance = new Chance();

function getRandomWeightedItems(
  items: Item[],
  numberOfItems: number,
  valid: boolean
) {
  const itemsIds: string[] = [];
  const randomItems: Item[] = [];
  const itemsCopy = [...items];

  for (let i = 0; i < numberOfItems; i++) {
    const randomItem = chance.weighted(
      itemsCopy,
      itemsCopy.map((item) => 1 / (item.display_count || 1))
    );

    const randomItemIndex = itemsCopy.findIndex(
      (item) => item.id === randomItem.id
    );

    randomItems.push({ ...randomItem, valid });
    itemsCopy.splice(randomItemIndex, 1);
  }

  // while (true) {
  //   const randomItem = chance.weighted(
  //     items,
  //     items.map((item) => 1 / (item.display_count || 1))
  //   );

  //   if (itemsIds.includes(randomItem.id)) {
  //     continue;
  //   }

  //   randomItems.push({ ...randomItem, valid });
  //   itemsIds.push(randomItem.id);

  //   if (randomItems.length === numberOfItems) {
  //     break;
  //   }
  // }

  return randomItems;
}

export default getRandomWeightedItems;
