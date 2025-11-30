import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// ---------------------- REGISTER USER ----------------------
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "regular_user"
    });

    if (!user) {
        throw new ApiError(500, "Error creating user");
    }

    // 5. Remove password from response
    const createdUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});


// ---------------------- LOGIN USER ----------------------
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // 2. Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError(404, "Invalid credentials");
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    // 4. Generate token
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return res.status(200).json(
        new ApiResponse(200, { token }, "Logged in successfully")
    );
});
