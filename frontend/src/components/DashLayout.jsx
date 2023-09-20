import { Outlet } from "react-router-dom";
import { DashHeader, DashFooter } from "./";

const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div className="dash-container">
                <Outlet />
            </div>
            <DashFooter />
        </>
    );
};

export default DashLayout;