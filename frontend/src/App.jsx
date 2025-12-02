import React from "react";
import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication/Authentication";
import CreateTodo from "./pages/CreateTodo/CreateTodo";
import ViewTodo from "./pages/ViewTodo/ViewTodo";
import TodoDetails from "./pages/TodoDetails/TodoDetails";

function App() {
  return (
    <Routes>
      <Route path="/create" element={<CreateTodo />} />
      <Route path="/view" element={<ViewTodo />} />
      <Route path="/" element={<Authentication />} />
      <Route path="/todo/:id" element={<TodoDetails />} />
    </Routes>
  );
}

export default App;
