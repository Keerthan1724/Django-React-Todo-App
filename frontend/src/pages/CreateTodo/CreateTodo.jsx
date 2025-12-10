import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./CreateTodo.css";
import api from "../../utils/api";
import { notify } from "../../utils/toastHelper";

const CreateTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  const APIUrl = import.meta.env.VITE_API_URL;

  const handleAutoExpand = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handlSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) {
      notify("You are not authenticated. Please login first.", "error");
      return;
    }

    try {
      const response = await api.post(
        `${APIUrl}/api/todos/`,
        {
          title,
          description,
          completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setDescription("");
      setCompleted(false);

      notify("TODO Created Successfully!", "success");
    } catch (error) {
      console.error(
        "Error creating todo:",
        error.response ? error.response.data : error.message
      );
      notify("Failed to create TODO", "error");
    }
  };

  return (
    <div className="create-todo">
      <Navbar />

      <div className="main-create-todo-section">
        <h4>Create Your Todo</h4>

        <form
          action="#"
          method="post"
          className="todo-form"
          onSubmit={handlSubmit}
        >
          <div className="form-row textarea-row">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Enter Your Todo Title...."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row textarea-row">
            <label htmlFor="decription">Description</label>
            <textarea
              name="description"
              id="description"
              onInput={handleAutoExpand}
              placeholder="Enter Your Todo Description...."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-row ch">
            <label htmlFor="completed">Completed</label>
            <input
              type="checkbox"
              name="completed"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
          </div>

          <button type="submit" id="create-btn">
            Save Todo
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTodo;
