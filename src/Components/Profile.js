import { Avatar, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import FolderIcon from "@material-ui/icons/Folder";
import GridOnTwoToneIcon from "@material-ui/icons/GridOnTwoTone";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth, storage } from "../firebase";
import firebase from "firebase";
import "./css/Profile.css";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded";
import { useStateValue } from "../StateProvider";
import UserPosts from "./UserPosts";
import SavedPosts from "./SavedPosts";

function Profile() {
  const { username } = useParams();
  const [{ user, followingList, followersList }, dispatch] = useStateValue();
  const [userExists, setUserExists] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [profileId, setProfileId] = useState("");
  const [commonFollowers, setCommonFollowers] = useState([]);
  const [commonFollowing, setCommonFollowing] = useState([]);
  const [value, setValue] = useState("posts");
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollower, setIsFollower] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listsLoad, setlistsLoad] = useState(true);
  const [error, setError] = useState(false);
  const [loadDisplayPic, setLoadDisplayPic] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (profile !== null && loading) {
    // console.log("******************", profile);
    if (loadDisplayPic && profile.data.displayPic === "") {
      storage
        .ref()
        .child("static/dummy450x450.jpg")
        .getDownloadURL()
        .then((url) => {
          setProfilePic(url);
          console.log("dummy", url);
        });
      setLoadDisplayPic(false);
    }
    if (userExists === profile.id) {
      setIsAuthenticatedUser(true);
      setLoggedIn(true);
      setLoading(false);
    }
    setTimeout(() => {
      if (userExists !== profile.id) {
        // console.log(userExists, followingList);
        if (loading && profile.data.followingList.length > 0) {
          const result = profile.data.followingList.find(
            (id) => id === userExists
          );
          if (result) {
            setIsFollower(true);
          }
          setLoading(false);
        }
        if (loading && followingList?.length > 0) {
          const result = followingList?.find((id) => id === profile.id);
          if (result === profile.id) {
            // console.log("Result", result);
            setIsFollowing(true);
            setLoading(false);
          }
          setLoading(false);
        }
      }
      if (
        profile.data.private === false &&
        listsLoad &&
        userExists !== profile.id
      ) {
        console.log(profile.data.followersList);
        var commonFollowersList = profile.data?.followersList.filter((x) =>
          followersList.includes(x)
        );
        setCommonFollowers(commonFollowersList);
        let commonFollowingList = profile.data?.followingList.filter((x) =>
          followingList.includes(x)
        );
        setCommonFollowing(commonFollowingList);
        setlistsLoad(false);
      }
    }, 500);

    if (userExists === null) {
      // console.log("dsfsd");
      setLoading(false);
      setIsAuthenticatedUser(false);
      setIsFollowing(false);
      setLoggedIn(false);
    }
  }

  //   });

  useEffect(() => {
    // var a = [];
    // var b = [];
    // for (var i = 0; i < 200000; i = i + 2) {
    //   a.push(i);
    // }
    // for (var i = 0; i < 400000; i = i + 4) {
    //   b.push(i);
    // }
    // // task starts
    // var start = Date.now();
    // let intersection = a.filter((x) => b.includes(x));

    // // task ends
    // var end = Date.now();
    // console.log(`Execution time: ${end - start} ms`);

    db.collection("users")
      .where("userName", "==", username)
      .get()
      .then(function (querySnapshot) {
        // console.log("''''''''''''''''''''");
        if (!querySnapshot.empty) {
          setProfile({
            id: querySnapshot.docs[0].id,
            data: querySnapshot.docs[0].data(),
          });
          setProfileId(querySnapshot.docs[0].id);
          setLoading(true);
        } else {
          setError(true);
        }
      });
    // console.log("////////////////////");

    setTimeout(() => {
      if (auth.currentUser) {
        console.log("aksjlkaldjalskjdlajdlaksjdlsjdklajsdl");
        setUserExists(auth.currentUser.uid);
        setLoggedIn(true);
        setLoading(true);
      } else {
        setLoggedIn(false);
      }
    }, 1500);
  }, []);

  return (
    <div className="profile">
      {!error ? (
        <div>
          {profile ? (
            <div>
              <div class="profile__header">
                {profile.data?.displayPic === "" ? (
                  <div className="profile__headerLeftAvatar">
                    <img
                      src={profilePic}
                      alt="displayPic"
                      className="profile__headerLeftAvatar"
                    />
                  </div>
                ) : (
                  <div className="profile__headerLeftAvatar">
                    <img
                      src={profile.data?.displayPic}
                      alt="abc"
                      className="profile__headerLeftAvatar"
                    />
                  </div>
                )}

                <div className="profile__headerRight">
                  <div className="profile__settings">
                    <p className="profile__settingsUserName">
                      {profile.data?.userName}
                    </p>

                    {/* {console.log("LOGGED IN", isFollower)} */}

                    {isAuthenticatedUser && (
                      <a href="/accounts/edit">
                        <Button class="profile-edit-btn">Edit Profile</Button>
                      </a>
                    )}
                    {!isAuthenticatedUser && isFollowing && (
                      <Button class="profile-edit-btn">UnFollow</Button>
                    )}
                    {!isAuthenticatedUser && isFollower && !isFollowing && (
                      <Button class="profile-edit-btn">Follow Back</Button>
                    )}
                    {loggedIn === false && (
                      <Button class="profile-edit-btn">Follow</Button>
                    )}
                    {/* {!isAuthenticatedUser && isFollowing === false && (
                      <Button class="profile-edit-btn">Follow</Button>
                    )} */}
                    {/* {!isAuthenticatedUser && !isFollowing && (
                      <Button class="profile-edit-btn">Follow</Button>
                    )} */}

                    {isAuthenticatedUser && (
                      <SettingsRoundedIcon className="profile-settings-btn" />
                    )}
                  </div>

                  <div class="profile__stats">
                    <div className="profile__statCountDiv">
                      <span class="profile__statCount">
                        {profile.data?.posts}
                      </span>{" "}
                      posts
                    </div>
                    <div className="profile__statCountDiv">
                      <span class="profile__statCount">
                        {profile.data?.followers}
                      </span>{" "}
                      followers
                    </div>
                    <div className="profile__statCountDiv">
                      <span class="profile__statCount">
                        {profile.data?.following}
                      </span>{" "}
                      following
                    </div>
                  </div>

                  <div class="profile__bio">
                    <span class="profile-real-name">{profile.data?.name}</span>
                    {commonFollowers.length > 0 && commonFollowers.length <= 3 && (
                      <p>
                        {commonFollowers[0]}, {commonFollowers[1]},{" "}
                        {commonFollowers[2]}
                      </p>
                    )}
                    {/* {console.log(commonFollowing)} */}
                    <p>{profile.data?.bio}</p>
                  </div>
                </div>
              </div>
              {loggedIn === false && (
                <div>
                  <h1>Login to see user Posts</h1>
                </div>
              )}

              {loggedIn === true && (
                <BottomNavigation
                  value={value}
                  onChange={handleChange}
                  className="profile__headerNavigation"
                >
                  <BottomNavigationAction
                    label="Posts"
                    value="posts"
                    icon={
                      <GridOnTwoToneIcon className="profile__headerNavigation" />
                    }
                    className="profile__headerNavigationText"
                  />
                  {/* <BottomNavigationAction
                    label="Reels"
                    value="reels"
                    icon={
                      <FavoriteIcon className="profile__headerNavigation" />
                    }
                  />
                  <BottomNavigationAction
                    label="Nearby"
                    value="nearby"
                    icon={
                      <LocationOnIcon className="profile__headerNavigation" />
                    }
                  /> */}
                  {isAuthenticatedUser && (
                    <BottomNavigationAction
                      label="Saved"
                      value="saved"
                      icon={
                        <BookmarkIcon className="profile__headerNavigation" />
                      }
                    />
                  )}
                </BottomNavigation>
              )}
              {value === "posts" && loggedIn && <UserPosts />}
              {value === "saved" && loggedIn && (
                <SavedPosts userId={profile.id} />
              )}
            </div>
          ) : (
            <div>
              <h2>Loading</h2>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1>NO USER FOUND</h1>
        </div>
      )}
    </div>
  );
}

export default Profile;
