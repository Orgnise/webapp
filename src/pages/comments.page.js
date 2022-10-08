import React, { useEffect, useState } from "react";
import socketIO from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = socketIO.connect("http://localhost:4000");

// 👇🏻 This is the component that will be rendered
const Comments = () => {
  const { category, id } = useParams();
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  // 👇🏻 Gets the comments from the server
  useEffect(() => {
    socket.emit("fetchComments", { category, id });
  }, [category, id]);

  //👇🏻 Listens to the comments event
  useEffect(() => {
    socket.on("comments", (data) => setCommentList(data));
  }, []);

  const addComment = (e) => {
    e.preventDefault();
    /*
      sends the comment, the task category, item's id and the userID.
     */
    socket.emit("addComment", {
      comment,
      category,
      id,
      userId: localStorage.getItem("userId"),
      date: new Date().toUTCString(),
    });
    setComment("");
  };

  return (
    <div className="commentContainer">
      <div className="commentInnerContainer">
        <div className="subdomainSidebarContainer">
          <div className="sidebarContainer">
            <div className="boardDetails">
              <div className="heading">Create a Post</div>
              <form className="createPostForm imageForm" onSubmit={addComment}>
                <div className="formField">
                  <div className="uppercaseHeader">
                    <label htmlFor="75b1f80f-9df5-b3c7-b798-acbda2f63ab5">
                      Title
                    </label>
                  </div>
                  <div className="textInput">
                    <div className="inputContainer">
                      <input
                        type="text"
                        placeholder="Short, descriptive title"
                        id="75b1f80f-9df5-b3c7-b798-acbda2f63ab5"
                        name="75b1f80f-9df5-b3c7-b798-acbda2f63ab5"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="formField">
                  <div className="uppercaseHeader">
                    <label htmlFor="9a712603-9c6d-2b4d-efde-dcc0462e6a84">
                      Details
                    </label>
                  </div>
                  <div
                    className="autoResizeTextarea"
                    style={{ height: "88px" }}
                  >
                    <span className="inputContainer">
                      <textarea
                        placeholder="Any additional details…"
                        id="9a712603-9c6d-2b4d-efde-dcc0462e6a84"
                        name="9a712603-9c6d-2b4d-efde-dcc0462e6a84"
                        rows="3"
                      ></textarea>
                    </span>
                  </div>
                </div>
                <div className="formButtons">
                  <button
                    type="submit"
                    className="button buttonStyle cannyButton"
                    style={{ background: "#525df9" }}
                  >
                    <span className="label">Create&nbsp;Post</span>
                    <span className="loader"> </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/** 👇🏻 Displays all the available comments*/}
          <div className="comments__section ">
            <h2>Existing Comments</h2>
            {commentList.map((comment, index) => (
              <div key={index}>
                <p>
                  <span style={{ fontWeight: "bold" }}>{comment.text} </span>by{" "}
                  {comment.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
