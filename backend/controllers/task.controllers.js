const Task = require("../models/task.model.js");
const User = require("../models/user.model.js");

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json({ tasks });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};


const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        await task.save();

        res.status(201).json({ task });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    console.log(req.body);
    console.log(req.params);
    try {
        const id = req.params.id;
        console.log(id);
        const task = await Task.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
        console.log(task);
        if (!task)
            return res.status(404).json({ message: "No Such Task" });


        res.status(200).json({ task: task, success: "Successful" });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error });
    }
};

const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const task = await Task.findOneAndDelete({ _id: id });
        if (!task)
            return res.status(404).json({ message: "No Such Task" });


        console.log(task);
        res.status(200).json({ task: task, success: "Successful" });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };