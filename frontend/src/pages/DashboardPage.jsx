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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
  TASK: "task",
};

const DraggableTask = ({ task, handleDeleteTask, handleOpenModal }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task._id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`relative mb-4 p-4 border border-gray-200 rounded ${
        isDragging ? "opacity-50" : ""
      }`}
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
    </div>
  );
};

const DropZone = ({ status, children, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item) => {
      onDrop(item.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`bg-white shadow-md rounded p-6 ${
        isOver ? "border-2 border-blue-500" : ""
      }`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          status === "todo"
            ? "text-red-600"
            : status === "in-progress"
            ? "text-yellow-600"
            : "text-green-600"
        }`}
      >
        {status === "todo"
          ? "ToDo"
          : status === "in-progress"
          ? "In Progress"
          : "Completed"}
      </h2>
      {children}
    </div>
  );
};

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenModal = () => setShowEdit(true);
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
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (taskId, newStatus) => {
    try {
      await axios.put(`/tasks/update/${taskId}`, { status: newStatus });
      toast.success("Task moved successfully!");
      fetchTasksData();
    } catch (error) {
      console.error("Failed to move task:", error);
      toast.error("Failed to move task.");
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
    let results = [...tasks];

    if (search) {
      results = results.filter(
        (task) =>
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
      results.sort(
        (a, b) => priorityValues[b.priority] - priorityValues[a.priority]
      );
    } else if (sort === "priorityDesc") {
      results.sort(
        (a, b) => priorityValues[a.priority] - priorityValues[b.priority]
      );
    } else if (sort === "dateAsc") {
      results.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sort === "dateDesc") {
      results.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
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
    <DndProvider backend={HTML5Backend}>
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
              className="border rounded-lg p-2 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sort}
            >
              <option value="none">Sort by</option>
              <option value="priorityAsc">Priority: Low to High</option>
              <option value="priorityDesc">Priority: High to Low</option>
              <option value="dateAsc">Date: Oldest to Newest</option>
              <option value="dateDesc">Date: Newest to Oldest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assigned Tasks */}
          <DropZone status="todo" onDrop={handleDrop}>
            {filteredTasks
              .filter((task) => task.status === "todo")
              .map((task) => (
                <DraggableTask
                  key={task._id}
                  task={task}
                  handleDeleteTask={handleDeleteTask}
                  handleOpenModal={() => {
                    setSelectedTask(task);
                    handleOpenModal();
                  }}
                />
              ))}
          </DropZone>

          {/* Ongoing Tasks */}
          <DropZone status="in-progress" onDrop={handleDrop}>
            {filteredTasks
              .filter((task) => task.status === "in-progress")
              .map((task) => (
                <DraggableTask
                  key={task._id}
                  task={task}
                  handleDeleteTask={handleDeleteTask}
                  handleOpenModal={() => {
                    setSelectedTask(task);
                    handleOpenModal();
                  }}
                />
              ))}
          </DropZone>

          {/* Completed Tasks */}
          <DropZone status="completed" onDrop={handleDrop}>
            {filteredTasks
              .filter((task) => task.status === "completed")
              .map((task) => (
                <DraggableTask
                  key={task._id}
                  task={task}
                  handleDeleteTask={handleDeleteTask}
                  handleOpenModal={() => {
                    setSelectedTask(task);
                    handleOpenModal();
                  }}
                />
              ))}
          </DropZone>
        </div>

        {showEdit && (
          <EditTask task={selectedTask} onClose={handleCloseModal} />
        )}

        <AddTodo />
      </div>
    </DndProvider>
  );
}

export default HomePage;
