import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const tableName = process.env.TABLE_NAME as string;

const docClient = new AWS.DynamoDB.DocumentClient();

interface Item {
  id: string;
  concept: string;
  stim_url: string;
  // Define any other attributes of your items here
}

export default async function fetchItemsByIdsFromDynamoDb(
  ids: string[]
): Promise<Item[]> {
  const params: DocumentClient.BatchGetItemInput = {
    RequestItems: {
      [tableName]: {
        Keys: ids.map((id) => ({ id, concept: id.split("_")[0] })),
        ConsistentRead: false,
        ProjectionExpression: "id, concept, stim_url",
      },
    },
  };

  const response = await docClient.batchGet(params).promise();

  if (!response.Responses || !response.Responses[tableName]) {
    return [];
  }

  const items = response.Responses[tableName];

  // Return the items with any additional processing you need
  return items as Item[];
}
