import { generateToken } from "../utils/JWT";
import bcrypt from "bcryptjs";
import { LoginUser, CreatingUser } from "../types/user.types";
import { translatePostcodeToCoordinates } from "../utils/postcodeAPI";
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


export const insertUser = async (user: CreatingUser) => {
    const { username, postcode, name, avatar, password } = user;
    const createUserQuery = `INSERT INTO users(username, name, lat, long, avatar, password)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *`
    const createUserValues = [username, name]

    const coordinates = await translatePostcodeToCoordinates(postcode);
    const { lat, long } = coordinates;
    createUserValues.push(lat, long)

    // AVATAR functionality here....
    createUserValues.push("");

    const hashPassword = await bcrypt.hash(password, 10);
    createUserValues.push(hashPassword);

    let response = await db.query(createUserQuery, createUserValues);

    const userDetails = { ...response.rows[0] };
    delete userDetails.password;
    return generateToken(userDetails);
}