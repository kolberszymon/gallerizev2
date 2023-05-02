import { ConceptInfo } from "@/types/ConceptInfo";
import Chance from "chance";

const chance = new Chance();

const getRandomWeightedConcept = (
  concepts: ConceptInfo[],
  conceptToAvoid: string | null = null
): string => {
  let selectedConcept: string | null = null;

  while (!selectedConcept || selectedConcept === conceptToAvoid) {
    const selectedItem = chance.weighted(
      concepts,
      concepts.map((concept) => 1 / concept.display_count)
    );

    selectedConcept = selectedItem.concept_name;
  }

  return selectedConcept;
};

export default getRandomWeightedConcept;
