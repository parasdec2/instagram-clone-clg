import React, { useEffect, useState } from "react";
import "./css/ExplorePost.css";
import { db, storage } from "../firebase";
import firebase from "firebase";

function Post({ posts }) {
  return (
    <div class="container">
      <div class="gallery">
        {posts.length > 0 ? (
          posts.map(({ id, post }) => (
            <div class="gallery-item" tabindex="0" key={id}>
              <a target="_blank" href={`/post/${id}`} className="gallery__link">
                <img src={post.imageUrl} class="gallery-image" alt="" />
                <div class="gallery-item-info">
                  <ul>
                    <li class="gallery-item-likes">
                      <span>Likes:</span>
                      <i class="fas fa-heart" aria-hidden="true"></i>{" "}
                      {post.likesCount}
                    </li>
                    <li class="gallery-item-comments">
                      <span>Comments:</span>
                      <i class="fas fa-comment" aria-hidden="true"></i>{" "}
                      {post.comments}
                    </li>
                  </ul>
                </div>
              </a>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Post;
