const Comment = require('../models/Comment');

module.exports = {
  createComment: async (req, res) => {
    console.log(req.body);
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
        userName: req.user.userName,
        userId: req.user.id,
      });
      console.log('Comment has been added!');
      res.redirect('/post/' + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    console.log(req.params);
    try {
      // Delete post from db
      await Comment.deleteOne({ _id: req.params.commentId });
      console.log('Deleted Comment');
      res.redirect(`/post/${req.params.postId}`);
    } catch (err) {
      res.redirect(`/post/${req.params.postId}`);
    }
  },
};
