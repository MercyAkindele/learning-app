import express, { Express } from "express";
const router = require("express").Router();
const controller = require("./pomodoro.controller");

router.route("/pomodoro").post(controller.create);

module.exports = router;
