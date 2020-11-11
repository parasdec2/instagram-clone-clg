import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";
import UserPost from "./ExplorePost";

function SavedPostsTab({ userId }) {
  const { username } = useParams();

  const [{ user, savedPosts }, dispatch] = useStateValue();
  const [postsId, setPostsId] = useState([" "]);
  const [posts, setPosts] = useState([]);
  const [loadPosts, setLoadPosts] = useState(true);
  const [noSavedPosts, setNoSavedPosts] = useState(false);
  const [loading, setLoading] = useState(true);

  if (loading && savedPosts?.length > 0) {
    setPostsId(savedPosts);
    setLoading(false);
  }
  if (loading && savedPosts?.length === 0) {
    db.collection("users")
      .doc(userId)
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
          const postsIdOnly = [];
          postId.map(({ id }) => postsIdOnly.push(id));
          dispatch({
            type: "SET_SAVEDPOSTS",
            savedPosts: post,
          });
          setLoading(false);
          setPostsId(postsIdOnly);
        } else {
          setNoSavedPosts(true);
          setLoading(false);
        }
      });
  }

  if (loadPosts && postsId?.length > 0 && postsId[0] !== " ") {
    var post = [];
    postsId.map((id) =>
      db
        .collection("posts")
        .where("postId", "==", id)
        .get()
        .then(function (querySnapshot) {
          //   console.log(
          //     "IN SNAPSHOT------------------------",
          //     querySnapshot.docs
          //   );
          post = post.concat(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              post: doc.data(),
            }))
          );
          //   console.log(post[0]);
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
          // dispatch({
          //   type: "SET_SAVEDPOSTS",
          //   savedPosts: post,
          // });
          setPosts(post);
          setLoadPosts(false);
          setLoading(false);
        })
    );
  }

  //   useEffect(() => {
  //     db.collection("users")
  //       .doc(userId)
  //       .collection("savedPosts")
  //       .get()
  //       .then(function (querySnapshot) {
  //         var postId = querySnapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           post: doc.data(),
  //         }));

  //         postId.sort((a, b) => {
  //           const timeA = a.post.saved?.nanoseconds;
  //           const timeB = b.post.saved?.nanoseconds;
  //           if (timeA > timeB) {
  //             return 1;
  //           }
  //           if (timeA < timeB) {
  //             return -1;
  //           }
  //           return 0;
  //         });

  //         setPostsId(postId);
  //       });
  //   }, []);

  return (
    <div>
      {posts.length > 0 && !loadPosts ? (
        // posts.map(({ id, post }) => (
        <UserPost posts={posts} />
      ) : (
        // ))
        <div>
          {noSavedPosts === true ? <p>No Saved Posts</p> : <p>Loading</p>}
        </div>
      )}
    </div>
  );
}

export default SavedPostsTab;
