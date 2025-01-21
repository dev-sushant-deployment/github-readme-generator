"use server";

import { db } from "@/lib/db";
import axios from "axios";
import jwt from "jsonwebtoken";

export const validatePAT = async (access_token: string) => {
  if (!access_token) return { valid : false };
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  const { username, pat } = jwt.verify(access_token, process.env.JWT_SECRET) as { username: string, pat: string };
  if (!username || !pat) return { valid : false };
  try {
    const { data } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${pat}`
      }
    });
    if (data.login === username) return {
      valid : true,
      username,
    };
    return { valid : false };
  } catch  {
    return { valid : false };
  }
}

export const connectGithub = async (username: string, pat: string, email: string) => {
  // console.log("connectGithub", username, pat, email);
  username = username.trim();
  pat = pat.trim();
  email = email.trim();
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  const access_token = jwt.sign({ username, pat }, process.env.JWT_SECRET);
  const { valid, username: patUsername } = await validatePAT(access_token);
  if (!valid || patUsername !== username) return {
    access_token: null,
    error: "Invalid Username or Personal Access Token"
  };
  try {
    const alreadyExists = await db.user.findFirst({
      where: {
        username
      }
    });
    if (!alreadyExists) {
      await db.user.create({
        data: {
          username,
          pat,
          email
        }
      });
    }
    return {
      access_token
    };
  } catch (error) {
    console.log("error", error);
    return {
      access_token: null,
      error: "Failed to connect to Github. Please try again later."
    };
  }
}