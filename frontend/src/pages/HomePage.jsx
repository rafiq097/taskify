import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import axios from "axios";
import { userAtom } from "../state/userAtom";
import NavBar from "../components/NavBar";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner.jsx";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditTask from "../components/EditTask.jsx";
import AddTodo from "../components/AddTodo.jsx";

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");

  const handleOpenModal = () => {
    setShowEdit(true);
  };

  const handleCloseModal = () => {
    setShowEdit(false);
    fetchTasksData();
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/delete/${id}`);
      toast.success("Task deleted successfully!");
      fetchTasksData();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const fetchTasksData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`/tasks/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Failed to fetch user teams and tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserData(res.data.user);
        })
        .catch((err) => {
          console.log(err.message);
          localStorage.removeItem("token");
          setUserData(null);
        });
    } else {
      toast.error("Please login to continue");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchTasksData();
    verify();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="container mx-auto p-4">
        <br />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assigned Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">ToDo</h2>
            {tasks
              .filter((task) => task.status === "todo")
              .map((task) => (
                <div
                  key={task._id}
                  className="relative mb-4 p-4 border border-gray-200 rounded"
                >
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={handleOpenModal}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>

                  <div className="flex justify-between text-sm mt-2">
                    <span
                      className={`font-medium ${
                        task.priority === "high"
                          ? "text-red-600"
                          : task.priority === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Priority: {task.priority}
                    </span>
                    {task.dueDate && (
                      <span
                        className={`font-medium ${
                          new Date(task.dueDate) < new Date()
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {showEdit && (
                    <EditTask task={task} onClose={handleCloseModal} />
                  )}
                </div>
              ))}
          </div>

          {/* Ongoing Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">
              In Progress
            </h2>
            {tasks
              .filter((task) => task.status === "in-progress")
              .map((task) => (
                <div
                  key={task._id}
                  className="relative mb-4 p-4 border border-gray-200 rounded"
                >
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={handleOpenModal}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>

                  <div className="flex justify-between text-sm mt-2">
                    <span
                      className={`font-medium ${
                        task.priority === "high"
                          ? "text-red-600"
                          : task.priority === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Priority: {task.priority}
                    </span>
                    {task.dueDate && (
                      <span
                        className={`font-medium ${
                          new Date(task.dueDate) < new Date()
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {showEdit && (
                    <EditTask task={task} onClose={handleCloseModal} />
                  )}
                </div>
              ))}
          </div>

          {/* Completed Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              Completed
            </h2>
            {tasks
              .filter((task) => task.status === "completed")
              .map((task) => (
                <div
                  key={task._id}
                  className="relative mb-4 p-4 border border-gray-200 rounded"
                >
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={handleOpenModal}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-green-500 mt-2">Task Completed</p>

                  <div className="flex justify-between text-sm mt-2">
                    <span
                      className={`font-medium ${
                        task.priority === "high"
                          ? "text-red-600"
                          : task.priority === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Priority: {task.priority}
                    </span>
                    {task.dueDate && (
                      <span
                        className={`font-medium ${
                          new Date(task.dueDate) < new Date()
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {showEdit && (
                    <EditTask task={task} onClose={handleCloseModal} />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      <AddTodo fetchTasksData={fetchTasksData} userId={userData.userId} />
    </>
  );
}

export default HomePage;
