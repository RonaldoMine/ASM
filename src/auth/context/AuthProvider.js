import {createContext, useState} from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
    let signIn = (newAuth) => {
        setAuth(newAuth)
        localStorage.setItem("auth", JSON.stringify(newAuth));
    };

    let signOut = () => {
        setAuth({});
        localStorage.removeItem("auth")
    };

    return (
        <AuthContext.Provider value={{auth, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;