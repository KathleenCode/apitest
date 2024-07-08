import jwt from "jsonwebtoken"
import User from "../models/User";
import Organisation from "../models/Organisation";
import dotenv from "dotenv";

dotenv.config();

const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, 'process.env.SECRET_KEY');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};



const authorize = async (req, res, next) => {
  const userId = req.user.id; // Assuming req.user is set by authentication middleware

  try {
    // Check if user is part of the requested organisation
    const organisationId = req.params.organisationId; // Assuming organisationId is passed in URL
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
