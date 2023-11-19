import React, { useEffect, useState, useContext } from "react";
import projectContext from "../context/project/projectContext";
import { useParams, useNavigate } from "react-router-dom";

const CreateTicket = (props) => {
  let navigate = useNavigate();
  const context = useContext(projectContext);
  const { users, fetchUsers, userIdToName } = context;
  const params = useParams();
  const [projectId] = useState(params.projectId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");
  const [userOfThisProject, setUserOfThisProject] = useState([]);
  const [createdBy, setCreatedBy] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(ticketType, ticketStatus);
    const response = await fetch(
      "https://protool-backend-deployment.onrender.com/api/project/create-ticket",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          projectId,
          title,
          description,
          createdBy,
          assignedTo,
          ticketType,
          ticketStatus,
        }),
      }
    );
    const json = await response.json();
    console.log(json);
    navigate(`/project/${projectId}`);
    props.showAlert("Ticket Created Successfully", "success");
    //   if (json.success){
    //       navigate("/home");
    //       props.showAlert("Project Created Successfully", "success")
    //   }
    //   else{
    //       props.showAlert("Invalid Credentials", "danger")
    //   }
  };

  const fetchProject = async () => {
    const response = await fetch(
      `https://protool-backend-deployment.onrender.com/api/project/get-project/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const proj = await response.json();

    let userAssociatedWithProject = [];
    userAssociatedWithProject.push(proj.createdBy);
    for (let index = 0; index < proj.admin.length; index++) {
      if (!userAssociatedWithProject.includes(proj.admin[index]))
        userAssociatedWithProject.push(proj.admin[index]);
    }
    for (let index = 0; index < proj.developers.length; index++) {
      if (!userAssociatedWithProject.includes(proj.developers[index]))
        userAssociatedWithProject.push(proj.developers[index]);
    }
    setUserOfThisProject(userAssociatedWithProject);
    console.log(userAssociatedWithProject);
    setCreatedBy(userAssociatedWithProject[0]);
    setAssignedTo(userAssociatedWithProject[0]);
    setTicketStatus("To Do");
    setTicketType("Task");
  };

  useEffect(() => {
    fetchProject();
    if (users.length === 0) fetchUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="card">
      <div className="card-header inline">
        <h5 className="float-start">CREATE TICKET</h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleFormSubmit}>
          <div className="border border-1 rounded m-3 p-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="border border-1 rounded m-3 p-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Description of Ticket
            </label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="border border-1 rounded m-3 p-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Ticket Type
            </label>
            <select
              defaultValue={"Task"}
              className="form-select"
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
              name="ticketType"
            >
              <option value="Task">TASK</option>
              <option value="Story">STORY</option>
              <option value="Bug">BUG</option>
              <option value="New Feature">NEW FEATURE</option>
              <option value="Improvement">IMPROVEMENT</option>
              <option value="Spike">SPIKE</option>
            </select>
          </div>

          <div className="border border-1 rounded m-3 p-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Ticket Status
            </label>
            <select
              defaultValue={"To Do"}
              className="form-select"
              value={ticketStatus}
              onChange={(e) => setTicketStatus(e.target.value)}
              name="ticketStatus"
            >
              <option value="To Do">TO DO</option>
              <option value="In Progress">IN PROGRESS</option>
              <option value="QA">QA</option>
              <option value="Completed">COMPLETED</option>
            </select>
          </div>

          <div className="row">
            <div className="col border border-1 rounded m-3 p-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Created By
              </label>
              <select
                name="createdBy"
                className="form-select"
                onChange={(e) => setCreatedBy(e.target.value)}
              >
                {Object.values(userOfThisProject).map((data, index) => {
                  return (
                    <option key={index} value={data}>
                      {userIdToName(data)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col border border-1 rounded m-3 p-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Assigned To
              </label>
              <select
                name="assignedTo"
                className="form-select"
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                {Object.values(userOfThisProject).map((data, index) => {
                  return (
                    <option key={index} value={data}>
                      {userIdToName(data)}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            CREATE
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
