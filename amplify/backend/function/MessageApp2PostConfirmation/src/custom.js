/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { DynamoDB } = require('aws-sdk');
const ddb = new DynamoDB();

const tableName = process.env.USERTABLE;


exports.handler = async (event, context) => {
  
  //Check if user is logged in
  if (!event?.request?.userAttributes?.sub){
    console.log("No sub provided");
    return;
  }

  const now = new Date();
  const timestamp = now.getTime();

  //User data
  const userItem = {
    __typename: { S: 'User' },
    createdAt: { S: now.toISOString() },
    updatedAt: { S: now.toISOString() },
    id: { S: event.request.userAttributes.sub },
    name: { S: event.request.userAttributes.email },
    imageUri: { NULL: true || false },
    status: { NULL: true || false },
  }

  const params = {
    Item: userItem,
    TableName: tableName
  };
  
  // save a new user to DynamoDB
  try {
    await ddb.putItem(params).promise();
    console.log("success");
  } catch (e) {
    console.log(e)
  }

};
