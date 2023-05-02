import { ConceptInfo } from "@/types/ConceptInfo";
import { Item } from "@/types/Item";
import getDynamoDb from "@/utils/globals/dynamoDb";

const sketchTable = process.env.TABLE_NAME as string;
const conceptTable = process.env.CONCEPT_TABLE_NAME as string;

export default async function scanDynamoDbForRecords(): Promise<
  [Item[], ConceptInfo[]]
> {
  const sketchesParams: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: sketchTable,
    ProjectionExpression: "concept, id, stim_url",
  };

  const conceptsParams: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: conceptTable,
    ProjectionExpression: "concept_name, display_count",
  };

  try {
    const sketchesResult = await getDynamoDb().scan(sketchesParams).promise();
    const conceptResults = await getDynamoDb().scan(conceptsParams).promise();

    return [
      (sketchesResult.Items as Item[]) || [],
      (conceptResults.Items as ConceptInfo[]) || [],
    ];
  } catch (err) {
    console.error("Error saving item to DynamoDB:", err);
    return [[], []];
  }
}
