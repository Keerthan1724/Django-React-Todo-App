import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./ViewTodo.css";
import { useNavigate } from "react-router-dom";
import delete_todo from "../../assets/delete_todo.svg";
import api from "../../utils/api";

const ViewTodo = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await api.get("http://127.0.0.1:8000/api/todos/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(response.data);
      } catch (error) {
        console.log(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchTodos();
  }, [navigate]);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed === true;
    if (filter === "pending") return todo.completed === false;
    return true;
  });

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    const token = localStorage.getItem("access");
    if (!token) return;

    const confirmDelete = window.confirm("Delete this ?");
    if (!confirmDelete) return;

    try {
      await api.delete(`http://127.0.0.1:8000/api/todos/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      alert("Todo deleted");
    } catch (error) {
      alert("Failed to delete Todo");
      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="view-todo">
      <Navbar />

      <div className="view-todo-main-section">
        <h4>📝 Your Todos</h4>
        <hr />

        <div className="filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>

        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <div
              className="todo-item"
              key={todo.id}
              onClick={() => navigate(`/todo/${todo.id}`)}
            >
              <div>{todo.title}</div>
              <span
                className="delete-btn"
                onClick={(e) => handleDelete(e, todo.id)}
              >
                <img src={delete_todo} alt="" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewTodo;
