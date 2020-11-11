import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";
import "./css/Home.css";
import Explore from "./Explore";
import Header from "./Header";
import ImageUpload from "./ImageUpload";
import Posts from "./Posts";
import SignIn from "./SignIn";

function Home() {
  const [{ user }, dispatch] = useStateValue();
  const [following, setFollowing] = useState([]);

  // useEffect(() => {
  //   const getMultiple = () => {
  //     const postsRef = db
  //       .collection("users")
  //       .doc(user?.uid)
  //       .collection("following")
  //       .onSnapshot((snaphot) => {
  //         console.log(snaphot.docs);
  //         setFollowing(
  //           snaphot.docs.map((doc) => ({
  //             id: doc.id,
  //             post: doc.data(),
  //           }))
  //         );
  //       });
  //     if (following.length > 0) {
  //       console.log(following);
  //       dispatch({
  //         type: "SET_FOLLOWING",
  //         following: following,
  //       });
  //     }
  //   };
  // }, []);

  return (
    <div className="home">
      {/* Header */}
      {/* Content 
            Stories
            Posts 
      */}
      {/* Upload */}
      {/* {console.log(user)} */}
      {!user ? (
        <SignIn />
      ) : (
        <>
          <Header />
          <Posts />
        </>
      )}
      {/* <SignIn /> */}
    </div>
  );
}

export default Home;
