import { makeAutoObservable } from "mobx";
import AuthService from "./api.auth.js";

export class AuthStore {
    isAuth = false;
    isAuthInProgress = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    async login(username, password) {
        this.isAuthInProgress = true;
        try {
            const resp = await AuthService.login(username, password);
            console.log("TOKEN STORE: ", resp);
            localStorage.setItem("token", resp.data.accessToken);
            this.isAuth = true;

        } catch (err) {
            console.log("login error \n", err);
        } finally {
            this.isAuthInProgress = false;
        }
    }

    async checkAuth() {
        this.isAuthInProgress = true;
        try {
            this.isAuth = true;
        } catch (err) {
            console.log("check auth error \n", err);
        } finally {
            this.isAuthInProgress = false;
        }
    }

    async logout() {
        this.isAuthInProgress = true;
        try {
            await AuthService.logout();
            this.isAuth = false;
            localStorage.removeItem("token");
        } catch (err) {
            console.log("logout error");
        } finally {
            this.isAuthInProgress = false;
        }
    }

}

export default new AuthStore();