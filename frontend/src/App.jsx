import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import mystore from "./redux/store";

// Auth Screens
import Login from "./Screens/Login";
import ForgetPassword from "./Screens/ForgetPassword";
import UpdatePassword from "./Screens/UpdatePassword";

// Dashboards
import StudentHome from "./Screens/Student/Home";
import FacultyHome from "./Screens/Faculty/Home";
import AdminHome from "./Screens/Admin/Home";

const App = () => {
  return (
    <Provider store={mystore}>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route
            path="/:type/update-password/:resetId"
            element={<UpdatePassword />}
          />

          {/* Dashboards */}
          <Route path="/student" element={<StudentHome />} />
          <Route path="/faculty" element={<FacultyHome />} />
          <Route path="/admin" element={<AdminHome />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
