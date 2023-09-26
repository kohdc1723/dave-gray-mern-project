import { Link } from "react-router-dom";

const Public = () => {
    return (
        <section className="public">
            <header className="public-header">
                <h1 className="public-header-title">To-Do Note App</h1>
                <Link to="/login">Login</Link>
            </header>
            <main className="public-main">
                <h4>This app is developed with the purpose of practicing basic CRUD functionalities and JWT authentication.</h4>
            </main>
            <footer className="public-footer">
                Created in September 2023 by kohdc
            </footer>
        </section>
    );
};

export default Public;