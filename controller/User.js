import User from "../models/User.js";
import Organisation from "../models/Organisation.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"

export const addUser = async(req, res) => {
    try {
        // const existingUser = await User.findOne({
        //     where: {
        //       [Op.or]: [{ username }, { email }],
        //     },
        //   });
      
        //   if (existingUser) {
        //     return res.status(400).json({ message: 'User already exists.' });
        //   }
        const { userId, firstName, lastName, email, password, phone } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ userId, firstName, lastName, email, password: hashedPassword, phone, orgId: user.id, name: user.firstName, description: user.email });
        const org = { orgId: user.id, name: user.firstName, description: user.email }
        const accessToken = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '5h' });
        console.log(accessToken);
        res.cookie('token', accessToken, {
          // maxAge: 3 * 24 * 60 * 60 * 1000,
          httpOnly: true
        })
        res.status(201).json({
            "status": "success",
            "message": "Registration successful",
            "data": {
              "accessToken": accessToken,
              "user": {
                  "userId": user.userId,
                  "firstName": user.firstName,
                  "lastName": user.lastName,
                  "email": user.email,
                  "phone": user.phone,
              }
            }
        })} catch (error) {
        if (error.name === 'SequelizeValidationError') {
          // Handle validation errors
          const errors = error.errors.map(err => ({
            field: err.path,
            message: err.message
          }));
          res.status(422).json({ errors });
        } else {
          // Handle other errors
          console.error('Error:', error);
          res.status(400).json({
            "status": "Bad request",
            "message": "Registration unsuccessful",
            "statusCode": 400
        });
        }
      }
}

export const Login = async(req, res) => {
    try {
        const { userId, firstName, lastName, email, password, phone } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
        return res.status(404).json({ message: 'User not found.' });
        }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '5h' });

    res.status(200).json({ "status": "success",
    "message": "Login successful",
    "data": {
      "accessToken": token,
      "user": {
	      "userId": user.id,
	      "firstName": user.firstName,
				"lastName": user.lastName,
				"email": user.email,
				"phone": user.phone
      }
    } });
    } catch(error) {
        if (error.name === 'SequelizeValidationError') {
            // Handle validation errors
            const errors = error.errors.map(err => ({
              field: err.path,
              message: err.message
            }));
            res.status(422).json({ errors });
          } else {
            // Handle other errors
            console.error('Error:', error);
            res.status(401).json({  "status": "Bad request",
                "message": "Authentication failed",
                "statusCode": 401 });
          }
    }
}

export const GetDetails = async(req, res) => {
    try {
        const { id } = req.params;
         // Find organisations where the user belongs or created
    const organisations = await Organisation.findAll({
        where: {
          createdByUserId: id,
        },
      });
        res.status(200).json({
            "status": "success",
        "message": 'Organisations retrieved successfully',
        "data": {
          "userId": organisations.userId,
          "firstName": organisations.firstName,
                "lastName": organisations.lastName,
                "email": organisations.email,
                "phone": organisations.phone
        }
    });
    } catch(error) {
        if (error.name === 'SequelizeValidationError') {
            // Handle validation errors
            const errors = error.errors.map(err => ({
              field: err.path,
              message: err.message
            }));
            res.status(422).json({ errors });
          } else {
            // Handle other errors
            console.error('Error:', error);
            res.status(401).json({  "status": "Bad request",
                "message": "Authentication failed",
                "statusCode": 401 });
          }
    }
}

export const GetOrganisations = async(req, res) => {
    const id = req.userId;

  try {
    // Find organisations where the user belongs or created
    const organisations = await Organisation.findAll({
      where: {
        createdByUserId: id,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations: [
            {
                "orgId": organisations.id,
                "name": organisations.firstName,
                "description": organisations.lastName,
            }
        ]
      },
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
        // Handle validation errors
        const errors = error.errors.map(err => ({
          field: err.path,
          message: err.message
        }));
        res.status(422).json({ errors });
      } else {
        // Handle other errors
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
  }
}
}
export const GetOneOrganisation = async(req, res) => {
    const idp = req.userId;
    const orgId = req.params.orgId;

  try {
    // Find organisation by orgId and ensure it belongs to or was created by the user
    const organisation = await Organisation.findOne({
      where: {
        orgId,
        createdByUserId: idp,
      },
    });

    if (!organisation) {
        return res.status(404).json({ message: 'Organisation not found or unauthorized.' });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Organisation retrieved successfully',
        data: {
          orgId: organisation.orgId,
          name: organisation.name,
          description: organisation.description,
        },
      });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            // Handle validation errors
            const errors = error.errors.map(err => ({
              field: err.path,
              message: err.message
            }));
            res.status(422).json({ errors });
          } else {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
          }
      }
}

export const CreateOrganisation =  async(req, res) => {
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: 'Bad Request',
            message: 'Client error',
            errors: errors.array(),
          });
        }
      
        const { name, description } = req.body;
        const userId = req.userId;
      
        try {
          // Create new organisation
          const newOrganisation = await Organisation.create({
            name,
            description,
            createdByUserId: userId,
          });
      
          res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: {
              orgId: newOrganisation.orgId,
              name: newOrganisation.name,
              description: newOrganisation.description,
            },
          });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // Handle validation errors
                const errors = error.errors.map(err => ({
                  field: err.path,
                  message: err.message
                }));
                res.status(422).json({ errors });
              } else {
          console.error('Error:', error);
          res.status(500).json({ message: 'Internal server error' });
        }}
      };
}
 
export const addToOrganisation =async(req, res) => {
    const { orgId } = req.params;
    const { userId } = req.body;
    const currentUserId = req.userId;

  try {
    // Check if the logged-in user has permission to add users to this organisation
    const organisation = await Organisation.findOne({ where: { orgId } });
    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found.' });
    }

    if (organisation.createdByUserId !== currentUserId) {
      return res.status(403).json({ message: 'Unauthorized to add users to this organisation.' });
    }
    // Check if the user to be added exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Add user to organisation
    await organisation.addUser(user);

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
        // Handle validation errors
        const errors = error.errors.map(err => ({
          field: err.path,
          message: err.message
        }));
        res.status(422).json({ errors });
      } else {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }}
}
