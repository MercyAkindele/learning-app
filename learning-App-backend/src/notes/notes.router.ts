import express, {Express} from "express";
const router = require("express").Router();
const controller = require("./notes.controller")

router
    .route("/notes")
    .post(controller.create)


module.exports = router;
