import { generateToken } from "../utils/JWT";
import bcrypt from "bcryptjs";
import { LoginUser } from "../utils/user.types";
import db from "../db/connection"

export const verifyUser = async (credentials: LoginUser) => {
    const incorrectCredentials = { status: 400, message: "Username or password is incorrect" }
    const { username, password } = credentials;

    const queryString = `SELECT * FROM users WHERE username = $1`;
    const queryValue = [username];

    const user = await db.query(queryString, queryValue);

    if (user.rowCount) {
        const hash = user.rows[0].password;

        let isPasswordCorrect = await bcrypt.compare(password, hash);

        if (isPasswordCorrect) {
            return generateToken(user.rows[0]);
        } else {
            return Promise.reject(incorrectCredentials);
        }

    } else {
        return Promise.reject(incorrectCredentials)
    }

} 