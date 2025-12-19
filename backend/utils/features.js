export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = user.generateToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
    secure: process.env.NODE_ENV !== "Development",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user,
  });
};

