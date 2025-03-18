const express = require("express");
const session = require("express-session");
const passport = require("passport");
const router = express.Router();
const userModel = require("../models/user");
const postModel = require("../models/posts");
const upload = require("../utils/fileUploader");
const path = require("path");
const fs = require("fs").promises;
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { error: req.flash("error") });
});

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  try {
    const user = await userModel
      .findOne({ username: req.session.passport.user })
      .populate({
        path: "posts",
        populate: {
          path: "comments.user", // Populate the user field in comments
          select: "username profileImage", // Only fetch username and profileImage
        },
      });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("profile", { user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/show/posts", isLoggedIn, async function (req, res, next) {
  const user = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("posts");
  res.render("show", { user });
});

router.get("/feed", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const posts = await postModel.find().populate("user");
  res.render("feed", { user, posts });
});

router.get("/addpost", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  res.render("addpost", { user });
});


router.post(
  "/fileupload",
  isLoggedIn,
  upload.single("image"),
  async function (req, res, next) {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/profile");
  }
);

router.post(
  "/uploadpost",
  isLoggedIn,
  upload.single("postimage"),
  async function (req, res, next) {
    if (!req.file) {
      return res.status(400).send("No files were uploaded.");
    }
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.create({
      image: req.file.filename,
      title: req.body.title,
      description: req.body.description,
      user: user._id,
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  }
);

router.get("/posts/edit/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    res.render("edit", { post });
  } catch (error) {
    console.error("Error fetching post for edit:", error);
    res.status(500).send("Internal Server Error");
  }
});

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Apply this middleware to your update route
router.put("/posts/update/:id", ensureAuthenticated, async (req, res) => {
  try {
      const postId = req.params.id;
      const updatedData = req.body;

      const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, { new: true });

      if (!updatedPost) {
          return res.status(404).json({ message: "Post not found" });
      }

      res.json(updatedPost);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}


router.post("/posts/update/:id", isLoggedIn, upload.single("postimage"), async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postModel.findById(postId);
    if (!post) return res.status(404).send("Post not found");

    // Fetch the currently logged-in user
    const user = await userModel.findOne({ username: req.session.passport.user });
    if (!user) return res.status(404).send("User not found");

    // Compare post.user (ObjectId) with user._id (ObjectId)
    if (post.user.toString() !== user._id.toString()) {
      return res.status(403).send("Unauthorized");
    }

    // Update post fields
    post.title = req.body.title;
    post.description = req.body.description;

    // Update image if a new one is uploaded
    if (req.file) {
      const oldImagePath = path.join(__dirname, "../public/images/uploads", post.image);
      await fs.unlink(oldImagePath).catch(err => console.error("Error deleting old image:", err));
      post.image = req.file.filename;
    }

    await post.save();
    res.redirect("/profile");
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/register", function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post("/deletepost/:postId", isLoggedIn, async function (req, res, next) {
  try {
    const postId = req.params.postId;

    // Find the post by ID and populate the user field
    const post = await postModel.findById(postId).populate("user");

    // Check if the post exists
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Ensure that the user making the request is the owner of the post
    if (post.user.username !== req.session.passport.user) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Remove the post from the user's posts array
    const user = await userModel.findById(post.user._id);
    user.posts.pull(postId);
    await user.save();

    // Construct the full path to the image file
    const imagePath = path.join(
      __dirname,
      "../public/images/uploads",
      post.image
    );

    console.log("Attempting to delete file at path:", imagePath);

    // Check if the file exists before attempting to delete
    const fileExists = await fs
      .access(imagePath)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      console.log("File exists, attempting to delete...");

      // Delete the post from the database using findByIdAndDelete
      await postModel.findByIdAndDelete(postId);

      // Delete the associated image file
      await fs.unlink(imagePath);

      console.log("File deleted successfully.");

      // Respond with JSON indicating success
      res.json({ success: true, message: "Post deleted successfully" });
    } else {
      console.log("File not found.");
      res.status(404).json({ success: false, message: "Image file not found" });
    }
  } catch (error) {
    console.error("Error during post deletion:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/feed", isLoggedIn, async (req, res) => {
  try {
    const posts = await postModel.find().populate("user");
    res.render("feed", { posts });  
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Server error");
  }
});

// Like route: toggles the like for the current user
router.post("/posts/:id/like", isLoggedIn, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    // Toggle like: if user hasn't liked, push; if already liked, remove.
    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
    } else {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    }
    await post.save();
    res.redirect("/feed");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Comment route: adds a new comment to the post
router.post("/posts/:id/comment", isLoggedIn, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    // Append a new comment object
    post.comments.push({
      user: req.user._id,
      text: req.body.text
    });
    await post.save();
    res.redirect("/feed");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;