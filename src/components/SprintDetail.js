import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import projectContext from "../context/project/projectContext";
import TicketItem from "./TicketItem";

const SprintDetail = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [sprintId, setSprintId] = useState(params.sprintId);
  const [sprint, setSprint] = useState([]);
  const context = useContext(projectContext);
  const { users, fetchUsers, userIdToName } = context;

  const fetchSprint = async () => {
    const response = await fetch(
      `https://protool-backend-deployment.onrender.com/api/sprint/${sprintId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();

    let ticketObj = [];
    for (let i = 0; i < json.tickets.length; i++) {
      const element = json.tickets[i];
      const response = await fetch(
        `https://protool-backend-deployment.onrender.com/api/project/get-ticket/${element}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const tick = await response.json();
      ticketObj.push(tick);
    }

    json.tickets = ticketObj;
    setSprint(json);
    console.log(json);
  };

  const date = new Date(sprint.date);
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);

  useEffect(() => {
    if (users.length === 0) fetchUsers();
    fetchSprint();
  }, []);

  const handleOnClickModifySprint = () => {
    navigate(`modify-sprint/${sprintId}`);
  };

  const handleOnClickInactive = async () => {
    const response = await fetch(
      `https://protool-backend-deployment.onrender.com/api/sprint/inactive-sprint/${sprintId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    console.log(json);
    navigate(`/project/${sprint.projectId}`);
  };

  return (
    <div className="container">
      {sprint.length === 0 ? (
        <div className="container">LOADING</div>
      ) : (
        <>
          <div className="card">
            <div className="card-header inline">
              <h5 className="float-start">{sprint.sprintName}</h5>
              <button
                disabled={sprint.status === "Inactive"}
                className="btn btn-primary float-end m-1"
                onClick={handleOnClickModifySprint}
              >
                MODIFY SPRINT
              </button>

              {sprint.status === "Active" ? (
                <button
                  disabled={sprint.status === "Inactive"}
                  className="btn btn-primary float-end m-1"
                  onClick={handleOnClickInactive}
                >
                  INACTIVE
                </button>
              ) : (
                <div></div>
              )}
            </div>

            <div className="card-body">
              <div className="container border border-1 rounded p-3">
                <h5 className="card-title">Created By</h5>
                <div className="card-text">
                  <span className="badge text-bg-dark mx-1">
                    {userIdToName(sprint.createdBy)}
                  </span>
                </div>
              </div>

              <div className="container border border-1 rounded p-3">
                <h5 className="card-title"> FROM</h5>
                <div className="card-text">
                  <span className="badge bg-light text-dark">
                    {" "}
                    {startDate.getDate()}/{startDate.getMonth()}/
                    {startDate.getFullYear()}{" "}
                  </span>
                </div>
              </div>

              <div className="container border border-1 rounded p-3">
                <h5 className="card-title">TO</h5>
                <div className="card-text">
                  <span className="badge bg-light text-dark">
                    {" "}
                    {endDate.getDate()}/{endDate.getMonth()}/
                    {endDate.getFullYear()}{" "}
                  </span>
                </div>
              </div>

              <div className="container border border-1 rounded p-3">
                <h5 className="card-title">Status</h5>
                <div className="card-text">
                  <span className="badge bg-warning text-dark">
                    {sprint.status}
                  </span>
                </div>
              </div>

              <div className="container border border-1 rounded p-3">
                <h5 className="card-title">Tickets</h5>
                <div className="card-text">
                  {sprint.tickets.map((tick) => {
                    return (
                      <div key={tick._id}>
                        <Link to={`/ticket/${tick._id}`}>
                          {" "}
                          <TicketItem ticket={tick} />{" "}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              <small className="text-muted" style={{ float: "right" }}>
                Created on: {date.getDate()}/{date.getMonth()}/
                {date.getFullYear()}
              </small>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SprintDetail;
