import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import "./css/Post.css";
import { db, storage } from "../firebase";
import firebase from "firebase";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import TelegramIcon from "@material-ui/icons/Telegram";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import BookmarkIcon from "@material-ui/icons/Bookmark";

import ListItemText from "@material-ui/core/ListItemText";
import { Menu, MenuItem, useMediaQuery, withStyles } from "@material-ui/core";
import moment from "moment";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    marginTop: "0px",
    marginBottom: "auto",
  },
})((props) => (
  <Menu
    elevation={2}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 300,
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function Post({
  imageUrl,
  username,
  postUserUid,
  displayPic,
  caption,
  postId,
  timestamp,
  imageName,
  following,
  userUid,
  // saved,
  // liked,
}) {
  const [
    { user, savedPosts, userDetails, followingList, likedPosts },
    dispatch,
  ] = useStateValue();
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  // var s = savedPosts?.find((pid) => pid === postId);
  // const [savedPosts, setSavedPosts] = useState([]);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState("");
  const [open, setOpen] = useState(false);
  const [loadSave, setLoadSave] = useState(true);
  const [loadLike, setLoadLike] = useState(true);
  const [liked, setLiked] = useState(false);

  //TODO: make a header component in profile so that by click we can go to different parts like posts saved igtv reels, etc withoput loading
  // console.log(saved);
  if (savedPosts?.find((pid) => pid === postId) && loadSave) {
    setSaved(true);
    setLoadSave(false);
  }
  if (likedPosts?.find((pid) => pid === postId) && loadLike) {
    setLiked(true);
    setLoadLike(false);
  }
  useEffect(() => {
    if (postId) {
      db.collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({ id: doc.id, comment: doc.data() }))
          );
        });

      db.collection("posts")
        .doc(postId)
        .onSnapshot((snapshot) => {
          const likesArray = snapshot.data().likes;

          // if (likesArray?.length > 0) {
          //   // console.log(likesArray);

          //   const result = likesArray?.find((id) => id === userUid);
          //   if (result) {
          //     setLiked(true);
          //   }
          // }
          setLikes(likesArray);
          setLikesCount(likesArray?.length);
        });
    }

    // return () => comments();
  }, [postId]);

  const deletePost = async () => {
    const mediaLocation = `/media/${userUid}/${imageName}`;
    var storageRef = storage.ref();
    var fileRef = storageRef.child(mediaLocation);
    const res1 = await fileRef.delete();
    db.collection("posts").doc(postId).delete();
    db.collection("users")
      .doc(user.uid)
      .update({
        posts: userDetails.posts - 1,
      });
  };

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    db.collection("posts")
      .doc(postId)
      .update({
        comments: comments.length + 1,
      });
    setComment("");
  };

  const deleteComment = (event) => {
    event.preventDefault();
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .delete();
    db.collection("posts")
      .doc(postId)
      .update({
        comments: comments.length - 1,
      });

    setOpen(false);
  };

  const handleFollow = () => {
    if (following) {
      // console.log(postUserUid);
      var postUserFollowersList = [];
      db.collection("users")
        .doc(postUserUid)
        .get()
        .then((snapshot) => {
          postUserFollowersList = snapshot.data().followersList;
        });
      const followingIndex = followingList.indexOf(postUserUid);
      // console.log(followingIndex);
      if (followingIndex === 0) {
        followingList.shift();
      } else {
        followingList.splice(followingIndex, 1);
      }
      db.collection("users").doc(userUid).update({
        followingList: followingList,
        following: followingList.length,
      });

      const followerIndex = postUserFollowersList.indexOf(userUid);
      // console.log(followerIndex);
      if (followerIndex === 0) {
        postUserFollowersList.shift();
      } else {
        postUserFollowersList.splice(followerIndex, 1);
      }
      db.collection("users").doc(postUserUid).update({
        followersList: postUserFollowersList,
        followers: postUserFollowersList.length,
      });
    }

    // if (following) {
    //   db.collection("users")
    //     .doc(userUid)
    //     .collection("following")
    //     .doc(postUserUid)
    //     .delete();
    //   db.collection("users")
    //     .doc(userUid)
    //     .update({
    //       following: userDetails.following - 1,
    //     })
    //     db.collection("users")
    //     .doc(postUserUid).get().then((snapshot) => {
    //       var followers = snapshot.data().followers
    //       db.collection("users")
    //         .doc(postUserUid)
    //         .update({
    //           followers: followers - 1,
    //         })

    //     })
    // }
  };

  const handleLike = (event) => {
    event.preventDefault();
    if (!liked) {
      likes.push(userUid);
      // console.log(likes);
      db.collection("posts").doc(postId).update({
        likes: likes,
        likesCount: likes.length,
      });
      likedPosts.push(postId);
      // console.log(likedPosts);
      dispatch({
        type: "SET_LIKEDPOSTS",
        likedPosts: likedPosts,
      });
      db.collection("users").doc(userUid).update({
        likedPosts: likedPosts,
      });
      setLiked(true);
    } else {
      const userIndex = likes.indexOf(userUid);
      // console.log(userIndex);
      if (userIndex === 0) {
        likes.shift();
        // console.log(likes);
      } else {
        likes.splice(userIndex, 1);
        // console.log(likes);
      }

      db.collection("posts").doc(postId).update({
        likes: likes,
        likesCount: likes.length,
      });

      const likedPostIndex = likedPosts.indexOf(postId);
      if (likedPostIndex === 0) {
        likedPosts.shift();
        // console.log(likes);
      } else {
        likedPosts.splice(likedPostIndex, 1);
        // console.log(likes);
      }
      dispatch({
        type: "SET_LIKEDPOSTS",
        likedPosts: likedPosts,
      });
      db.collection("users").doc(userUid).update({
        likedPosts: likedPosts,
      });

      setLiked(false);
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!saved) {
      savedPosts.push(postId);
      // console.log(savedPosts);
      db.collection("users")
        .doc(userUid)
        .collection("savedPosts")
        .doc(postId)
        .set({
          saved: firebase.firestore.FieldValue.serverTimestamp(),
        });
      setSaved(true);
      dispatch({
        type: "SET_SAVEDPOSTS",
        savedPosts: savedPosts,
      });
    } else {
      const postIndex = savedPosts.indexOf(postId);
      // console.log(postIndex);
      if (postIndex === 0) {
        savedPosts.shift();
      } else {
        savedPosts.splice(postIndex, 1);
      }
      db.collection("users")
        .doc(userUid)
        .collection("savedPosts")
        .doc(postId)
        .delete();
      setSaved(false);
      dispatch({
        type: "SET_SAVEDPOSTS",
        savedPosts: savedPosts,
      });
    }
  };

  return (
    <div className="post">
      {/* Header -> avatar+username */}
      {/* image */}
      {/* username + caption */}
      {/* comments */}
      <div className="post__header">
        <div className="post__headerLeft">
          <Avatar className="post__avatar" src={displayPic} alt="Paras" />
          <a
            href={`/${username}`}
            target="_blank"
            className="post__headerLeftUsernameLink"
          >
            <h3 className="post__headerUsername">{username}</h3>
          </a>
        </div>
        <div className="post__headerRight">
          {user.displayName === username && <DeleteIcon onClick={deletePost} />}
          {following && <button onClick={handleFollow}>Unfollow</button>}
        </div>
      </div>
      <center>
        <img className="post__image" src={imageUrl} alt="" />
      </center>
      <div className="post__userActions">
        <div className="post__actionsLeft">
          {liked ? (
            <FavoriteIcon
              className="post__action post__actionLike"
              onClick={handleLike}
            />
          ) : (
            <FavoriteBorderIcon
              className="post__action "
              onClick={handleLike}
            />
          )}
          <ModeCommentOutlinedIcon className="post__action" />
          <TelegramIcon className="post__action post__actionShare" />
        </div>
        {saved ? (
          <BookmarkIcon
            className="post__actionBookmarks"
            onClick={handleSave}
          />
        ) : (
          <BookmarkBorderOutlinedIcon
            className="post__actionBookmarks"
            onClick={handleSave}
          />
        )}
      </div>
      <p className="post__likesCount">
        {likesCount} {likesCount > 1 || likesCount === 0 ? "likes" : "like"}
      </p>

      <h4 className="post__text">
        <strong>{username} </strong> {caption}
      </h4>
      {comments?.length > 0 && (
        <p className="post__commentsCount">
          View all {comments?.length} comments
        </p>
      )}

      {comments?.map(({ id, comment }) => (
        <p className="post__comments" key={id}>
          <b>{comment.username}</b> <p>{comment.text}</p>
          {user.displayName === comment.username && (
            <DeleteIcon
              className="post__commentDelete"
              onClick={() => (setCommentId(id), setOpen(true))}
            />
          )}
          <StyledMenu
            id="customized-menu"
            keepMounted
            open={open}
            onClose={() => setOpen(false)}
          >
            <StyledMenuItem>
              <ListItemText primary="Delete Comment" onClick={deleteComment} />
            </StyledMenuItem>
          </StyledMenu>
        </p>
      ))}

      <p className="post__timestamp">{moment(timestamp.toDate()).fromNow()}</p>

      <form className="post__commentBox">
        <input
          type="text"
          className="post__input"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="post__button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Post;
