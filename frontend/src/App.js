import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Blog from "./components/blog/Blog";
import Login from "./components/account/Login";
import Register from "./components/account/Register";
import Profile from "./components/account/Profile";
import ManageBlog from "./components/blog/ManageBlog";
import EditorBlog from "./components/blog/EditorBlog";

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route
                    exact
                    path="/profile"
                    element={<PrivateRoute authed={true} Component={Profile} />}
                ></Route>
                <Route
                    exact
                    path="/manage-blog"
                    element={
                        <PrivateRoute authed={true} Component={ManageBlog} />
                    }
                ></Route>
                <Route
                    exact
                    path="/editor"
                    element={
                        <PrivateRoute authed={true} Component={EditorBlog} />
                    }
                ></Route>
            </Routes>
        </div>
    );
}

function PrivateRoute({ authed, Component }) {
    return authed ? <Component /> : <Navigate to="/login" />;
}

export default App;
