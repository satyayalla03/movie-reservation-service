import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// ------------------ Get All Users ------------------
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully"));
});


// ------------------ Promote User to Admin ------------------
export const promoteToAdmin = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.role = "admin";
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, `User ${user.email} promoted to admin`));
});
