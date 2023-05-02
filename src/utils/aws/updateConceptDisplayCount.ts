import * as AWS from "aws-sdk";
import getDynamoDb from "@/utils/globals/dynamoDb";

const conceptTableName = process.env.CONCEPT_TABLE_NAME as string;

export async function updateConceptDisplayCount(concept_name: string) {
  console.log("UPDATING CONCEPT DISPLAY COUNT...");

  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: conceptTableName,
    Key: {
      concept_name,
    },
    UpdateExpression: `SET #attr = if_not_exists(#attr, :zero) + :incr`,
    ExpressionAttributeNames: { "#attr": "display_count" },
    ExpressionAttributeValues: { ":incr": 1, ":zero": 1 },
  };

  try {
    const result = await getDynamoDb().update(params).promise();

    return result.Attributes;
  } catch (error) {
    console.error("Error updating concepts item:", error);
    throw error;
  }
}

const updateConceptsDisplayCount = async (concepts: string[]) => {
  console.log("UPDATING CONCEPT DISPLAY COUNT...");
  console.log(concepts);

  try {
    for (const concept of concepts) {
      await updateConceptDisplayCount(concept);
    }
  } catch (error) {
    console.error("Error while updating:", error);
  }
};

export default updateConceptsDisplayCount;
