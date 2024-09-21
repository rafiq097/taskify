const express = require("express");
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/task.controllers.js");
const verifyEmail = require("../middlewares/auth.js");

const { notifyEmail } = require("../utils/notifyEmail.js");

router.get('/get', verifyEmail, getTasks);
router.post('/create', createTask);
router.put('/update/:id', updateTask);
router.delete('/delete/:id', deleteTask);

router.post('/notify', notifyEmail);

module.exports = router;