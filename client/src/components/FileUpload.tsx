import React, {useState} from "react";
import axios from "axios";
import type { FileUploadProps } from "../utils/types";

const FileUpload: React.FC<FileUploadProps> = ({onSigned}) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSuccess(null);
        setFile(null);
        onSigned("");
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            setError("Please choose a PDF file.");
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            setError("Max file size is 20 MB.");
            return;
        }
        setFile(file);
    };

    const handleSignPDF = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        const data = new FormData();
        data.append("file", file);
       
        try {
        const res = await axios.post('/api/signpdf', data, {
            responseType: 'blob',
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        const blob = new Blob([res.data], { type: 'application/pdf' })

        const url = URL.createObjectURL(blob)
        setSuccess("PDF signed successfully!");
        onSigned(url)
        } catch (e: unknown) {
                if (e instanceof Error) {
                setError(e.message)
            } else {
                setError(String(e) || "Failed to sign PDF. Please try again.")
            }
        } finally {
        setLoading(false)
        }
    };

    return(
        <div className="w-full md:w-1/3 space-y-4" id="pdf-signer-upload-section">
            { /*Button to upload file from device*/ }
            <div id="pdf-signer-dropzone"
                className="relative w-full cursor-pointer rounded-xl border-2
                border-dashed border-sky-500 bg-white p-4
                text-center font-medium text-sky-500"
            >
                <span>{file ? file.name : "Click to upload PDF"}</span>
                <input
                id="file"
                type="file"
                accept="application/pdf"
                onChange={handleFileInput}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer" 
                aria-label="Upload PDF"
                />
            </div>
            { /*Button to upload file on server*/ }
            <button
                id="pdf-signer-upload-button"
                onClick={handleSignPDF}
                disabled={!file || loading}
                className="w-full rounded-xl bg-sky-500 
                px-6 py-3 text-white font-semibold shadow 
                enabled:opacity-100 disabled:opacity-50"
            >
                {loading ? "Signing PDF..." : "Upload & Sign PDF"}
            </button>

            {error && (
                <p className="text-sm text-red-600 p-2">
                {error}
                </p>
            )}
            {success && (
                <p className="text-sm text-sky-600 p-2">
                {success}
                </p>
            )}
            <p className="text-sm text-gray-500">
                Upload a PDF file max size 20 MB to 
                sign it with a digital signature.
            </p>
        </div>
    );
}

export default FileUpload;