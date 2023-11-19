import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import projectContext from "../context/project/projectContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TicketItem from "./TicketItem";
import KanbanView from "./KanbanView";

const ProjectDetail = (props) => {
  let navigate = useNavigate();
  const context = useContext(projectContext);
  const { users, fetchUsers, userIdToName } = context;
  const params = useParams();
  const [projectId] = useState(params.projectId);
  const [project, setProject] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [deleteConfirmString, setDeleteConfirmString] = useState("");

  const fetchTickets = async () => {
    const responce = await fetch(
      `https://protool-backend-deployment.onrender.com/api/project/get-all-tickets/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const tick = await responce.json();
    setTickets(tick);
    console.log("Ticket Fetched");
  };

  const fetchProject = async () => {
    const responce = await fetch(
      `https://protool-backend-deployment.onrender.com/api/project/get-project/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const proj = await responce.json();

    // changing the date format
    const date = new Date(proj.date);
    proj.date = `Created on: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    setProject(proj);
  };

  const fetchCurrentUser = async () => {
    const responce = await fetch(
      `https://protool-backend-deployment.onrender.com/api/auth/getuser`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await responce.json();
    setCurrentUser(json._id);
  };

  const handleOnClickDeleteProject = async () => {
    const responce = await fetch(
      `https://protool-backend-deployment.onrender.com/api/project/delete-project`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ projectId }),
      }
    );
    await responce.json();
    props.showAlert(
      "Project and relevant Tickets Deleted Successfully",
      "success"
    );
    navigate(`/projects`);
  };

  const handleOnClickModifyProject = () => {
    navigate(`/modify-project/${project._id}`);
  };

  const handleOnClickGoToSprint = () => {
    navigate(`/project/${project._id}/all-sprint`);
  };

  const handleOnClickGoToKanban = () => {
    navigate(`/project/${project._id}/kanban-view`);
  };

  const handleOnClickNewTicket = () => {
    navigate(`/project/${project._id}/create-ticket`);
  };

  useEffect(() => {
    //console.log(users.length);
    fetchCurrentUser();
    if (users.length === 0) fetchUsers();
    fetchProject();
    fetchTickets();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      {project.length === 0 ? (
        <div className="container">NOT ALLOWED</div>
      ) : (
        <>
          <div className="card">
            <div className="card-header inline">
              <h5 className="float-start">{project.projectName}</h5>
              <button
                disabled={
                  project.createdBy !== currentUser &&
                  !project.admin.includes(currentUser)
                }
                className="btn btn-primary float-end m-1"
                onClick={handleOnClickModifyProject}
              >
                MODIFY PROJECT
              </button>
              <button
                className="btn btn-primary float-end m-1"
                onClick={handleOnClickGoToSprint}
              >
                GO TO SPRINT
              </button>
              <button
                className="btn btn-primary float-end m-1"
                onClick={handleOnClickGoToKanban}
              >
                KANBAN VIEW
              </button>
            </div>

            <div className="card-body">
              <div className="container border border-1 rounded p-3">
                <div className="card-text">
                  <h5 className="card-title">Description</h5>
                  {project.description}
                </div>
              </div>

              <div className="container border border-1 rounded p-3">
                <h5 className="card-title">Created By</h5>
                <div className="card-text">
                  <span className="badge text-bg-dark mx-1">
                    {userIdToName(project.createdBy)}
                  </span>
                </div>
              </div>

              <div className="container border border-1 rounded p-3">
                <h5 className="card-title">Admin</h5>
                <div className="card-text">
                  {project.admin.map((proj, index) => {
                    return (
                      <span className="badge text-bg-dark mx-1" key={proj}>
                        {userIdToName(proj)}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="container border border-1 rounded p-3">
                <h5 className="card-title">Developers</h5>
                <div className="card-text">
                  {project.developers.map((proj, index) => {
                    return (
                      <span className="badge text-bg-dark mx-1" key={proj}>
                        {userIdToName(proj)}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="container border border-1 rounded p-3">
                <h5 className="card-title">Tickets</h5>
                {tickets.length === 0 ? (
                  <div>
                    <p>Tickets does not exist</p>
                  </div>
                ) : (
                  tickets.map((tick, index) => {
                    return (
                      <div>
                        <Link key={tick._id} to={`/ticket/${tick._id}`}>
                          {" "}
                          <TicketItem ticket={tick} />{" "}
                        </Link>
                      </div>
                    );
                  })
                )}
                <button
                  className="btn btn-primary mx-3 my-1"
                  onClick={handleOnClickNewTicket}
                >
                  New Ticket
                </button>
              </div>
            </div>

            <div className="card-footer text-body-secondary">
              {project.date}
              <button
                disabled={project.createdBy !== currentUser}
                type="button"
                className="btn btn-danger float-end m-1"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                DELETE PROJECT
              </button>

              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        DELETE PROJECT
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>

                    <div className="modal-body my-1">
                      <div>Confirm by writing project name given below</div>
                      <div>
                        <b style={{ "user-select": "none" }}>
                          {project.projectName}
                        </b>
                      </div>
                      <input
                        type="text"
                        className="form-control my-3"
                        value={deleteConfirmString}
                        onChange={(e) => {
                          setDeleteConfirmString(e.target.value);
                          console.log(project.projectName, deleteConfirmString);
                        }}
                      />
                    </div>

                    <div className="modal-footer my-1">
                      <button
                        disabled={project.projectName !== deleteConfirmString}
                        data-bs-dismiss="modal"
                        onClick={handleOnClickDeleteProject}
                        type="button"
                        className="btn btn-danger"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetail;
