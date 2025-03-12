import React from "react";
import { useSelector } from "react-redux";
import TopNavigation from "./TopNavigation";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  let navigate = useNavigate();

  let storeObj = useSelector((store) => {
    return store;
  });

  let onDeleteProfile = async () => {
    let url = `/deleteProfile?email=${storeObj.loginDetails.email}`;

    let reqOptions = {
      method: "DELETE",
    };

    let JSONData = await fetch(url, reqOptions);

    let JSOData = await JSONData.json();
    alert(JSOData.msg);

    if (JSOData.status == "success") navigate("/");
  };

  return (
    <div>
      <TopNavigation></TopNavigation>
      <h1>Dashboard</h1>
      <p>
        <code>'npm install jsonwebtoken'</code> - jsonwebtoken is a Node.js
        library that implements JSON Web Tokens (JWTs). It allows generating,
        signing, and verifying tokens that securely transmit information between
        parties. JWTs are compact, URL-safe, and widely used in web applications
        for authentication and authorization. They are self-contained, meaning
        they can store user data (like IDs or roles) and are cryptographically
        signed to ensure integrity.
      </p>
      <h2>First Name: {storeObj.loginDetails.firstName}</h2>
      <h2>Last Name: {storeObj.loginDetails.lastName}</h2>
      <button onClick={onDeleteProfile}>Delete Profile</button>
      <img src={`/${storeObj.loginDetails.profilePic}`}></img>
    </div>
  );
}

export default Dashboard;
