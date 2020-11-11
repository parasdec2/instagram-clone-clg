export const initialState = {
  user: null,
  userDetails: null,
  followingList: [],
  followingListExists: true,
  followersList: [],
  savedPosts: [],
  likedPosts: [],
  userPosts: [],
  feedPosts: [],
};

const reducer = (state, action) => {
  // console.log(action.followingList);
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
        userDetails: action.userDetails,
      };
    case "SET_SAVEDPOSTS":
      return {
        ...state,
        savedPosts: action.savedPosts,
      };
    case "SET_FEEDPOSTS":
      return {
        ...state,
        feedPosts: action.feedPosts,
      };
    case "SET_USERPOSTS":
      return {
        ...state,
        userPosts: action.userPosts,
      };
    case "SET_LIKEDPOSTS":
      return {
        ...state,
        likedPosts: action.likedPosts,
      };

    case "SET_FOLLOWINGLIST":
      // const follow = action.followingList;
      // console.log(follow);
      return {
        ...state,
        followingList: action.followingList,
      };

    case "SET_FOLLOWINGLISTEXISTS":
      // const follow = action.followingList;
      // console.log(follow);
      return {
        ...state,
        followingListExists: action.followingList,
      };

    case "SET_FOLLOWERSLIST":
      return {
        ...state,
        followersList: action.followersList,
      };

    default:
      return state;
  }
};

export default reducer;
