import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(null);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        //token expires in an hour:
        const tokenExpirationD =
            expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationD);
        //to keep login after page reloads
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationD.toISOString(),
            })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem("userData");
    }, []);

    useEffect(() => {
        //handling sing-in case, logout after token expires:
        if (token && tokenExpirationDate) {
            //to get a time in milliseconds:
            const remainingTime =
                tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.token,
                new Date(storedData.expiration)
            );
        }
    }, [login]);

    return { token, login, logout, userId };
};
