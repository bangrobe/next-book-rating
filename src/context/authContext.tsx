import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { useRouter } from "next/router";
export interface authContextType {
    user: User | null,
    isLoggedIn: boolean,
    logout(): void,
}

type User = {
    id: number | string, 
    email: string,
    isAdmin: boolean,
    username: string,
}

type Props = {
    children: ReactNode
}
const authContextDefaultValues = {
    user: null,
    isLoggedIn: false,
    logout: ()=> {}
}
export const AuthContext = createContext<authContextType>(authContextDefaultValues);

const AuthContextProvider = ({ children }: Props) => {
    const router = useRouter();
    const [user, setUser ] = useState(null);
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)

    const logout = () => {
        Cookies.remove('authToken');
        setIsLoggedIn(false);
        setUser(null);
        router.push('/login')
    }
    const userAuthentication =  async() => {
        try {
            const authToken = Cookies.get('authToken');
            if(authToken) {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                })
                setUser(data);
                setIsLoggedIn(true)
            }
        } catch (error) {
            setUser(null);
            setIsLoggedIn(false)
        }
    }

    useEffect(()=> {
        userAuthentication()
    }, []);

    const providerValue = useMemo(()=> {
        return {
            user, isLoggedIn, setUser, setIsLoggedIn, logout
        }
    }, [user, isLoggedIn, setUser, setIsLoggedIn, logout])
    return (
        <AuthContext.Provider value={providerValue}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;