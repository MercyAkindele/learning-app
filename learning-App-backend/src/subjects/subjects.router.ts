import express, { Express } from "express";
const router = require("express").Router();
const controller = require("./subjects.controller");
router
  .route("/subject")
  .post(controller.created)
  // .post(controller.checkSub)
  .get(controller.list);

router.route("/subject/:subject_name").get(controller.getId);
module.exports = router;
