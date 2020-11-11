import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";
import UserPost from "./ExplorePost";

function UserPosts() {
  const { username } = useParams();

  const [{ user, savedPosts, userPosts }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);
  const [noPosts, setNoPosts] = useState(false);
  const [posts, setPosts] = useState([]);

  // console.log("IN USER POSTS");

  if (loading && userPosts?.length > 0) {
    setPosts(userPosts);
    setLoading(false);
  }
  if (loading && userPosts?.length === 0) {
    db.collection("posts")
      .where("username", "==", username)
      .get()
      .then(function (querySnapshot) {
        // console.log("IN SNAPSHOT------------------------");
        if (!querySnapshot.empty) {
          var post = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }));
          // console.log(post);
          post.sort((a, b) => {
            const timeA = a.post.timestamp.nanoseconds;
            const timeB = b.post.timestamp.nanoseconds;
            if (timeA > timeB) {
              return 1;
            }
            if (timeA < timeB) {
              return -1;
            }
            return 0;
          });
          dispatch({
            type: "SET_USERPOSTS",
            userPosts: post,
          });
          setPosts(post);
          setLoading(false);
        } else {
          setNoPosts(true);
          setLoading(false);
        }
      });
  }

  //   useEffect(() => {
  //     db.collection("posts")
  //       .where("username", "==", username)
  //       .get()
  //       .then(function (querySnapshot) {
  //         console.log("IN SNAPSHOT------------------------");
  //         var post = querySnapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           post: doc.data(),
  //         }));
  //         console.log(post);
  //         post.sort((a, b) => {
  //           const timeA = a.post.timestamp.nanoseconds;
  //           const timeB = b.post.timestamp.nanoseconds;
  //           if (timeA > timeB) {
  //             return 1;
  //           }
  //           if (timeA < timeB) {
  //             return -1;
  //           }
  //           return 0;
  //         });
  //         dispatch({
  //           type: "SET_USERPOSTS",
  //           userPosts: post,
  //         });
  //         setPosts(post);
  //       });
  //   }, []);

  return (
    <div>
      {/* {console.log("POSTS")} */}
      {posts.length > 0 && !loading ? (
        // posts.map(({ id, post }) => (
        <UserPost posts={posts} />
      ) : (
        // ))
        <div>{noPosts === true ? <p>No Posts</p> : <p>Loading</p>}</div>
      )}
    </div>
  );
}

export default UserPosts;
