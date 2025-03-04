import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

function SignUp() {
  let firstNameInputRef = useRef();
  let lastNameInputRef = useRef();
  let ageInputRef = useRef();
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let mobileNoInputRef = useRef();
  let profilePicInputRef = useRef();

  let [selectedPicPath, setSelectedPicPath] = useState("./images/noPic.jpg");

  let onSignUpUsingJSON = async () => {
    let dataToSend = {
      firstName: firstNameInputRef.current.value,
      lastName: lastNameInputRef.current.value,
      age: ageInputRef.current.value,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
      mobileNo: mobileNoInputRef.current.value,
      profilePic: profilePicInputRef.current.value,
    };

    console.log(dataToSend);

    let dataToSendJSON = JSON.stringify(dataToSend);
    // console.log(dataToSend);
    console.log(dataToSendJSON);

    let myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");

    let reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: dataToSendJSON,
    };

    let JSONData = await fetch("http://localhost:4567/signUp", reqOptions);

    let JSOData = await JSONData.json();
    console.log(JSOData);
    alert(JSOData.msg);
  };

  let onSignUpUsingURLE = async () => {
    let myHeaders = new Headers();
    myHeaders.append("content-type", "application/x-www-form-urlencoded");

    let dataToSend = new URLSearchParams();
    dataToSend.append("firstName", firstNameInputRef.current.value);
    dataToSend.append("lastName", lastNameInputRef.current.value);
    dataToSend.append("age", ageInputRef.current.value);
    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);
    dataToSend.append("mobileNo", mobileNoInputRef.current.value);

    let reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: dataToSend,
    };

    let JSONData = await fetch("http://localhost:4567/signup", reqOptions);

    let JSOData = await JSONData.json();
    console.log(JSOData);
    alert(JSOData.msg);
  };

  let onSignUpUsingFormData = async () => {
    // let myHeaders = new Headers();
    // myHeaders.append("content-type", "application/x-www-form-urlencoded");

    let dataToSend = new FormData();
    dataToSend.append("firstName", firstNameInputRef.current.value);
    dataToSend.append("lastName", lastNameInputRef.current.value);
    dataToSend.append("age", ageInputRef.current.value);
    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);
    dataToSend.append("mobileNo", mobileNoInputRef.current.value);

    for (let i = 0; i < profilePicInputRef.current.files.length; i++) {
      dataToSend.append("profilePic", profilePicInputRef.current.files[i]);
    }

    let reqOptions = {
      method: "POST",
      // headers: myHeaders,
      body: dataToSend,
    };

    let JSONData = await fetch("http://localhost:4567/signup", reqOptions);

    let JSOData = await JSONData.json();
    console.log(JSOData);
    alert(JSOData.msg);
  };

  return (
    <div>
      <form>
        <div>
          <label>First Name</label>
          <input ref={firstNameInputRef}></input>
        </div>
        <div>
          <label>Last Name</label>
          <input ref={lastNameInputRef}></input>
        </div>
        <div>
          <label>Age</label>
          <input ref={ageInputRef}></input>
        </div>
        <div>
          <label>Email</label>
          <input ref={emailInputRef}></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>
        <div>
          <label>Mobile No.</label>
          <input ref={mobileNoInputRef}></input>
        </div>
        <div>
          <label>Profile Pic</label>
          <input
            ref={profilePicInputRef}
            type="file"
            // multiple
            onChange={(ele) => {
              console.log(ele);
              let selectedURLPicPath = URL.createObjectURL(ele.target.files[0]);

              console.log(selectedPicPath);

              setSelectedPicPath(selectedURLPicPath);
            }}
          ></input>
          <br></br>
          <img src={selectedPicPath} className="profilePicPreview"></img>
        </div>
        <div>
          {/* <button
            type="button"
            onClick={() => {
              onSignUpUsingJSON();
            }}
          >
            Sign up - JSON
          </button>
          <button
            type="button"
            onClick={() => {
              onSignUpUsingJSON();
            }}
          >
            Sign up - URLE
          </button> */}
          <button
            type="button"
            onClick={() => {
              onSignUpUsingFormData();
            }}
          >
            Sign up
          </button>
        </div>
      </form>
      <div>
        <Link to="/">Login</Link>
      </div>
    </div>
  );
}

export default SignUp;
