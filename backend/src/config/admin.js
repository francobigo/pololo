import bcrypt from "bcrypt";

export const adminUser = {
  email: "admin@pololo.com",
  passwordHash: await bcrypt.hash("admin123", 10),
};
