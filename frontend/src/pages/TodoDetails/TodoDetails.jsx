import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import edit_todo from "../../assets/edit_todo.svg";
import { useNavigate, useParams } from "react-router-dom";
import "./TodoDetails.css";
import api from "../../utils/api";
import { notify } from "../../utils/toastHelper";

const TodoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await api.get(
          `http://127.0.0.1:8000/api/todos/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTodo(response.data);

        setTitle(response.data.title);
        setDescription(response.data.description);
        setCompleted(response.data.completed);
      } catch (error) {
        console.log(
          "Error:",
          error.response ? error.response.data : error.message
        );
        if (error.response && error.response.status === 401) {
          navigate("/");
        }
      }
    };

    fetchTodos();
  }, [id, navigate]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const updateTodo = { title, description, completed };
      const response = await api.put(
        `http://127.0.0.1:8000/api/todos/${id}/`,
        updateTodo,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTodo(response.data);
      setIsEditing(false);
      notify("TODO updated", "success");
    } catch (error) {
      alert("Update Failed");
      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  if (!todo) return <div>Loading.............</div>;

  return (
    <div className="todo-details">
      <Navbar />

      <div className="todo-details-section">
        <div className="details-header">
          <h4>TODO DETAILS</h4>
          <img
            src={edit_todo}
            className="edit-icon"
            onClick={() => setIsEditing(true)}
            alt=""
          />
        </div>

        {isEditing ? (
          <input
            type="text"
            className="edit-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h2>{todo.title}</h2>
        )}

        {isEditing ? (
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="edit-textarea"
          ></textarea>
        ) : (
          <p className="description-txt">{todo.description}</p>
        )}

        {isEditing ? (
          <div className="completed-row">
            <label htmlFor="">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                disabled={!isEditing}
              />
              Completed
            </label>
          </div>
        ) : (
          <h4 className={`status-text ${completed ? "completed" : "pending"}`}>
            {completed ? "COMPLETED" : "NOT COMPLETED"}
          </h4>
        )}

        {!isEditing ? (
          <div className="footer-row">
            <p>
              {" "}
              {new Date(todo.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}{" "}
              |{" "}
              {new Date(todo.created_at).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        ) : (
          <></>
        )}

        {isEditing && (
          <div className="btns">
            <button className="save-btn" onClick={handleUpdate}>
              Save Changes
            </button>
            <button className="save-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoDetails;
