import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./ViewTodo.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import delete_todo from "../../assets/delete_todo.svg";

const ViewTodo = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/todos/");
        setTodos(response.data);
      } catch (error) {
        console.log(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchTodos();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed === true;
    if (filter === "pending") return todo.completed === false;
    return true;
  });

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    const confirmDelete = window.confirm("Delete this ?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/todos/${id}/`);
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
