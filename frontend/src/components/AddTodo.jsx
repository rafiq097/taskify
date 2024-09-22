import React, { useState } from 'react';
import toast from "react-hot-toast";
import axios from "axios";

const AddTodo = ({ fetchTasksData, userId }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "low",
    dueDate: "",
    createdBy: userId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTodo = async (event) => {
    event.preventDefault();
    if (formData.title.trim() === '') {
      return;
    }
    try {
      const task = await axios.post('/tasks/create', formData);
      console.log(task);
      toast.success("Task created successfully!");
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "low",
        dueDate: "",
      });
      setIsFormVisible(false);
      fetchTasksData();
    } catch (error) {
      console.error("Failed to add task", error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setIsFormVisible((prev) => !prev)}
        >
          {isFormVisible ? "Cancel" : "Add New Task"}
        </button>
      </div>

      {isFormVisible && (
        <div className="flex justify-center mb-4">
          <form onSubmit={handleAddTodo} className="bg-white shadow-md rounded p-6 w-full md:w-1/2">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
              <textarea
                name="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddTodo;
