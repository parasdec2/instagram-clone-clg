import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import ExplorePost from "./ExplorePost";
import { useStateValue } from "../StateProvider";
import "./css/Explore.css";
function Explore() {
  const [{ user }, dispatch] = useStateValue();
  const [posts, setPosts] = useState([]);
  const [postsOrdered, setPostsOrdered] = useState([]);

  useEffect(() => {
    // ------------------- To get All posts having public account ------------------
    const getMultiple = async () => {
      var post = [];
      const postsRef = db.collection("posts");
      const snapshot = await postsRef
        .where("private", "==", false)
        .get()
        .then(function (querySnapshot) {
          post = post.concat(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              post: doc.data(),
            }))
          );
          // console.log(post[0].post.timestamp.nanoseconds);
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
          setPosts(post);
        });
    };
    getMultiple();
    // ------------------------------------------------------------------------------

    // .onSnapshot((snaphot) => {
    //   console.log(snaphot.docs.map((doc) => doc.data()));
    //   setPosts(
    //     snaphot.docs.map((doc) => ({
    //       id: doc.id,
    //       post: doc.data(),
    //     }))
    //   );
    // });
  }, []);

  return (
    <div className="posts">
      {/* {console.log("following", following)} */}
      {posts.length > 0 ? (
        // posts.map(({ id, post }) => (
        <ExplorePost posts={posts} />
      ) : (
        // ))
        <p>Loading</p>
      )}
    </div>
  );
}

export default Explore;
