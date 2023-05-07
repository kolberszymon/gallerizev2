import { NextApiRequest, NextApiResponse } from "next";
import { Trial } from "@/types/Trial";
import * as AWS from "aws-sdk";

const accessKeyId = process.env.ACCESS_KEY_AWS as string;
const secretAccessKey = process.env.SECRET_KEY_AWS as string;
const region = process.env.REGION_AWS as string;
const tableName = process.env.OUTPUT_TABLE_NAME as string;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

async function updateTrial(trial: Trial) {
  const updateItem = {
    firstClickTime: trial.firstClickTime,
    lastClickTime: trial.lastClickTime,
    validConcept: trial.concepts.validConcept,
    invalidConcept: trial.concepts.invalidConcept,
    images: trial.images,
  };

  const attributeName = "trials";

  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: tableName,
    Key: {
      userId: trial.userId,
    },
    UpdateExpression: `SET ${attributeName} = list_append(${attributeName}, :objectToAdd)`,
    ExpressionAttributeValues: {
      ":objectToAdd": [updateItem],
    },
    ConditionExpression: "attribute_exists(userId)",
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return result.Attributes;
  } catch (error: any) {
    if (error.code === "ConditionalCheckFailedException") {
      return false;
    } else {
      console.error("Error updating item:", error);
      return null;
    }
  }
}

async function createTrial(trial: Trial) {
  const putItem = {
    userId: trial.userId,
    trials: [
      {
        firstClickTime: trial.firstClickTime,
        lastClickTime: trial.lastClickTime,
        validConcept: trial.concepts.validConcept,
        invalidConcept: trial.concepts.invalidConcept,
        images: trial.images,
      },
    ],
  };

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: putItem,
  };

  try {
    const result = await dynamoDb.put(params).promise();
    return result.Attributes;
  } catch (error: any) {
    console.error("Error updating item:", error);
    throw error;
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(400).json({ message: "This method is not allowed" });
    }

    const trial = req.body;

    console.log(trial);

    // Try to update existing record
    const success = await updateTrial(trial);

    if (success) {
      return res.json({ success: true });
    }

    // null means there was different error than ConditionalCheckFailedException
    if (success === null) {
      return res.json({ success: false });
    }

    // Try to create new record
    createTrial(trial);

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default handler;
