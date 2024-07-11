const express = require("express");
const router = express.Router();
const func = require("../function/function");
const mid = require("../middleware/middleware");

router.post("/users",func.logres);
router.get("/users/history",[mid.cekApiKey],func.showHistory);
router.post("/topup",[mid.cekApiKey],func.topupsaldo);
router.put("/upgrade",[mid.cekApiKey],func.upgradeUser);
router.post("/guides",[mid.cekApiKey],func.addGuide);
router.post("/guides/:id_guide/steps",[mid.cekApiKey,mid.cekGuideAda],func.addSteps);
router.get("/guides/:id_guide",[mid.cekApiKey,mid.cekGuideAda],func.showGuides);

module.exports = router;