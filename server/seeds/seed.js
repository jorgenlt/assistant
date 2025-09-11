// Importing models for seeding
import User from "../models/User.js";

// Importing seed data
import { users } from "./seedData.js";

export const seed = () => {
  User.insertMany(users)
    .then(() => {
      console.log("Seeding users completed");
    })
    .catch((error) => {
      console.error(error);
    });
};
