import jwt from "jsonwebtoken"
// import User from "../models/User";
import Organisation from "../models/Organisation.js";
import User from "../models/User.js"
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req, res, next) => {

  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
      // const token = req.header(tokenHeaderKey);
      const token = req.cookie.token;

      const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userId = verified;
      next();
      if (verified) {
          return res.send("Successfully Verified");
      } else {
          // Access Denied
          return res.status(401).send(error);
      }
  } catch (error) {
      // Access Denied
      res.clearCookie("token");
      console.log(error)
      // next();
}
}



export const authorize = async (req, res, next) => {
  const userId = req.userId; // Assuming req.user is set by authentication middleware

  try {
    // Check if user is part of the requested organisation
    const organisationId = req.params.orgId; // Assuming organisationId is passed in URL
    const organisation = await Organisation.findByPk(organisationId);

    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found.' });
    }

    // Check if user is part of the organisation or is the creator
    const isUserInOrganisation = await Organisation.hasUser(userId);
    const isUserCreator = Organisation.createdByUserId === userId;

    if (!isUserInOrganisation && !isUserCreator) {
      return res.status(403).json({ message: 'Unauthorized to access this organisation.' });
    }

    next();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default { authorize, authenticate }
