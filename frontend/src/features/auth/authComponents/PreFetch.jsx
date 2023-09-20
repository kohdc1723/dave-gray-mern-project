import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import store from "../../../app/store";
import usersApiSlice from "../../users/usersApiSlice";
import notesApiSlice from "../../notes/notesApiSlice";

const PreFetch = () => {
    useEffect(() => {
        console.log("subscribe");
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());
        const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());

        return () => {
            console.log("unsubscribe");
            users.unsubscribe();
            notes.unsubscribe();
        };
    }, []);

    return <Outlet />;
};

export default PreFetch;