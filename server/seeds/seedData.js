import { Types } from "mongoose";

const userIds = [new Types.ObjectId(), new Types.ObjectId()];

export const users = [
  {
    _id: userIds[0],
    firstName: "Olivia",
    lastName: "Lopez",
    email: "olivia@gmail.com",
    password: "$2b$10$DkcN3rYRsifuuqdxps4yQ.2sM/2mCCkUjWGp64eaJffRfGYnYBAWm",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    __v: 0,
  },
  {
    _id: userIds[1],
    firstName: "Steve",
    lastName: "Olsen",
    email: "steve@gmail.com",
    password: "$2b$10$DkcN3rYRsifuuqdxps4yQ.2sM/2mCCkUjWGp64eaJffRfGYnYBAWm",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    __v: 0,
  },
];

