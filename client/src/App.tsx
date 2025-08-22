import { useState } from "react";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import FileViewer from "./components/FileViewer";

export default function App() {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col md:flex-row gap-6 p-4">
        <FileUpload onSigned={(url:string | null) => setSignedUrl(url)} />
        <FileViewer signedUrl={signedUrl} />
      </main>
    </div>
  );
}
