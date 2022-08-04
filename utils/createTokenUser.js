const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    email: user.email,
    jobTitle: user.jobTitle,
    team: user.team,
    department: user.department,
    location: user.location,
  };
};

module.exports = createTokenUser;
