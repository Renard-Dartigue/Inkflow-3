import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { QUERY_USER, QUERY_ME } from "../utils/queries";

import Auth from "../utils/auth";

import React, { useRef, useEffect, useState } from "react";

function CanvasComponent() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    setContext(canvas.getContext("2d"));
    const ctx =  (canvas.getContext("2d"));
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const startDrawing = (e) => {
      setIsDrawing(true);
      draw(e);
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      context.beginPath();
      
    };

    const draw = (e) => {
      if (!isDrawing) return;
      context.lineWidth = 5;
      context.lineCap = "round";
      context.strokeStyle = "black";

      context.lineTo(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop
      );
      context.stroke();
      context.beginPath();
      context.moveTo(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop
      );
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.addEventListener('mouseout', stopDrawing);
    };
  }, [isDrawing, context]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600}></canvas>
    </div>
  );
}

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  if (
    Auth.loggedIn() &&
    /* Run the getProfile() method to get access to the unencrypted token value in order to retrieve the user's username, and compare it to the userParam variable */
    Auth.getProfile().authenticatedPerson.username === userParam
  ) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5">
          Viewing {userParam ? `${user.username}'s` : "your"} Canvas.
        </h2>
      </div>
      {/* {!userParam && (
          <div
            className="col-12 col-md-10 mb-3 p-3"
            style={{ }}
          >
          </div>
        )} */}
      <div className="container">
        <CanvasComponent />
        <html lang="en" dir="ltr">
          <head>
            <meta charSet="utf-8" />
            <title>Inkflow Canvas</title>
            <link rel="stylesheet" href="./style.css" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </head>
          <body>
            <input type="file" id="image-upload" accept="image/*" />

            <div className="container">
              <section className="tools-board">
                <div className="row">
                  <label className="title">Shapes</label>
                  <ul className="options">
                    <li className="option tool" id="rectangle">
                      <img src="icons/rectangle.svg" alt="" />
                      <span>Rectangle</span>
                    </li>
                    <li className="option tool" id="circle">
                      <img src="icons/circle.svg" alt="" />
                      <span>Circle</span>
                    </li>
                    <li className="option tool" id="triangle">
                      <img src="icons/triangle.svg" alt="" />
                      <span>Triangle</span>
                    </li>
                    <li className="option">
                      <input type="checkbox" id="fill-color" />
                      <label htmlFor="fill-color">Fill color</label>
                    </li>
                  </ul>
                </div>
                <div className="row">
                  <label className="title">Options</label>
                  <ul className="options">
                    <li className="option active tool" id="brush">
                      <img src="icons/brush.svg" alt="" />
                      <span>Brush</span>
                    </li>
                    <li className="option tool" id="eraser">
                      <img src="icons/eraser.svg" alt="" />
                      <span>Eraser</span>
                    </li>
                    <li className="option">
                      <input
                        type="range"
                        id="size-slider"
                        min="1"
                        max="30"
                        defaultValue="5"
                      />
                    </li>
                  </ul>
                </div>
                <div className="row colors">
                  <label className="title">Colors</label>
                  <ul className="options">
                    <li className="option"></li>
                    <li className="option selected"></li>
                    <li className="option"></li>
                    <li className="option"></li>
                    <li className="option">
                      <input
                        type="color"
                        id="color-picker"
                        defaultValue="#4A98F7"
                      />
                    </li>
                  </ul>
                </div>
                <div className="row buttons">
                  <button className="clear-canvas">Clear Canvas</button>
                  <button className="save-img">Save As Image</button>
                </div>
              </section>
              <section className="drawing-board">
                <canvas></canvas>
              </section>
            </div>
            <script src="../bitmap.js" defer></script>
          </body>
        </html>
      </div>
    </div>
  );
};

export default Profile;
