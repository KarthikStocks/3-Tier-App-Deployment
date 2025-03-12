import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => {
    // if (localStorage.getItem("email") && localStorage.getItem("password")) {
    //   emailInputRef.current.value = localStorage.getItem("email");
    //   passwordInputRef.current.value = localStorage.getItem("password");
    if (localStorage.getItem("token")) {
      // onLogin();
      // onValidateToken();
    }
  }, []);

  let onValidateToken = async () => {
    // let myHeaders = new Headers();
    // myHeaders.append("content-type", "application/x-www-form-urlencoded");

    let dataToSend = new FormData();

    dataToSend.append("token", localStorage.getItem("token"));

    let reqOptions = {
      method: "POST",
      // headers: myHeaders,
      body: dataToSend,
    };

    let JSONData = await fetch("/validateToken", reqOptions);

    let JSOData = await JSONData.json();
    console.log(JSOData);
    // alert(JSOData.msg);

    if (JSOData.status == "success") {
      // localStorage.setItem("email", emailInputRef.current.value);
      // localStorage.setItem("password", passwordInputRef.current.value);
      // localStorage.setItem("token", JSOData.data.token);
      dispatch({ type: "login", data: JSOData.data });
      navigate("/dashboard");
    } else {
      alert(JSOData.msg);
    }
  };

  let onLogin = async () => {
    // let myHeaders = new Headers();
    // myHeaders.append("content-type", "application/x-www-form-urlencoded");

    let dataToSend = new FormData();

    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);

    let reqOptions = {
      method: "POST",
      // headers: myHeaders,
      body: dataToSend,
    };

    let JSONData = await fetch("/login", reqOptions);

    let JSOData = await JSONData.json();
    console.log(JSOData);
    // alert(JSOData.msg);

    if (JSOData.status == "success") {
      // localStorage.setItem("email", emailInputRef.current.value);
      // localStorage.setItem("password", passwordInputRef.current.value);
      localStorage.setItem("token", JSOData.data.token);
      dispatch({ type: "login", data: JSOData.data });
      navigate("/dashboard");
    } else {
      alert(JSOData.msg);
    }
  };

  return (
    <div>
      <p>
        <code>npm install bcrypt : </code>
        <code>bcrypt</code> is a password-hashing library that securely hashes
        passwords using the <strong>Blowfish</strong> cipher. It includes
        <strong> automatic salting</strong> and is computationally expensive,
        making brute-force attacks difficult.
      </p>
      <form>
        <div>
          <label>Email</label>
          <input ref={emailInputRef}></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              onLogin();
            }}
          >
            Login
          </button>
        </div>
      </form>
      <div>
        <Link to="/signup">SignUp</Link>
      </div>
    </div>
  );
}

export default Login;
