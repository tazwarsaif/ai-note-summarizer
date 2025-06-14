import { useEffect, useState } from "react";
import Header from "../layout/Header";
import Video from "../layout/Video";

const Login = () => {
    const [text, setText] = useState("");
    const fullText =
        "Welcome To the AI notes Summarizer. You need to sign in first.";

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, index + 1));
            index++;
            if (index === fullText.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Header title={"Login Page"} />
            <Video />

            <div className="flex flex-col justify-center items-center min-h-screen w-full px-4">
                <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-lg w-full max-w-lg text-center space-y-6">
                    <div className="text-xl sm:text-2xl h-20">{text}</div>
                    <button
                        onClick={() =>
                            (window.location.href = "/auth/google/redirect")
                        }
                        className="btn btn-error hover:text-white w-full sm:w-auto px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                    >
                        <img
                            src="/google-svgrepo-com.svg"
                            alt="Google"
                            className="inline-block w-6 h-6 mr-2 align-middle"
                        />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </>
    );
};

export default Login;
