import express, {Express} from "express";
const router = require("express").Router();
const controller = require("./subjects.controller")
router
    .route("/subject")
    .post(controller.created)
    .get(controller.list)
module.exports = router; 