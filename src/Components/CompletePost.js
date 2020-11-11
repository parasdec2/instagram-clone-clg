import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import "./css/CompletePost.css";
import { db, storage } from "../firebase";
import firebase from "firebase";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import TelegramIcon from "@material-ui/icons/Telegram";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import { FixedSizeList } from "react-window";

import ListItemText from "@material-ui/core/ListItemText";
import { List, ListItem, Menu, MenuItem, withStyles } from "@material-ui/core";
import moment from "moment";
import { Link, useHistory, useParams } from "react-router-dom";
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

function Post() {
  const { postId } = useParams();
  const [
    { user, userDetails, followingList, savedPosts },
    dispatch,
  ] = useStateValue();

  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [likesCount, setLikesCount] = useState([]);
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState("");
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadFollowList, setLoadFollowList] = useState(true);
  const [showFollowing, setShowFollowing] = useState(true);

  const [post, setPost] = useState(null);

  const [liked, setLiked] = useState(false);

  const history = useHistory();

  const abc = () => {
    // console.log(followingList);
    if (post.data.user === user.uid) {
      setShowFollowing(false);
    }
    if (followingList.length === 0) {
      const postsRef = db
        .collection("users")
        .doc(user.uid)
        .collection("following")
        .onSnapshot((snaphot) => {
          var following = snaphot.docs.map(
            (doc) => doc.id
            // displayName: doc.data().displayName,
          );
          // console.log(following);
          // console.log(user.uid);
          const result = following?.find((id) =>
            setFollowing(id === post.data.user)
          );
          dispatch({
            type: "SET_FOLLOWINGLIST",
            followingList: following,
          });
        });
    }
    if (followingList.length > 0 && loadFollowList) {
      // console.log(followingList);
      const result = followingList?.find((id) => id === post.data.user);
      if (result) {
        setFollowing(true);
      }
      setLoadFollowList(false);
    }
    if (post.data.likesCount > 0) {
      setLiked(likes?.find((id) => id === user.uid));
    }
    if (savedPosts?.length > 0) {
      setSaved(savedPosts?.find((id) => id === postId));
    }
  };

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
        .get()
        .then((snapshot) => {
          var likesArray = snapshot.data().likes;

          if (likesArray?.length > 0) {
            // console.log(likesArray);

            const result = likesArray?.find((id) => id === user?.uid);
            if (result) {
              setLiked(true);
            }
          }

          // console.log({ id: snapshot.id, data: snapshot.data() });
          setPost({ id: snapshot.id, data: snapshot.data() });
          setLikes(likesArray);
          setLikesCount(likesArray?.length);
        });
    }

    // return () => comments();
  }, [postId]);

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

  const handleFollow = async () => {
    var postUserFollowersList = [];
    const list = await db
      .collection("users")
      .doc(post.data.user)
      .get()
      .then((snapshot) => {
        // console.log("sdfsdfsdfsd");
        postUserFollowersList = snapshot.data().followersList;
      });
    // console.log(postUserFollowersList);

    if (following) {
      const followingIndex = followingList.indexOf(post.data.user);
      // console.log(followingIndex);
      if (followingIndex === 0) {
        followingList.shift();
      } else if (followingIndex === followingList.length - 1) {
        followingList.pop();
      } else {
        followingList.splice(followingIndex, 1);
      }
      db.collection("users").doc(user.uid).update({
        followingList: followingList,
        following: followingList.length,
      });

      const followerIndex = postUserFollowersList.indexOf(user.uid);
      // console.log(followerIndex);
      if (followerIndex === 0) {
        postUserFollowersList.shift();
      } else if (followerIndex === postUserFollowersList.length - 1) {
        postUserFollowersList.splice(followerIndex, 1);
      } else {
        postUserFollowersList.splice(followerIndex, 1);
      }

      db.collection("users").doc(post.data.user).update({
        followersList: postUserFollowersList,
        followers: postUserFollowersList.length,
      });
      setFollowing(false);
    } else {
      followingList.push(post.data.user);
      postUserFollowersList.push(user.uid);
      // console.log(postUserFollowersList);
      // console.log(followingList);
      db.collection("users").doc(user.uid).update({
        followingList: followingList,
        following: followingList.length,
      });
      db.collection("users").doc(post.data.user).update({
        followersList: postUserFollowersList,
        followers: postUserFollowersList.length,
      });
      setFollowing(true);
    }

    // -------------------------
    // if (following) {
    //   db.collection("users")
    //     .doc(user.uid)
    //     .collection("following")
    //     .doc(post.data.user)
    //     .delete();
    //   db.collection("users")
    //     .doc(user.uid)
    //     .update({
    //       following: userDetails.following - 1,
    //     });
    //   db.collection("users")
    //     .doc(post.data.user)
    //     .get()
    //     .then((snapshot) => {
    //       var followers = snapshot.data().followers;
    //       db.collection("users")
    //         .doc(post.data.user)
    //         .update({
    //           followers: followers - 1,
    //         });
    //     });
    //   setFollowing(false);
    // }
    // else {
    //   db.collection("users")
    //     .doc(user.uid)
    //     .collection("following")
    //     .doc(post.data.user)
    //     .set({
    //       followDate: firebase.firestore.FieldValue.serverTimestamp(),
    //     });
    //   db.collection("users")
    //     .doc(post.data.user)
    //     .get()
    //     .then((snapshot) => {
    //       var followers = snapshot.data().followers;
    //       db.collection("users")
    //         .doc(post.data.user)
    //         .update({
    //           followers: followers + 1,
    //         });
    //     });
    // }
  };

  const handleLike = (event) => {
    event.preventDefault();
    if (!liked) {
      likes.push(user.uid);
      // console.log(likes);
      db.collection("posts").doc(postId).update({
        likes: likes,
        likesCount: likes.length,
      });
      setLiked(true);
      setLikesCount(likesCount + 1);
    } else {
      const userIndex = likes.indexOf(user.uid);
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
      setLiked(false);
      setLikesCount(likesCount - 1);
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!saved) {
      savedPosts.push(postId);
      // console.log(savedPosts);
      db.collection("users")
        .doc(user.uid)
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
        .doc(user.uid)
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

  const handleDelete = async (event) => {
    event.preventDefault();
    await db.collection("posts").doc(post.id).delete();
    history.push("/");
  };

  return (
    <div>
      {/* {console.log(user)} */}

      {post?.id && (
        <div className="post">
          {/* Header -> avatar+username */}
          {/* image */}
          {/* username + caption */}
          {/* comments */}
          <div className="post__widthGreater500" onLoad={() => abc()}>
            <div className="post__left">
              <center>
                <img className="post__image" src={post.data.imageUrl} alt="" />
              </center>
            </div>
            <div className="post__right">
              <div className="post__header">
                <div className="post__headerLeft">
                  <Avatar className="post__avatar" src="" alt="Paras" />
                  <a
                    href={`/${post.data.username}`}
                    target="_blank"
                    className="post__headerLeftUsernameLink"
                  >
                    <h3 className="post__headerUsername">
                      {post.data.username}
                    </h3>
                  </a>
                </div>
                {showFollowing ? (
                  <div className="post__headerRight">
                    {!following ? (
                      <button onClick={handleFollow}>Follow</button>
                    ) : (
                      <button onClick={handleFollow}>Unfollow</button>
                    )}
                  </div>
                ) : (
                  <DeleteIcon onClick={handleDelete} />
                )}
              </div>

              <h4 className="post__text">
                <strong>{post.data.username} </strong> {post.data.caption}
              </h4>
              {comments?.length > 0 && (
                <p className="post__commentsCount">
                  View all {comments?.length} comments
                </p>
              )}

              {comments?.map(({ id, comment }) => (
                <p className="post__comments" key={id}>
                  <b>{comment.username}</b> <p>{comment.text}</p>
                  {user?.displayName === comment.username && (
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
                      <ListItemText
                        primary="Delete Comment"
                        onClick={deleteComment}
                      />
                    </StyledMenuItem>
                  </StyledMenu>
                </p>
              ))}

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
                {likesCount}{" "}
                {likesCount > 1 || likesCount === 0 ? "likes" : "like"}
              </p>

              <p className="post__timestamp">
                {moment(post.data.timestamp.toDate()).fromNow()}
              </p>

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
          </div>

          <div className="post__widthLess500">
            <div className="post__header">
              <div className="post__headerLeft">
                <Avatar className="post__avatar" src="" alt="Paras" />
                <a
                  href={`/${post.data.username}`}
                  target="_blank"
                  className="post__headerLeftUsernameLink"
                >
                  <h3 className="post__headerUsername">{post.data.username}</h3>
                </a>
              </div>
              <div className="post__headerRight">
                {following && <button onClick={handleFollow}>Unfollow</button>}
              </div>
            </div>
            <center>
              <img className="post__image" src={post.data.imageUrl} alt="" />
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
              <BookmarkBorderOutlinedIcon className="post__actionBookmarks" />
            </div>
            <p className="post__likesCount">
              {likesCount}{" "}
              {likesCount > 1 || likesCount === 0 ? "likes" : "like"}
            </p>

            <h4 className="post__text">
              <strong>{post.data.username} </strong> {post.data.caption}
            </h4>
            {comments?.length > 0 && (
              <p className="post__commentsCount">
                View all {comments?.length} comments
              </p>
            )}

            {comments?.map(({ id, comment }) => (
              <p className="post__comments" key={id}>
                <b>{comment.username}</b> <p>{comment.text}</p>
                {user?.displayName === comment.username && (
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
                    <ListItemText
                      primary="Delete Comment"
                      onClick={deleteComment}
                    />
                  </StyledMenuItem>
                </StyledMenu>
              </p>
            ))}

            <p className="post__timestamp">
              {moment(post.data.timestamp.toDate()).fromNow()}
            </p>

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
        </div>
      )}
    </div>
  );
}

export default Post;
