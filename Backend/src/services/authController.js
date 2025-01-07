import bcrypt from "bcrypt";
const hashPassword = async (password) => {
  console.log("admin password is :", password);
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(`error while hasing the password😒😒`);
  }
};

export default hashPassword;
