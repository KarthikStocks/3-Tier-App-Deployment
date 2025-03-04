import "./App.css";
import Dashboard from "./components/Dashboard";
import EditProfile from "./components/EditProfile";
import Leaves from "./components/Leaves";
import Login from "./components/Login";
import Requests from "./components/Requests";
import SignUp from "./components/SignUp";
import Tasks from "./components/Tasks";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/tasks" element={<Tasks />}></Route>
          <Route path="/leaves" element={<Leaves />}></Route>
          <Route path="/requests" element={<Requests />}></Route>
          <Route
            path="/editProfile"
            element={<EditProfile></EditProfile>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
