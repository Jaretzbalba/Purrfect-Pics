const cloudinary = require('../middleware/cloudinary');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const moment = require('moment');

module.exports = {
  getProfile: async (req, res) => {
    try {
      const loggedUser = await User.findById(req.user.id);
      const clickedUser = await User.findById(req.params.id);
      const posts = await Post.find({ user: req.params.id });
      res.render('profile.ejs', {
        posts: posts,
        clickedUser: clickedUser,
        loggedUser: loggedUser,
        moment: moment,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const loggedUser = await User.findById(req.user.id);
      const posts = await Post.find().sort({ createdAt: 'desc' }).lean();
      res.render('feed.ejs', {
        posts: posts,
        loggedUser: loggedUser,
        moment: moment,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const loggedUser = await User.findById(req.user.id);
      const comments = await Comment.find({ post: req.params.id })
        .sort({ createdAt: 'desc' })
        .lean();
      res.render('post.ejs', {
        post: post,
        loggedUser: loggedUser,
        comments: comments,
        moment: moment,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getfavorites: async (req, res) => {
    try {
      const loggedUser = await User.findById(req.user.id);
      const posts = await Post.find().sort({ createdAt: 'desc' }).lean();
      res.render('favorites.ejs', {
        posts: posts,
        loggedUser: loggedUser,
        moment: moment,
      });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      const loggedUser = await User.findById(req.user.id);

      await Post.create({
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
        userName: loggedUser.displayName,
      });
      console.log('Post has been added!');
      res.redirect(`/profile/${req.user.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    var liked = false;
    try {
      var post = await Post.findById({ _id: req.params.id });
      liked = post.likes.includes(req.user.id);
    } catch (err) {}
    //if already liked we will remove user from likes array
    if (liked) {
      try {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $pull: { likes: req.user.id },
          }
        );

        console.log('Removed user from likes array');
        res.redirect('back');
      } catch (err) {
        console.log(err);
      }
    }
    //else add user to like array
    else {
      try {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $addToSet: { likes: req.user.id },
          }
        );

        console.log('Added user to likes array');
        res.redirect(`back`);
      } catch (err) {
        console.log(err);
      }
    }
  },
  bookmarkPost: async (req, res) => {
    var bookmarked = false;
    try {
      var post = await Post.findById({ _id: req.params.id });
      bookmarked = post.bookmarks.includes(req.user.id);
    } catch (err) {}
    //if already bookmarked we will remove user from likes array
    if (bookmarked) {
      try {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $pull: { bookmarks: req.user.id },
          }
        );

        console.log('Removed user from bookmarks array');
        res.redirect('back');
      } catch (err) {
        console.log(err);
      }
    }
    //else add user to bookmarked array
    else {
      try {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $addToSet: { bookmarks: req.user.id },
          }
        );

        console.log('Added user to bookmarks array');
        res.redirect(`back`);
      } catch (err) {
        console.log(err);
      }
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log('Deleted Post');
      res.redirect(`/profile/${req.user.id}`);
    } catch (err) {
      res.redirect(`/profile/${req.user.id}`);
    }
  },
};
