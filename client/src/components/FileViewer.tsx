import React from "react";
import type { FileViewerProps } from "../utils/types";

const FileViewer: React.FC<FileViewerProps> = ({signedUrl}) => {
    return (
        <div className="flex-1 rounded-xl border bg-white p-2 shadow">
            {signedUrl ? (
                <div className="flex flex-col">
                    <div className="h-[60svh] md:h-[70vh]">
                        <embed
                            src={signedUrl}
                            type="application/pdf"
                            className="h-full w-full rounded-lg border"
                        />
                    </div>
                    <div className="flex justify-center">
                        <a
                        href={signedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white border
                        bg-sky-500
                        text-semibold
                        w-1/2 md:w-1/3
                        mt-2
                        text-center p-2 rounded-lg"
                    >
                        Open in new tab
                    </a>
                    </div>
                </div>
            ) : (
            <div className="grid h-[40svh] place-items-center text-gray-500">
                No signed PDF yet
            </div>
            )}
        </div>
    );
}

export default FileViewer;