import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import axios from "axios";
import { userAtom } from "../state/userAtom";
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
      setFilteredTasks(res.data.tasks);
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

  useEffect(() => {
    let results = tasks;

    if (search) {
      results = results.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    const priorityValues = {
      low: 1,
      medium: 2,
      high: 3,
    };    

    if (sort === "priorityAsc") {
      results.sort((a, b) => priorityValues[b.priority] - priorityValues[a.priority]);
    } else if (sort === "priorityDesc") {
      results.sort((a, b) => priorityValues[a.priority] - priorityValues[b.priority]);
    } else if (sort === "dateAsc") {
      results.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sort === "dateDesc") {
      results.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else if (sort === "statusAsc") {
      results.sort((a, b) => a.status.localeCompare(b.status));
    } else if (sort === "statusDesc") {
      results.sort((a, b) => b.status.localeCompare(a.status));
    }

    setFilteredTasks(results);
  }, [search, sort, tasks]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="mb-4 flex justify-center items-center">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg p-2 pl-10 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-2 top-2 text-gray-500">🔍</span>
          </div>
          <div className="relative ml-2">
            <select
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg p-2 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-33"
              value={sort}
            >
              <option value="none">Sort by</option>
              <option value="priorityAsc">Priority: Low to High</option>
              <option value="priorityDesc">Priority: High to Low</option>
              <option value="dateAsc">Date: Oldest to Newest</option>
              <option value="dateDesc">Date: Newest to Oldest</option>
              <option value="statusAsc">Status: Low to High</option>
              <option value="statusDesc">Status: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task._id} className="relative mb-4 p-4 border border-gray-200 rounded bg-white shadow-md">
              <div className={`text-sm font-medium ${task.status === "todo" ? "text-red-600" : task.status === "in-progress" ? "text-yellow-600" : "text-green-600"}`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </div>
              <h3 className="font-bold mt-1">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>

              <div className="absolute top-2 right-2 flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700" onClick={handleOpenModal}>
                  <FaEdit />
                </button>
                <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteTask(task._id)}>
                  <FaTrash />
                </button>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span className={`font-medium ${task.priority === "high" ? "text-red-600" : task.priority === "medium" ? "text-yellow-600" : "text-green-600"}`}>
                  Priority: {task.priority}
                </span>
                {task.dueDate && (
                  <span className={`font-medium ${new Date(task.dueDate) < new Date() ? "text-red-600" : "text-gray-500"}`}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {showEdit && <EditTask task={task} onClose={handleCloseModal} />}
            </div>
          ))}
        </div>
      </div>

      <AddTodo fetchTasksData={fetchTasksData} userId={userData.userId} />
    </>
  );
}

export default HomePage;
