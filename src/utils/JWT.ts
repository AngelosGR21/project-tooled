import { sign, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { UserDetails } from "./user.types";

dotenv.config({
    path: `${__dirname}/../../.env.keys`
});

export function generateToken(userDetails: UserDetails) {

    const payload = userDetails;

    const privateKey = `${process.env.TEST_KEY}`;

    const signInOptions: SignOptions = {
        algorithm: "HS256",
        expiresIn: "24h",
    }
    return sign(payload, privateKey, signInOptions);
}