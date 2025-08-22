export type FileViewerProps = {
  signedUrl: string | null;
};

export type FileUploadProps = {
    onSigned: (url: string) => void;
};

