import * as AWS from "aws-sdk";

// Initialize env variables
const accessKeyId = process.env.ACCESS_KEY_AWS as string;
const secretAccessKey = process.env.SECRET_KEY_AWS as string;
const region = process.env.REGION_AWS as string;
const tableName = process.env.TABLE_NAME as string;

// console.log(accessKeyId, secretAccessKey, region, tableName);

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

export default async function fetchUniqueConceptKeyFromDynamoDb() {
  const params: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: tableName,
    ProjectionExpression: "concept",
  };

  try {
    const result = await dynamoDB.scan(params).promise();

    // count items in every concept
    const conceptCount: { [key: string]: number } = result.Items?.reduce(
      (acc: any, item: any) => {
        const concept = item.concept;
        if (acc[concept]) {
          acc[concept] += 1;
        } else {
          acc[concept] = 1;
        }
        return acc;
      },
      {}
    );

    // console.log(conceptCount);

    return conceptCount;
  } catch (err) {
    console.error("Error saving item to DynamoDB:", err);
  }
}
