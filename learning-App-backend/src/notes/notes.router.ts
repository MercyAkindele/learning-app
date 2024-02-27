import express, { Express } from "express";
const router = require("express").Router();
const controller = require("./notes.controller");

router.route("/notes").post(controller.create);

router.route("/notes/:subjectId").get(controller.list).put(controller.edit)
router.route("/notes/:subjectId/:notesId").delete(controller.remove)
module.exports = router;
