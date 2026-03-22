import { useEffect, type ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";

interface props {
    children: ReactNode,
    adminOnly?: boolean
}

const Protect = ({ children, adminOnly = false }: props) => {

    const userInfo = useSelector((state: RootState) => state.auth.userInfo)
    const navigate = useNavigate()

    useEffect(() => {
        if (!userInfo) {
            navigate("/", { replace: true });
        }
        else if (adminOnly && userInfo.role !== "ADMIN") {
            navigate("/home", { replace: true });
        }
    }, [userInfo, adminOnly, navigate])

    return (
        <>{children}</>
    )
}

export default Protect
