import * as functions from "firebase-functions";
import { admin } from "../firebaseInit";
import axios from "axios";

const REGION = "asia-northeast3";
const kakaoRequestMeUrl = "https://kapi.kakao.com/v2/user/me";

/**
 * requestMe - Returns user profile from Kakao API
 *
 * @param  {string} kakaoAccessToken Access token retrieved by Kakao Login API
 * @return {Promise<string>}      User profile response in a promise
 */
async function fetchKakaoApi(kakaoAccessToken: string): Promise<KakaoProfile> {
    console.log("Requesting user profile from Kakao API server.");
    const config = {
        method: "GET",
        headers: { "Authorization": "Bearer " + kakaoAccessToken },
        url: kakaoRequestMeUrl,
    };
    const response = await axios(config);
    return response.data;
};

/**
 * updateOrCreateUser - Update Firebase user with the give email, create if
 * none exists.
 *
 * @param  {string} userId        user id for app
 * @param  {string} email         user"s email address
 * @param  {string} displayName   user"s name
 * @return {Promise<admin.auth.UserRecord>} Firebase user record in a promise
 */
async function updateOrCreateUser(userId: string, email: string | undefined | null, displayName: string | undefined | null): Promise<admin.auth.UserRecord> {
    const updateParams = {
        email: email || "",
    };
    try {
        const userRecord = await admin.auth().updateUser(userId, updateParams);
        return userRecord;
    } catch (error) {
        console.log("updateOrCreateUser Error ", error)
        if ((error as any).code === "auth/user-not-found") {
            console.log("error code: auth/user-not-found")
            
            const createParams = {
                email: email || "",
                uid: userId,
                displayName: displayName || "",
            };
        
            return admin.auth().createUser(createParams);
        }
        throw error;
    }
};

/**
 * createFirebaseToken - returns Firebase token using Firebase Admin SDK
 *
 * @param  {string} kakaoAccessToken access token from Kakao Login API
 * @return {Promise<string>}                  Firebase token in a promise
 */
async function createFirebaseToken(kakaoAccessToken: string): Promise<string> {
    try {
        const response: KakaoProfile = await fetchKakaoApi(kakaoAccessToken);
        console.log(response);
        const userId = `kakao:${response.id}`;
        if (!userId) {
            throw new functions.https.HttpsError("invalid-argument", "Not response: Failed get userId");
        }

        let nickname: string | null = null;
        let email: string | null = null;
        if (response.properties) {
            nickname = response.properties.nickname || null;
        }
        if (response.kakao_account) {
            email = response.kakao_account.email || null;
        }
        const userRecord = await updateOrCreateUser(userId, email, nickname);
        const firebaseToken = await admin.auth().createCustomToken(userRecord.uid);
        return firebaseToken;
    } catch (error) {
        throw new functions.https.HttpsError("internal", "Error creating Firebase token. 1", error);
    }
};

export const kakaoCustomAuth = functions
.runWith( {timeoutSeconds: 60 })
.region(REGION)
.https
.onCall(async (data) => {
    const token: string = data.token;
    if (!(typeof token === "string") || token.length === 0) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with " +
            "one arguments containing the token to add.");
    }

    try {
        const firebaseToken = await createFirebaseToken(token);
        return { "custom_token": firebaseToken };
    } catch (error) {
        throw new functions.https.HttpsError("internal", "Error creating Firebase token.", error);
    }
});

