import React from "react";
import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication/Authentication";
import CreateTodo from "./pages/CreateTodo/CreateTodo";
import ViewTodo from "./pages/ViewTodo/ViewTodo";
import TodoDetails from "./pages/TodoDetails/TodoDetails";
import ProtectedRoute from "./ProtectedRoute";
import Account from "./pages/Account/Account";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateTodo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view"
          element={
            <ProtectedRoute>
              <ViewTodo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todo/:id"
          element={
            <ProtectedRoute>
              <TodoDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}      
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"    
      />
    </>
  );
}

export default App;
