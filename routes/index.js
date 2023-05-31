const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const isEmailValid = require('email-validator');
const passwordValidator = require('password-validator');
const middleware = require('../middleware');
const Feedback = require('../models/feedback');
// router.get('/', (req, res) => {
//   res.render('index');
// });

router.get('/', (req, res) => {
  //Get all posts from DB
  Post.find({}, (err, allposts) => {
    if (err) {
      console.log('Error in find');
      console.log(err);
    } else {
      res.render('index', {
        posts: allposts.reverse(),
        currentUser: req.user,
      });
    }
  });
});

//show register form
router.get('/register', (req, res) => {
  res.render('register');
});

//handle signup logic
router.post('/register', (req, res) => {
  var schema = new passwordValidator();
  const pass = req.body.password;
  const confirmPass = req.body.confirmpassword;
  schema.is(pass).min(8);
  const email = req.body.email;

  if (isEmailValid.validate(email)) {
    if (schema.validate(pass) && pass == confirmPass) {
      var newUser = new User({
        username: req.body.username,
        email: email,
      });
      User.register(newUser, req.body.password, (err, user) => {
        if (err) {
          console.log(err);
          return res.render('register', {
            message: 'This Email is Already Exists',
          });
        }
        passport.authenticate('local')(req, res, () => {
          res.redirect('/');
        });
      });
    } else {
      return res.render('register', {
        message: 'Password is Too Short / Passwords Do Not Match',
      });
    }
  } else {
    return res.render('register', {
      message: 'This Email is Invalid',
    });
  }
});

// show login form
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/loginfail', (req, res) => {
  res.render('loginfail');
});

router.get('/cyber-admin', (req, res) => {
  res.render('adminlogin');
});

//handle login logic
// ----------> router.post('/login', middleware, callback)
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginfail',
  }),
  (req, res) => {}
);

// Admin Login Logic an feedback fetching
router.post('/adminlogin', (req, res) => {
  const name = req.body.username;
  const pass = req.body.password;
  if (name == 'admin' && pass == 'admin') {
    Feedback.find({}, (err, allfeeds) => {
      if (err) {
        console.log('Error in find');
        console.log(err);
      } else {
        // console.log(allfeeds);
        res.render('admin', {
          feedbacks: allfeeds.reverse(),
        });
      }
    });
    // return res.render('admin');
  } else {
    return res.render('adminlogin', {
      message: 'Invalid Credientials',
    });
  }
});

//logic route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// show forgot password form
router.get('/passforgot', (req, res) => {
  res.render('forgotpassword');
});

// show feedback form
router.get('/feedback', (req, res) => {
  res.render('feedback');
});

// Feeback logic
router.post('/newfeedback', middleware.isLoggedIn, (req, res) => {
  // add new post
  var email = req.body.email;
  var message = req.body.message;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };

  var newFeedback = {
    email: email,
    message: message,
    author: author,
  };
  //Save to database
  Feedback.create(newFeedback, (err, newlyCreated) => {
    if (err) {
      console.log('Error in inserting into DB');
      res.render('feedback', {
        message: 'Error in inserting into DB',
      });
    } else {
      res.render('feedback', {
        message: 'Feedback Submitted Successfully',
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
