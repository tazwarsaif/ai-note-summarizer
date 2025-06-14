import { router } from "@inertiajs/react";
const Navbar = () => {
    return (
        <>
            <div className="fixed navbar text-white bg-white/20 backdrop-blur-sm shadow-sm z-50 p-5">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl" href="/dashboard">
                        AI Note Summarizer
                    </a>
                </div>
                <div className="flex justify-between space-x-3">
                    <a
                        className="btn btn-ghost bg-info hover:bg-sky-500 text-xl"
                        href="/dashboard"
                    >
                        <img src="/home.svg" alt="Home" className="w-6 h-6" />
                    </a>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            router.post("/logout");
                        }}
                        className="btn btn-error hover:text-white flex items-center space-x-2"
                    >
                        <img
                            src="/logout.svg"
                            alt="Logout"
                            className="w-5 h-5"
                        />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Navbar;
