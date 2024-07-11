import {Router } from "express";
import { addToOrganisation, addUser, CreateOrganisation, GetDetails, GetOneOrganisation, GetOrganisations, Login } from "../controller/User.js";
import { authorize, authenticate } from "../middleware/Authenticate.js";
const router = Router();

router.post("/auth/register", authenticate, authorize, addUser)
router.post("/auth/login", authenticate, authorize, Login)
router.get(" /api/organisations", GetOrganisations)
router.post("/api/organisations", authenticate, CreateOrganisation )
router.get("/api/users/:id", GetDetails)
router.get(" /api/organisations/:orgId", GetOneOrganisation )
router.post("/api/organisations/:orgId/users", authenticate, addToOrganisation )

export default router;