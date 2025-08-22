import React from "react";

export const Header: React.FC = () => {
    return(
    <header className="bg-white p-4 text-center text-lg font-semibold">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center 
          rounded-xl bg-sky-500 text-white font-bold">PS</span>
          <h1 className="text-xl font-semibold">PDF Signer</h1>
        </div>
    </header>)
}

export default Header;