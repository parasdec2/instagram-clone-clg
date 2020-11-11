import React, { useState } from "react";
import "./css/ImageUpload.css";
import { Button } from "@material-ui/core";
import { storage, db } from "../firebase";
import firebase from "firebase";
import { useStateValue } from "../StateProvider";
import { useHistory } from "react-router-dom";

function ImageUpload() {
  const [{ user, userDetails }, dispatch] = useStateValue();
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  const history = useHistory();
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPreviewMedia(URL.createObjectURL(e.target.files[0]));
      setMedia(e.target.files[0]);
      setShow(true);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setShow(false);
    var ts = new Date();
    ts = ts.toISOString();
    const uploadTask = storage.ref(`posts/${user.uid}/media/${ts}`).put(media);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function..
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      // error message
      (err) => {
        // console.log(err);
        alert(err.message);
      },
      // main upload function.
      () => {
        storage
          .ref(`posts/${user.uid}/media`)
          .child(`${ts}`)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").doc(ts).set({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              imageName: ts,
              username: user.displayName,
              user: user.uid,
              private: userDetails.private,
              likesCount: 0,
              likes: [],
              comments: 0,
              postId: ts,
            });

            db.collection("users")
              .doc(user.uid)
              .update({
                posts: userDetails.posts + 1,
              });

            setProgress(0);
            setCaption("");
            setMedia(null);
          });
        history.push("/");
      }
    );
  };

  const removeMedia = (e) => {
    e.preventDefault();
    setMedia(null);
  };

  return (
    <div className="imageUpload">
      {/* progress bar */}
      {/* caption input */}
      {/* file picker */}
      {/* Post Button */}
      <h3 className="imageUpload__header">Upload a Photo</h3>
      {progress > 0 && progress < 100 && (
        <progress value={progress} max="100" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="imageUpload__imageInput"
      />

      {media && (
        <div className="imageUpload__mediaPreview">
          <img
            className="imageUpload__previewImage"
            src={previewMedia}
            alt="media"
          />
          <br />
          <Button onClick={removeMedia}>Remove</Button>
        </div>
      )}

      <input
        type="text"
        placeholder="Enter whats on your mind..."
        onChange={(e) => setCaption(e.target.value)}
      />
      {media && show && progress === 0 ? (
        <Button onClick={handleUpload}>Post</Button>
      ) : (
        <Button disabled>Post</Button>
      )}
    </div>
  );
}

export default ImageUpload;
