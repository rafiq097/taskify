import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditTask = ({ task, onClose }) => {
  const [formData, setFormData] = useState(new FormData());

  useEffect(() => {
    // Initialize formData with current task data
    setFormData((prev) => {
      const data = new FormData();
      data.append("title", task.title);
      data.append("description", task.description);
      data.append("status", task.status);
      data.append("priority", task.priority);
      data.append("dueDate", task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
      return data;
    });
  }, [task]);

  const handleChange = (e) => {
    formData.set(e.target.name, e.target.value);
    setFormData(new FormData(formData)); // Update state
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/tasks/update/${task._id}`, {
        title: formData.get("title"),
        description: formData.get("description"),
        status: formData.get("status"),
        priority: formData.get("priority"),
        dueDate: formData.get("dueDate"),
      });
      console.log(response.data);
      toast.success("Task edited successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.get("title")}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.get("description")}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            value={formData.get("status")}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Priority</label>
          <select
            name="priority"
            value={formData.get("priority")}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
