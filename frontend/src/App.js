import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCheckbox,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
} from "mdb-react-ui-kit";
import "./index.css";
import UserAuthTabs from "./components/UserAuthTabs";
import Cookies from "js-cookie";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const token = Cookies.get("token");
  const [user, setUser] = useState("");

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update time every second
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [token]);

  const fetchTasks = async () => {
    if (!token) {
      console.error("No token found, user might not be logged in.");
      // Handle token absence, e.g., redirect to login page
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized error, e.g., redirect to login page
          console.error("Unauthorized! Redirecting to login.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      setTasks(data.tasks);
      setUser(data.username);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Handle fetch error, e.g., show user-friendly message
    }
  };

  const handleAddTask = async () => {
    if (!token) {
      console.error("No token found, user might not be logged in.");
      // Handle token absence, e.g., redirect to login page
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ title: newTask }),
      });
      const data = await response.json();
      setTasks([data, ...tasks]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleRemoveTask = async (id) => {
    if (!token) {
      console.error("No token found, user might not be logged in.");
      // Handle token absence, e.g., redirect to login page
      return;
    }
    try {
      await fetch(`http://127.0.0.1:8000/api/tasks/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error removing task:", error);
    }
  };

  const handleUpdateTask = async (id, completed) => {
    if (!token) {
      console.error("No token found, user might not be logged in.");
      // Handle token absence, e.g., redirect to login page
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tasks/update/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ completed: !completed }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: data.completed } : task
          )
        );
      }
    } catch (error) {
      console.log("Error Updating task:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auth/logout/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        setUser(null);
        Cookies.remove("token");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };

  if (!token) {
    return <UserAuthTabs />;
  }

  return (
    <section
      className="vh-100 gradient-custom"
      style={{ backgroundColor: "#121212" }}
    >
      <MDBContainer className="py-5 h-100">
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol xl="10">
            <MDBCard
              style={{
                borderRadius: "15px",
                backgroundColor: "#1e1e1e",
                color: "#ffffff",
              }}
            >
              <MDBCardHeader
                className="d-flex justify-content-between align-items-center m-2"
                style={{ backgroundColor: "#2c2c2c", color: "#ffffff" }}
              >
                <p className="mb-0" style={{ fontSize: "large" }}>
                  Welcome, <span style={{ fontWeight: "bold" }}>{user}</span>
                </p>
                <MDBBtn color="danger" size="sm" onClick={handleLogout}>
                  Logout
                </MDBBtn>
              </MDBCardHeader>
              <MDBCardBody className="p-5">
                <h4 className="mb-4" style={{ color: "lightgray" }}>
                  {formatDate(currentDateTime)}
                </h4>
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <MDBInput
                    label="What do you need to do today?"
                    id="textAreaExample"
                    wrapperClass="flex-fill"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    style={{ backgroundColor: "#333333", color: "#ffffff" }}
                  />
                  <MDBBtn
                    type="submit"
                    noRipple
                    size="md"
                    className="ms-2"
                    onClick={handleAddTask}
                  >
                    Add
                  </MDBBtn>
                </div>
                <MDBListGroup className="mb-0">
                  {tasks.map((task) => (
                    <MDBListGroupItem
                      key={task.id}
                      className="d-flex justify-content-between align-items-center border-start-0 
                      border-top-0 border-end-0 border-bottom rounded-0 mb-3"
                      style={{ backgroundColor: "#2c2c2c", color: "#ffffff" }}
                    >
                      <div className="d-flex align-items-center m-2">
                        <MDBCheckbox
                          name="flexCheck"
                          value=""
                          id={`flexCheck${task.id}`}
                          className="me-3"
                          defaultChecked={task.completed}
                          onClick={() =>
                            handleUpdateTask(task.id, task.completed)
                          }
                          style={{ backgroundColor: "#2c2c2c" }}
                        />
                        {task.completed ? (
                          <s style={{ color: "gray" }}>{task.title}</s>
                        ) : (
                          task.title
                        )}
                      </div>

                      <MDBIcon
                        fas
                        icon="times"
                        color="danger"
                        onClick={() => handleRemoveTask(task.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
