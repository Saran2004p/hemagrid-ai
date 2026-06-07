const {
  CognitoJwtVerifier
} = require(
  "aws-jwt-verify"
);

const verifier =
  CognitoJwtVerifier.create({

    userPoolId:
      process.env
        .COGNITO_POOL_ID,

    tokenUse:
      "id",

    clientId:
      process.env
        .COGNITO_CLIENT_ID
  });

module.exports =
async (
  req,
  res,
  next
) => {

  try {

    const token =
      req.headers.authorization
        ?.replace(
          "Bearer ",
          ""
        );

    await verifier.verify(
      token
    );

    next();

  } catch {

    res.status(401).json({
      error:
        "Unauthorized"
    });
  }
};