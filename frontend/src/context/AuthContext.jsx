import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const username = localStorage.getItem("username");

        if (token) {
            setUser({ token, role, username });
        }
        setLoading(false);
    }, []);

    const login = (token, role, username) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);
        setUser({ token, role, username });

        if (role === 'ADMIN') {
            navigate('/admin/dashboard');
        } else {
            navigate('/user/dashboard');
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
