import * as AWS from "aws-sdk";

// Initialize env variables
const accessKeyId = process.env.ACCESS_KEY_AWS as string;
const secretAccessKey = process.env.SECRET_KEY_AWS as string;
const region = process.env.REGION_AWS as string;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

let dynamoDb: AWS.DynamoDB.DocumentClient | null = null;

function getDynamoDb() {
  if (dynamoDb === null) {
    dynamoDb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
  }
  return dynamoDb;
}

export default getDynamoDb;
