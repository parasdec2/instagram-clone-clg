import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Post from "./Post";
import { useStateValue } from "../StateProvider";
import "./css/Posts.css";
function Posts() {
  const [
    {
      user,
      followingList,
      savedPosts,
      feedPosts,
      followingListExists,
      likedPosts,
    },
    dispatch,
  ] = useStateValue();
  const [posts, setPosts] = useState([]);
  const [display, setDisplay] = useState(false);
  const [noFollowing, setNoFollowing] = useState(false);
  const [load, setLoad] = useState(true);

  // TODO: in reducer change default state of followingList to array with empty array and also set followingList to be -1 if user has no following

  // console.log(likedPosts?.find((pid) => pid === "2020-10-01T10:36:53.427Z"));

  if (load && followingList.length > 0) {
    // console.log("FALSEEEEEEEEEEEEEEEEEEEEEEEE", followingList);
    setNoFollowing(false);
    if (feedPosts.length > 0 && posts.length === 0) {
      setPosts(feedPosts);
      setLoad(false);
    }
    if (feedPosts.length === 0 || posts.length === 0) {
      var post = [];

      followingList.map((id, index) =>
        db
          .collection("posts")
          .where("user", "==", id)
          .limit(2)
          .get()
          .then(function (querySnapshot) {
            // console.log("IN SNAPSHOT------------------------");
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
            dispatch({
              type: "SET_FEEDPOSTS",
              feedPosts: post,
            });
            setPosts(post);
          })
      );
      setDisplay(true);

      setPosts(feedPosts);
      setLoad(false);
    }
  }

  if (load && !followingListExists) {
    // console.log("---------------");
    setLoad(false);
    setNoFollowing(true);
  }

  // if (followingList === null) {
  // }

  // if (load && followingList.length === 0) {
  //   setLoad(false);
  //   setNoFollowing(true);
  // }

  // -------------- Showing Only Following Posts -----------------------

  // ---------------------------------------------------------------------

  return (
    <div className="posts">
      {/* {console.log("Following", followingList)} */}
      {posts.length > 0 || display || feedPosts.length > 0 ? (
        posts.length > 0 ? (
          posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              imageUrl={post.imageUrl}
              caption={post.caption}
              username={post.username}
              user={user.displayName}
              userUid={user.uid}
              imageName={post.imageName}
              timestamp={post.timestamp}
              following={true}
              postUserUid={post.user}
              likesCount={post.likes}
              commentsCount={post.comments}
              // saved={savedPosts?.find((pid) => pid === id)}
              // liked={likedPosts?.find((pid) => pid === id)}
            />
          ))
        ) : (
          <p>Follow people to see their Posts</p>
        )
      ) : (
        <p>{!noFollowing ? "Loading" : "Follow people to use Posts"}</p>
      )}
    </div>
  );
}

export default Posts;
