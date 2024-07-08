import {Router } from "express";
import { addToOrganisation, addUser, CreateOrganisation, GetDetails, GetOneOrganisation, GetOrganisations, Login } from "../controller/User.js";
import { authorize, authenticate } from "../middleware/Authenticate.js";
const router = Router();

router.post("/auth/register", authenticate, authorize, addUser)
router.post("/auth/login", authenticate, authorize, Login)
router.get("/api/users/:id", GetDetails)
router.get(" /api/organisations", GetOrganisations)
router.get(" /api/organisations/:orgId", GetOneOrganisation )
router.post("/api/organisations", authenticate,  [
    body('name').notEmpty().withMessage('Name is required'),
  ], CreateOrganisation )
router.post("/api/organisations/:orgId/users", authenticate, addToOrganisation )

export default router;