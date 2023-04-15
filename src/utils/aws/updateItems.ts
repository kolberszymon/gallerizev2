/*
Explanation of proposed algorithm:
Since we're counting user tag weigth, which is a number between 0 and 1, we need to
multiply it by 100

so 100 outright votes equals 10000 invalidTagsCount
*/

import { Image } from "@/types/Image.dto";
import * as AWS from "aws-sdk";

const accessKeyId = process.env.ACCESS_KEY_AWS as string;
const secretAccessKey = process.env.SECRET_KEY_AWS as string;
const region = process.env.REGION_AWS as string;
const tableName = process.env.TABLE_NAME as string;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

async function updateImageInvalidTagsCount(item: Image, incrementBy: number) {
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
    const result = await dynamoDb.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}

const updateS3Items = async (items: Image[], weight: number) => {
  try {
    for (const item of items) {
      const adjustedInvalidCount = Math.round(weight * 100);

      const updatedItem = await updateImageInvalidTagsCount(
        item,
        adjustedInvalidCount
      );

      console.log("Updated item:", updatedItem);
    }
  } catch (error) {
    console.error("Error updating S3 items:", error);
  }
};

export default updateS3Items;
