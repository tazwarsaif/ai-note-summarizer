import { useEffect, useState } from "react";
import Header from "../layout/Header";
import Navbar from "../layout/Navbar";
import Video from "../layout/Video";

const CreateNote = () => {
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [summary, setSummary] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [pdfgen, setPdfgen] = useState(false);

    const validateForm = () => {
        const errors = {};

        if (!content.trim() || content.length < 80) {
            errors.content =
                "Content is required and must be at least 80 characters.";
        }

        return errors;
    };
    const generatepdf = async () => {
        try {
            // Create a temporary form element
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("summary", summary);

            // Submit to the PHP endpoint
            const response = await fetch("/pdf-generator.php", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to generate PDF");
            }

            // Get the PDF blob
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const dateStr = new Date().toISOString().slice(0, 10);
            a.download = `${dateStr}-${title || "note"}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PDF generation error:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            console.log(errors);
            setLoading(false);
            setSummary("");
            return;
        }
        const newTitle = title.trim() || "Undefined Title";
        const formData = { title: newTitle, content };
        console.log("Title:", newTitle);
        console.log("Content:", content);
        try {
            const response = await fetch("/api/summarize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                setLoading(false);
                setFormErrors({
                    content: "Failed to generate summary. Please try again.",
                });
                throw new Error("Failed to create note.");
            }
            const data = await response.json();
            console.log("Note created successfully:", data);
            setLoading(false);
            setSummary(data.summary);
            formData.summary = data.summary;
            const response2 = await fetch("/api/create-note", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });
            if (!response2.ok) {
                setLoading(false);
                setFormErrors({
                    content: "Failed to saving summary. Please try again.",
                });
                throw new Error("Failed to create note.");
            }
            const data2 = await response2.json();
            console.log("Note created successfully:", data2);
            setSaved(true);
            setPdfgen(true);
        } catch (error) {
            setFormErrors({
                error: "Internal Server Error. Please try again later.",
            });
            console.error("Error in handleSubmit:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!summary) return;

        let i = 0;
        const typing = () => {
            if (i < summary.length) {
                const char = summary.charAt(i);
                setText((prev) => prev + char);
                i++;

                // Pause longer for punctuation
                const delay = [".", "!", "?", ","].includes(char) ? 50 : 7;
                timeout = setTimeout(typing, delay);
            }
        };

        let timeout = setTimeout(typing, 7);

        return () => {
            clearTimeout(timeout);
            setText("");
        };
    }, [summary]);
    return (
        <>
            <Header title={"Create Note"} />
            <Navbar />
            <Video />
            <div className="flex flex-col items-center min-h-screen w-full px-4">
                <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-lg w-full text-center space-y-6 mt-25 mb-20">
                    {Object.keys(formErrors).length > 0 && (
                        <div role="alert" className="alert alert-error">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 shrink-0 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <ul>
                                {Object.entries(formErrors).map(
                                    ([key, value]) => (
                                        <li key={key}>{value}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                    <div className="mb-4 flex flex-col text-left">
                        <div className="flex items-center justify-between mb-2">
                            <label
                                htmlFor="title"
                                className="block text-lg font-semibold mb-2"
                            >
                                Title:
                            </label>
                            {saved && (
                                <div className="badge badge-success">
                                    ✔Saved
                                </div>
                            )}
                        </div>

                        <input
                            type="text"
                            value={title !== "" ? title : ""}
                            onChange={(e) => setTitle(e.target.value)}
                            id="title"
                            className="border border-gray-300 p-2 rounded-lg w-full"
                            placeholder="Enter note title"
                        />
                    </div>
                    <div className="mb-4 flex flex-col text-left">
                        <label
                            htmlFor="content"
                            className="block text-lg font-semibold mb-2"
                        >
                            Content:
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                            }}
                            className="border border-gray-300 p-2 rounded-lg w-full"
                            placeholder="Enter note content"
                            rows="5"
                        ></textarea>
                    </div>
                    <div className="mb-4 flex flex-col text-left">
                        <label
                            htmlFor="summary"
                            className="block text-lg font-semibold mb-2"
                        >
                            Generated Summary:
                        </label>
                        {loading ? (
                            <span className="loading loading-infinity loading-lg"></span>
                        ) : summary ? (
                            <p>{text}</p>
                        ) : (
                            <p className="text-gray-600 italic">
                                Click Generate Summary to get summary
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col justify-end sm:flex-row gap-4">
                        <button
                            className="btn btn-secondary hover:text-white w-full sm:w-auto rounded-lg shadow-md hover:bg-pink-600 transition-colors duration-300 px-6 py-3"
                            onClick={handleSubmit}
                        >
                            Generate Summary
                        </button>
                        {pdfgen && (
                            <button
                                onClick={generatepdf}
                                className="btn btn-primary hover:text-white w-full sm:w-auto rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 px-6 py-3"
                            >
                                View Pdf
                            </button>
                        )}
                        {!pdfgen && (
                            <button
                                disabled
                                className="btn btn-primary hover:text-white w-full sm:w-auto rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 px-6 py-3"
                            >
                                View Pdf
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateNote;
