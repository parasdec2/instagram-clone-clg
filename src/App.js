import React, { useEffect, useState } from "react";
import "./App.css";
import { db, auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import Home from "./Components/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import User from "./Components/User";
import Explore from "./Components/Explore";
import ImageUpload from "./Components/ImageUpload";
import Profile from "./Components/Profile";
import CompletePost from "./Components/CompletePost";
import UserPosts from "./Components/UserPosts";
import SavedPosts from "./Components/SavedPosts";
import AccountEdit from "./Components/AccountEdit";
import EmailVerification from "./Components/EmailVerification";
import PasswordReset from "./Components/PasswordReset";
import DirectMessages from "./DirectMessages/DirectMessages";

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [isVerified, setIsVerified] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      // console.log(authUser);
      if (authUser) {
        setEmail(authUser.email);
        db.collection("users")
          .doc(authUser.uid)
          .get()
          .then((data) => {
            console.log(data.exists);
            if (!data.exists) {
              const username = authUser.email.substring(
                0,
                authUser.email.lastIndexOf(".")
              );
              const userName = username.replace("@", "");
              const userDetails = {
                name: "",
                userName: userName,
                email: authUser.email,
                private: false,
                posts: 0,
                followersList: [],
                followingList: [],
                likedPosts: [],
                followers: 0,
                following: 0,
                displayPic: "",
                webSite: "",
                bio: "",
                phoneNumber: "",
                joined: firebase.firestore.FieldValue.serverTimestamp(),
                lastLoggedIn: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdatedEmail: "",
                lastUpdatedUserName: "",
              };
              db.collection("users").doc(authUser.uid).set(userDetails);
              dispatch({
                type: "SET_USER",
                user: authUser,
                userDetails: userDetails,
              });

              dispatch({
                type: "SET_FOLLOWINGLISTEXISTS",
                followingListExists: false,
              });
            } else {
              dispatch({
                type: "SET_USER",
                user: authUser,
                userDetails: data.data(),
              });
              if (data.data().followingList.length > 0) {
                dispatch({
                  type: "SET_FOLLOWINGLIST",
                  followingList: data.data().followingList,
                });
              }
              if (data.data().followingList.length === 0) {
                dispatch({
                  type: "SET_FOLLOWINGLISTEXISTS",
                  followingListExists: false,
                });
              }
              if (data.data().followersList) {
                dispatch({
                  type: "SET_FOLLOWERSLIST",
                  followersList: data.data().followersList,
                });
              }

              if (data.data().likedPosts) {
                console.log(data.data().likedPosts);
                dispatch({
                  type: "SET_LIKEDPOSTS",
                  likedPosts: data.data().likedPosts,
                });
              }
              db.collection("users")
                .doc(authUser.uid)
                .collection("savedPosts")
                .get()
                .then(function (querySnapshot) {
                  // console.log(querySnapshot);
                  if (!querySnapshot.empty) {
                    var postId = querySnapshot.docs.map((doc) => ({
                      id: doc.id,
                      post: doc.data(),
                    }));

                    postId.sort((a, b) => {
                      const timeA = a.post.saved?.nanoseconds;
                      const timeB = b.post.saved?.nanoseconds;
                      if (timeA > timeB) {
                        return 1;
                      }
                      if (timeA < timeB) {
                        return -1;
                      }
                      return 0;
                    });
                    const postsId = [];
                    postId.map(({ id }) => postsId.push(id));
                    console.log(postsId);
                    dispatch({
                      type: "SET_SAVEDPOSTS",
                      savedPosts: postsId,
                    });
                  }
                });
            }

            // if (data.data().savedPosts) {
            //   dispatch({
            //     type: "SET_SAVEDPOSTS",
            //     savedPosts: data.data().savedPosts,
            //   });
            // }
          });

        console.log("-------------------------");
        db.collection("users").doc(authUser.uid).update({
          lastLoggedIn: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
          userDetails: null,
        });
      }
    });
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/accounts/signin">
          <SignIn />
        </Route>
        <Route path="/accounts/signup">
          <SignUp />
        </Route>
        <Route path="/accounts/edit">
          <Header />
          <AccountEdit />
        </Route>
        <Route path="/accounts/passwors/reset">
          <PasswordReset />
        </Route>
        <Route path="/accounts/emailVerification">
          <Header />
          <EmailVerification email={email} />
        </Route>

        <Route path="/upload/post">
          <Header />
          <ImageUpload />
        </Route>

        {/* <Route path="/d/">
          <DirectMessages />
        </Route> */}

        <Route path="/explore">
          <Header />
          <Explore />
        </Route>

        <Route path="/post/:postId">
          <Header />
          <CompletePost />
        </Route>

        <Route exact path="/:username/saved">
          <Header />
          <Profile />
          <SavedPosts userId={"7v9bdTvImCdoACs9YL9flfmH7q33"} />
        </Route>

        <Route exact path="/:username">
          <Header />
          <Profile />
        </Route>

        {/* Default route should be at the end */}
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
