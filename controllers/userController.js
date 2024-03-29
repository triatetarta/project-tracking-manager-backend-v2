const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");
const Token = require("../models/Token");
const cloudinary = require("../utils/cloudinary");

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

// @desc    Get a single user
// @route   GET /api/v1/users/:id
// @access  Private
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

// @desc    Get current user
// @route   GET /api/v1/users/showMe
// @access  Private
const showCurrentUser = async (req, res) => {
  const existingToken = await Token.findOne({ user: req.user.userId });

  if (!existingToken || !existingToken?.isValid) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }

  res.status(StatusCodes.OK).json({ user: req.user });
};

// @desc    Update current user's details
// @route   PATCH /api/users/updateUser
// @access  Private
const updateUser = async (req, res) => {
  const { email, name, jobTitle, team, department, location } = req.body;

  const user = await User.findOne({ _id: req.user.userId });

  if (!user) {
    throw new CustomError.UnauthorizedError("User doesn't exist");
  }

  user.email = email;
  user.name = name;
  user.jobTitle = jobTitle;
  user.team = team;
  user.department = department;
  user.location = location;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// @desc    Update current user's password
// @route   PATCH /api/users/updateUserPassword
// @access  Private
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

// @desc    Update current user's profile pic
// @route   PATCH /api/users/uploadImage
// @access  Private
const uploadImage = async (req, res) => {
  const { image } = req.body;

  if (!image) {
    throw new CustomError.BadRequestError("Please select an image");
  }

  const user = await User.findById(req.user.userId);

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.user.userId}`);
  }

  let updatedUser;

  if (user.image !== "") {
    await cloudinary.uploader.destroy(user.image, (err, result) => {
      if (err) {
        console.log(err);
      }

      console.log("Image has been removed from cloudinary");
    });

    const uploadedImage = await cloudinary.uploader.upload(
      image,
      {
        upload_preset: "unsigned_upload",
        allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"],
      },
      (err, result) => {
        if (err) {
          throw new CustomError.BadRequestError("Something went wrong!");
        }

        console.log("image uploaded to cloudinary");
      }
    );

    const updateUser = await User.findOneAndUpdate(
      { _id: req.user.userId },
      { image: uploadedImage.public_id },
      { new: true, runValidators: true }
    );

    updatedUser = updateUser;
  } else {
    const uploadedImage = await cloudinary.uploader.upload(
      image,
      {
        upload_preset: "unsigned_upload",
        allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"],
      },
      (err, result) => {
        if (err) {
          throw new CustomError.BadRequestError("Something went wrong!");
        }

        console.log("image uploaded to cloudinary");
      }
    );
    const updateUser = await User.findOneAndUpdate(
      { _id: req.user.userId },
      { image: uploadedImage.public_id },
      { new: true, runValidators: true }
    );

    updatedUser = updateUser;
  }

  const tokenUser = createTokenUser(updatedUser);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  uploadImage,
};
