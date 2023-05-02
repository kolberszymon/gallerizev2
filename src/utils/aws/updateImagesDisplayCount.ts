import { Image } from "@/types/Image";
import * as AWS from "aws-sdk";
import getDynamoDb from "@/utils/globals/dynamoDb";

const tableName = process.env.TABLE_NAME as string;

async function updateImageDisplayCount(item: Image) {
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: tableName,
    Key: {
      id: item.id,
      concept: item.concept,
    },
    UpdateExpression: "SET display_count = :increment",
    ExpressionAttributeValues: {
      ":increment": 1,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await getDynamoDb().update(params).promise();

    return result.Attributes;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}

const updateImagesDisplayCount = async (items: Image[]) => {
  console.log("UPDATING IMAGES DISPLAY COUNT...");

  try {
    for (const item of items) {
      await updateImageDisplayCount(item);
    }
  } catch (error) {
    console.error("Error while updating:", error);
  }
};

export default updateImagesDisplayCount;
