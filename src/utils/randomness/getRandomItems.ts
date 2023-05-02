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

  while (true) {
    const randomItem = chance.weighted(
      items,
      items.map((item) => 1 / (item.display_count || 1))
    );

    if (itemsIds.includes(randomItem.id)) {
      continue;
    }

    randomItems.push({ ...randomItem, valid });
    itemsIds.push(randomItem.id);

    if (randomItems.length === numberOfItems) {
      break;
    }
  }

  return randomItems;
}

export default getRandomWeightedItems;
