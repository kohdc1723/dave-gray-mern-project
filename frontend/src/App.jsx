import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout, Public, DashLayout } from "./components";
import { Login, Welcome, PreFetch, PersistLogin, RequireAuth } from "./features/auth/authComponents";
import { NotesList, EditNote, NewNote } from "./features/notes/notesComponents";
import { UsersList, EditUser, NewUserForm } from "./features/users/usersComponents";
import useTitle from "./hooks/useTitle";
import ROLES from "./config/roles";

const App = () => {
    useTitle("TechNotes");

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route index element={<Public />} />
                <Route path="login" element={<Login />} />

                {/* protected routes */}
                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                        <Route element={<PreFetch />}>
                            <Route path="dash" element={<DashLayout />}>
                                {/* welcome */}
                                <Route index element={<Welcome />} />

                                {/* users routes */}
                                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                                    <Route path="users">
                                        <Route index element={<UsersList />} />
                                        <Route path=":id" element={<EditUser />} />
                                        <Route path="new" element={<NewUserForm />} />
                                    </Route>
                                </Route>

                                {/* notes routes */}
                                <Route path="notes">
                                    <Route index element={<NotesList />} />
                                    <Route path=":id" element={<EditNote />} />
                                    <Route path="new" element={<NewNote />} />
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default App;