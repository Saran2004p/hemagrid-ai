import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool
}
from
"amazon-cognito-identity-js";

import {
  cognitoConfig
}
from "../config/cognito";

const pool =
  new CognitoUserPool(
    cognitoConfig
  );

export function login(
  email,
  password
) {

  return new Promise(
    (resolve,reject)=>{

      const user =
        new CognitoUser({

          Username:
            email,

          Pool:
            pool
        });

      const auth =
        new AuthenticationDetails({

          Username:
            email,

          Password:
            password
        });

      user.authenticateUser(
        auth,
        {

          onSuccess:
            resolve,

          onFailure:
            reject
        }
      );
    }
  );
}