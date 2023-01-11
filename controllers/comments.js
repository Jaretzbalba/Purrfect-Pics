const Comment = require('../models/Comment');
const User = require('../models/User');

module.exports = {
  createComment: async (req, res) => {
    console.log(req.body);

    const loggedUser = await User.findById(req.user.id);

    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
        userName: loggedUser.displayName,
        userId: loggedUser.id,
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
