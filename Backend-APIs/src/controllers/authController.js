// library
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const cloudinary = require("../config/cloudinary");

//helper
const AppError = require("../utils/appError");
const catchAsync = require("../utils/error");
const Email = require('../utils/email');


//Model
const User = require("../models/userModel");


  
// create a token..
const tokenJWT = function (user) {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
};

//store token in Cookie with configuration..

const createSendToken = function (user, res, statusCode) {
    const token = tokenJWT(user);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: 'success',
        data: {
            user
        }
    })

};

exports.signup = catchAsync(async function (req, res, next) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Generate OTP
  const otp = newUser.createEmailVerificationOTP();

  // Save OTP without triggering password validation again
  await newUser.save({
    validateBeforeSave: false,
  });

  const verifyURL = "http://localhost:5173/user/verifyToken";

  try {
    await new Email(newUser, verifyURL).sendOtpVerification(otp);
    console.log('done... Email...')
    return res.status(200).json({
      status: "success",
      message: "Verification code sent successfully.",
      email: newUser.email,
    });
  } catch (err) {
    // Optional: remove OTP if email sending failed
    newUser.otp = undefined;
    newUser.otpExpires = undefined;

    await newUser.save({
      validateBeforeSave: false,
    });

    return next(
      new AppError("Error sending verification email. Please try again.", 500),
    );
  }


});


exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  // 1. Validate request
  if (!email || !otp) {
    return next(new AppError("Please provide email and OTP.", 400));
  }

  // 2. Find user
  const user = await User.findOne({ email }).select("+otp +otpExpires +active");

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  // 3. Already verified
  if (user.emailVerified) {
    return next(new AppError("Email is already verified.", 400));
  }

  // 4. Verify OTP
  const validOTP = user.verifyOTP(otp);

  if (!validOTP) {
    return next(new AppError("Invalid or expired OTP.", 400));
  }

  // 5. Mark email as verified
  user.emailVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  user.active = true;

  await user.save({
    validateBeforeSave: false,
  });

  // 6. Login user
  createSendToken(user, res, 200);
});


exports.cancelSignup = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const user = await User.findOneAndDelete({
    email,
    emailVerified: false,
  });

  if (!user) {
    return next(new AppError("No unverified user found with this email", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Signup cancelled successfully.",
  });
});
// LOGIN ..

exports.login = catchAsync(async function (req, res, next) {
    //checking email and password are provided or not 
  const { email, password } = req.body;


  if (!email || !password)
  {
    // console.log(1);
        return next(new AppError('Please Provide Email and Password!', 400))
    }

    // find user in db

    const user = await User.findOne({ email }).select('+password');

  if (!user) {
      // console.log(2);
        return next(new AppError('User Not exists, Please SignUp',401));
    }


    console.log(user.password);
    // verify password once again..
    const validUser = await user.correctPassword(password, user.password);



    //Wrong password
  if (!validUser) {


        return next(new AppError('Email or Password is Invalid !', 401));
    }

    createSendToken(user, res, 200);

    


});



// purpose : to validate the token store in cookie 
exports.protect = catchAsync(async function (req, res, next)
{
    let token;

    if (req.cookies.jwt && req.cookies.jwt !== 'null') {
        token = req.cookies.jwt;
        // console.log('Authentication----'); 

    }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const authToken = req.headers.authorization.split(' ')[1];

        if (authToken && authToken !== 'null') {
            token = authToken;
        }
    }

  if (!token) {
    console.log('1');
        return next(new AppError('Authorization is inavlid', 401));
    }


    // verify token...

    let decode;

    try {
        decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    }
    catch (err) {
      console.log("1!");
        return next(new AppError('Inavalid Token!', 401));
    }

    // does user exists?

    const currentUser = await User.findById(decode.id);

  if (!currentUser) {
      console.log("1!!");
        return next(new AppError('The user No longer Exist!', 401));
    }

    // does user changedPassword?
  if (currentUser.changedPasswordAfter(decode.iat)) {
       console.log("1!!!");
      return next(
          
           new AppError("User Recently Changed Password! Login Again.", 401)
         );
    }

    req.user = currentUser;
    res.locals.user = currentUser;

    next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const verifyJWT = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      const currentUser = await User.findById(verifyJWT.id);

      if (!currentUser) {
        return next();
      }

      // 5) PASSWORD CHANGED?...
      if (currentUser.changedPasswordAfter(verifyJWT.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      req.active = true;
      return next();
    } catch (err) {
      return next();
    }
  }
  
  
  next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You Do Not Have Permission!", 403));
        }

        next();
    }
};


exports.forgetPassword = catchAsync(async function (req, res, next)
{
    const user = await User.findOne({
        email: req.body.email,
    });
    
    if (!user) {
      return next(new AppError("User Does Not Exist!", 404));
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({
        validateBeforeSave: false,
    });

    const resetURL = `http://localhost:5173/user/reset-password/${resetToken}`;

    // const message = `Forget Password ! , Click below to get resetPassword. ${resetURL}`;

     try {
       await new Email(user, resetURL).sendResetPassword();

       res.status(200).json({
         status: "success",
         message: "Token Sent To Email!",
       });
     } catch (err) {
       user.passwordResetToken = undefined;
       user.passwordResetExpires = undefined;

       await user.save({
         validateBeforeSave: false,
       });

      
       return next(new AppError("Error Sending Email. Try Again Later!", 500));
     }

  res.status(200).json({
    status: 'success',
    verify: true,
    token : resetToken
    })
});

exports.resetPassword = catchAsync(async (req, res, next) => {

  console.log(req.body.params);

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log(hashedToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // console.log(user);
  // 3) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, res, 200);
});


exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (
    !req.body.passwordCurrent ||
    !req.body.password ||
    !req.body.passwordConfirm
  ) {
    return next(
      new AppError(
        "Please provide current password, new password and passwordConfirm.",
        400,
      ),
    );
  }

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

 
  

  // 2) CHECK CURRENT PASSWORD
  const correct = await user.correctPassword(
    req.body.passwordCurrent,
    user.password,
  );

  // 3) WRONG PASSWORD
  if (!correct) {

    return next(new AppError("Your Current Password Is Wrong!", 401));
  }

  if (req.body.passwordCurrent === req.body.password) {
    return next(
      new AppError(
        "New password must be different from your current password.",
        400,
      ),
    );
  }
  // 4) UPDATE PASSWORD
  user.password = req.body.password;

  user.passwordConfirm = req.body.passwordConfirm;

    await user.save();
    

  createSendToken(user, res, 200);
});

exports.logout = (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
  httpOnly: true,
  secure:true,
  sameSite:'lax'
  });

  res.status(200).json({
    status: "success",
  });
};


exports.deleteAccount = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError("Please provide your password.", 400));
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const correct = await user.correctPassword(password, user.password);

  if (!correct) {
    return next(new AppError("Incorrect password.", 401));
  }

  if (user.photo?.publicId) {
    await cloudinary.uploader.destroy(user.photo.publicId);
  }

  await User.findByIdAndDelete(user._id);

  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Account deleted successfully.",
  });
});