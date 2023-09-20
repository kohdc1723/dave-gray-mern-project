import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout, Public, DashLayout } from "./components";
import { Login, Welcome, PreFetch } from "./features/auth/authComponents";
import { NotesList, EditNote, NewNoteForm } from "./features/notes/notesComponents";
import { UsersList, EditUser, NewUserForm } from "./features/users/usersComponents";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route index element={<Public />} />
                <Route path="login" element={<Login />} />

                {/* protected routes */}
                <Route element={<PreFetch />}>
                    <Route path="dash" element={<DashLayout />}>
                        {/* welcome */}
                        <Route index element={<Welcome />} />

                        {/* users routes */}
                        <Route path="users">
                            <Route index element={<UsersList />} />
                            <Route path=":id" element={<EditUser />} />
                            <Route path="new" element={<NewUserForm />} />
                        </Route>

                        {/* notes routes */}
                        <Route path="notes">
                            <Route index element={<NotesList />} />
                            <Route path=":id" element={<EditNote />} />
                            <Route path="new" element={<NewNoteForm />} />
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default App;