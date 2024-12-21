import { instance } from "./api.config.ts";

export default class AuthService {

    login (username, password) {
        return instance.post("/auth/sign-in", {username, password});
    }

    refreshToken() {
        return instance.get("/api/refresh");
    }

    logout() {
        return instance.post("/api/logout")
    }

}