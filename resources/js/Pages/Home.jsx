import { useEffect, useState } from "react";
import Header from "../layout/Header";
import Navbar from "../layout/Navbar";
import Video from "../layout/Video";
const Home = ({ user, notes, token }) => {
    if (!localStorage.getItem("token") && !token) {
        window.location.href = "/login";
    }
    if (!localStorage.getItem("token") && token) {
        localStorage.setItem("token", token);
    }

    const [text, setText] = useState("");
    const fullText = `Welcome, ${user.name}.`;
    console.log("Token:", token);
    const deleteNote = async (noteId) => {
        console.log(noteId);
        try {
            const response = await fetch(`/api/notes/${noteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log(response);
            if (!response.ok) {
                throw new Error("Failed to delete note");
            }
            window.location.reload();
        } catch (error) {
            console.error("Error deleting note:", error);
            alert("Failed to delete note.");
        }
    };
    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, index + 1));
            index++;
            if (index === fullText.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, []);
    // This component represents the home page of the application.
    // It displays a welcome message and a logout button.
    console.log("User:", user);
    console.log("Notes:", notes);
    return (
        <>
            <Header title={"Dashboard"} />
            <Navbar />
            <Video />
            <div className="flex flex-col items-center min-h-screen w-full px-4">
                <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-lg w-full text-center space-y-6 mt-25">
                    <h1 className="text-4xl font-bold text-gray-800">{text}</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        This is your AI Note Summarizer Dashboard.
                    </p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-lg w-full text-center space-y-6 mt-10 mb-50">
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center mb-4">
                        <h2 className="font-semibold text-3xl mb-5">
                            Your Notes:
                        </h2>
                        <button
                            onClick={() =>
                                (window.location.href = "/create-note")
                            }
                            className="btn btn-primary hover:text-white w-full sm:w-auto rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 px-6 py-3 mb-5 md:mb-0 -mt-3"
                        >
                            Create New Note
                        </button>
                    </div>
                    <hr className="my-4 mb-4" />
                    {notes && notes.length > 0 && (
                        <div className="mb-4">
                            <ul className="list-inside flex flex-wrap justify-center gap-4">
                                {notes.map((note, index) => (
                                    <li
                                        className="text-gray-700 hover:bg-stone-500 hover:text-white hover:cursor-pointer p-3 rounded-lg text-wrap w-64 text-xl text-start border-2 h-14/13 mb-7"
                                        key={index}
                                    >
                                        <a
                                            href={`/edit-note/${note.id}`}
                                            className="mb-3 text-wrap"
                                        >
                                            <div className="hover:underline text-wrap">
                                                <label
                                                    htmlFor="title"
                                                    className="font-bold"
                                                >
                                                    Title:
                                                </label>{" "}
                                                {note.title} <br />
                                                <label
                                                    htmlFor="content"
                                                    className="font-bold"
                                                >
                                                    Content:
                                                </label>{" "}
                                                {note.content.slice(0, 30)}...{" "}
                                            </div>
                                        </a>

                                        <br />
                                        <div className="flex justify-end text-black">
                                            <button
                                                className="btn btn-error hover:text-white border-1 shadow-2xl"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            `delete-modal-${note.id}`
                                                        )
                                                        .showModal()
                                                }
                                            >
                                                Delete
                                            </button>
                                            <dialog
                                                id={`delete-modal-${note.id}`}
                                                className="modal modal-bottom sm:modal-middle"
                                            >
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg">
                                                        You sure you want to
                                                        delete this note?
                                                    </h3>
                                                    <div className="modal-action">
                                                        <form
                                                            method="dialog"
                                                            className="flex space-x-2"
                                                        >
                                                            {/* if there is a button in form, it will close the modal */}
                                                            <button
                                                                className="btn btn-error hover:text-white"
                                                                onClick={() =>
                                                                    deleteNote(
                                                                        note.id
                                                                    )
                                                                }
                                                            >
                                                                Yes
                                                            </button>
                                                            <button className="btn">
                                                                No
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </dialog>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
