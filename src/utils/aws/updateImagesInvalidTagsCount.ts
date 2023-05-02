/*
Explanation of proposed algorithm:
Since we're counting user tag weigth, which is a number between 0 and 1, we need to
multiply it by 100

so 100 outright votes equals 10000 invalidTagsCount
*/

import { Image } from "@/types/Image";
import * as AWS from "aws-sdk";
import getDynamoDb from "@/utils/globals/dynamoDb";

const tableName = process.env.TABLE_NAME as string;

async function updateSingleInvalidTagsCount(item: Image, incrementBy: number) {
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: tableName,
    Key: {
      id: item.id,
      concept: item.concept,
    },
    UpdateExpression: "SET invalidTagsCount = :increment",
    ExpressionAttributeValues: {
      ":increment": incrementBy,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await getDynamoDb().update(params).promise();

    console.log("Result:", result);
    return result.Attributes;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}

const updateImagesInvalidTagsCount = async (items: Image[], weight: number) => {
  console.log("UPDATING IMAGES INVALID TAGS COUNT...");

  try {
    for (const item of items) {
      const adjustedInvalidCount = Math.round(weight * 100);

      const updatedItem = await updateSingleInvalidTagsCount(
        item,
        adjustedInvalidCount
      );
    }
  } catch (error) {
    console.error("Error while updating:", error);
  }
};

export default updateImagesInvalidTagsCount;
