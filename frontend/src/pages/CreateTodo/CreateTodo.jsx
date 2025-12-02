import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./CreateTodo.css";
import axios from "axios";

const CreateTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleAutoExpand = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handlSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/todos/", {
        title,
        description,
        completed,
      });

      setTitle("");
      setDescription("");
      setCompleted(false);

      alert("TODO Created Successfully!");
    } catch (error) {
      console.error(
        "Error creating todo:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to create TODO");
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

          <div className="form-row">
            <label htmlFor="completed">Completed</label>
            <input
              type="checkbox"
              name="completed"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
          </div>

          <button type="submit" id="create-btn">Save Todo</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTodo;
