import React, { useState } from "react";
import { db, auth } from "../firebase";
import firebase from "firebase";
import { useStateValue } from "../StateProvider";
import "./css/EditProfile.css";

function EditProfile() {
  const [{ userDetails, user }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);
  const [initials, setInitials] = useState("U");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userNameUpdated, setUserNameUpdated] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [webSite, setWebSite] = useState("");
  const [bio, setBio] = useState("");
  const [displayPic, setDisplayPic] = useState("");
  const [gender, setGender] = useState("");
  const [userNameChanged, setUserNameChanged] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [updateEUA, setUpdateEUA] = useState(false);
  const [updateEA, setUpdateEA] = useState(false);
  const [updateUA, setUpdateUA] = useState(false);

  if (loading && userDetails) {
    setInitials(userDetails.name.charAt(0));
    setName(userDetails.name);
    setUserName(userDetails.userName);
    setUserNameUpdated(userDetails.userName);
    setEmail(userDetails.email);
    if (userDetails.phoneNumber) {
      setPhoneNumber(userDetails.phoneNumber);
    }
    if (userDetails.webSite) setWebSite(userDetails.webSite);
    if (userDetails.bio) setBio(userDetails.bio);
    if (userDetails.displayPic !== "") setDisplayPic(userDetails.displayPic);
    if (userDetails.gender) setGender(userDetails.gender);

    setLoading(false);
  }

  const handleName = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };
  const handleUserName = (e) => {
    e.preventDefault();
    var illegalChars = /\W/;
    if (illegalChars.test(e.target.value)) {
      alert(
        "Please enter valid Username. Use only numbers, alphabets and underscores"
      );
    } else {
      var val = e.target.value;
      db.collection("users")
        .where("userName", "==", val)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            setUserNameUpdated(val);
            // Email Username Allfields
            // setUpdateEUA(true);
            setUserNameChanged(true);
          } else {
            alert("Username already exists");
          }
        });
    }
  };

  // const handleEmail = (e) => {
  //   e.preventDefault();
  //   setEmail(e.target.value);
  //   db.collection("users")
  //     .where("email", "==", e.target.value)
  //     .get()
  //     .then((querySnapshot) => {
  //       if (querySnapshot.empty) {
  //         // Email Username Allfields
  //         // setUpdateEUA(true);
  //         setEmailChanged(true);
  //       } else {
  //         alert("Email Id already registered with another account");
  //       }
  //     });
  // };
  const handlePhoneNumber = (e) => {
    e.preventDefault();
    setPhoneNumber(e.target.value);
  };
  const handleWebsite = (e) => {
    e.preventDefault();
    setWebSite(e.target.value);
  };
  const handleBio = (e) => {
    e.preventDefault();
    setBio(e.target.value);
  };
  const handleGender = (e) => {
    e.preventDefault();
    setGender(e.target.value);
  };

  const handleSubmit = async (e) => {
    const userD = db.collection("users").doc(user.uid);
    e.preventDefault();
    // if (emailChanged && userNameChanged) {

    //   const updating = await userD.set(
    //     {
    //       name: name,
    //       userName: userNameUpdated,
    //       email: email,
    //       webSite: webSite,
    //       bio: bio,
    //       phoneNumber: phoneNumber,
    //       private: false,
    //       displayPic: displayPic,
    //       lastUpdatedEmail: firebase.firestore.FieldValue.serverTimestamp(),
    //       lastUpdatedUserName: firebase.firestore.FieldValue.serverTimestamp(),
    //     },
    //     { merge: true }
    //   );
    // }

    // if (emailChanged && !userNameChanged) {
    //   const updating = await userD.set(
    //     {
    //       name: name,
    //       email: email,
    //       webSite: webSite,
    //       bio: bio,
    //       phoneNumber: phoneNumber,
    //       private: false,
    //       displayPic: displayPic,
    //       lastUpdatedEmail: firebase.firestore.FieldValue.serverTimestamp(),
    //     },
    //     { merge: true }
    //   );
    // }

    if (
      userNameChanged
      // && !emailChanged
    ) {
      const updating = await userD.set(
        {
          name: name,
          userName: userNameUpdated,
          webSite: webSite,
          bio: bio,
          phoneNumber: phoneNumber,
          private: false,
          displayPic: displayPic,
          gender: gender,
          lastUpdatedUserName: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    if (
      !userNameChanged
      //  && !emailChanged
    ) {
      // user.updateEmail().t;
      // console.log("------");
      // var newPassword = "12345678";
      // auth.currentUser.updatePassword(newPassword);
      const updating = await userD.set(
        {
          name: name,
          webSite: webSite,
          bio: bio,
          phoneNumber: phoneNumber,
          private: false,
          displayPic: displayPic,
          gender: gender,
        },
        { merge: true }
      );
    }

    // if (updateEUA) {
    //   const updating = await userD.set(
    //     {
    //       name: name,
    //       userName: userNameUpdated,
    //       email: email,
    //       webSite: webSite,
    //       bio: bio,
    //       phoneNumber: phoneNumber,
    //       private: false,
    //       displayPic: displayPic,
    //       lastUpdatedEmail: firebase.firestore.FieldValue.serverTimestamp(),
    //       lastUpdatedUserName: firebase.firestore.FieldValue.serverTimestamp(),
    //     },
    //     { merge: true }
    //   );
    // }

    // if (updateEA) {
    //   const updating = await userD.set(
    //     {
    //       name: name,
    //       email: email,
    //       webSite: webSite,
    //       bio: bio,
    //       phoneNumber: phoneNumber,
    //       private: false,
    //       displayPic: displayPic,
    //       lastUpdatedEmail: firebase.firestore.FieldValue.serverTimestamp(),
    //     },
    //     { merge: true }
    //   );
    // }
    user.reload();
  };

  return (
    <div className="editProfile">
      <div className="editProfile__header">
        {displayPic === "" ? (
          <div className="header__imageDiv">
            <img
              src="https://media-exp1.licdn.com/dms/image/C4E03AQGTaSTFth4t7Q/profile-displayphoto-shrink_400_400/0?e=1606953600&v=beta&t=1Ue8tmg1RFx09vxsBetOqWiyxYRPNriqwL71y8xJFpQ"
              alt="abc"
              className="header__image"
            />
          </div>
        ) : (
          <div className="header__imageDiv">{initials}</div>
        )}
        <div className="header__details">
          <p>{userName}</p>
          <p>Change Profile Photo</p>
        </div>
      </div>
      <form className="profile__field">
        <table className="fieldTable">
          <tr>
            <td className="fieldName">Name</td>
            <td>
              <input
                type="text"
                maxLength="30"
                className="inputField"
                value={name}
                onChange={handleName}
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <p className="fieldText">
                Help people discover your account by using the name you're known
                by: either your full name, nickname, or business name.
              </p>
            </td>
          </tr>
          <tr>
            <td className="fieldName">UserName</td>
            <td>
              <input
                type="text"
                maxLength="30"
                className="inputField"
                value={userNameUpdated}
                onChange={handleUserName}
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <p className="fieldText">
                In most cases, you'll be able to change your username back to
                {userName} for another 14 days.
              </p>
            </td>
          </tr>

          <tr>
            <td className="fieldName">Website</td>
            <td>
              <input
                type="text"
                className="inputField"
                value={webSite}
                placeholder="Website"
                onChange={handleWebsite}
              />
            </td>
          </tr>
          <tr>
            <td className="fieldName">Bio</td>
            <td>
              <textarea
                rows="2"
                colos="35"
                className="inputField"
                value={bio}
                placeholder="BIO"
                onChange={handleBio}
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <p className="fieldPersonalInfo">Personal Information</p>
              <p className="fieldText">
                Provide your personal information, even if the account is used
                for a business, a pet or something else. This won't be a part of
                your public profile.
              </p>
            </td>
          </tr>
          <tr>
            <td className="fieldName">Email</td>
            <td>
              <input
                type="email"
                className="inputField"
                value={email}
                placeholder="Email"
                // onChange={handleEmail}
              />
            </td>
          </tr>
          <tr>
            <td className="fieldName">Phone Number</td>
            <td>
              <input
                type="number"
                maxLength="10"
                className="inputField"
                value={phoneNumber}
                placeholder="Phone Number"
                onChange={handlePhoneNumber}
              />
            </td>
          </tr>
          <tr>
            <td className="fieldName">Gender</td>
            <td>
              <select
                name="gender"
                className="inputField"
                value={gender}
                onChange={handleGender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer Not to say">Prefer Not to say</option>
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="submitButton">
              <button onClick={handleSubmit}>Submit</button>
            </td>
          </tr>
        </table>
      </form>
    </div>
  );
}

export default EditProfile;
