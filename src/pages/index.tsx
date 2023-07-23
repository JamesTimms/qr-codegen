import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import clsx from "clsx";
import { useQRCode } from "next-qrcode";

// interface DataDisplayProps {
//   data: Example[];
// }

// function DataDisplay({ data }: DataDisplayProps) {
//   return (
//     <div className="flex flex-col items-center gap-2">
//       <p className="text-2xl text-white">
//         {data ? data.length : "Loading tRPC query..."}
//       </p>
//       {[...data].map((item: Example, index: number) => (
//         <p key={index} className="text-2xl text-white">
//           {item.id.toString()}
//         </p>
//       ))}
//     </div>
//   );
// }

// function generateQRCodeUrl(url: string, size: number): string {
//   const encodedUrl = encodeURIComponent(url);
//   return `https://api.qrserver.com/v1/create-qr-code/?data=${encodedUrl}&amp;size=${size}x${size}`;
// }

function QRCodeImage({ url, size }: { url: string; size: number }) {
  const normalizedUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  const encodedUrl = encodeURI(normalizedUrl);

  return (
    <div className="flex flex-col items-center gap-2 rounded p-4">
      <p className="p-1 text-2xl text-white">Scan me</p>
      <QRCode url={encodedUrl} size={size} />
      <a href={encodedUrl} className="p-1">
        <p className="p-2 text-xl text-white">🔗 {url}</p>
      </a>
    </div>
  );
}

function QRCode({ url, size }: { url: string; size: number }) {
  const { Canvas } = useQRCode();

  return (
    <Canvas
      text={url}
      options={{
        level: "M",
        margin: 1,
        scale: 4,
        width: size,
        color: {
          dark: "#000",
          light: "#FFF",
        },
      }}
    />
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [isValidURL, setIsValidURL] = useState(true);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUrlValid(url)) {
      setSubmittedUrl(url);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrl(url);
    setIsValidURL(isUrlValid(url));
  };

  const isUrlValid = (url: string): boolean => {
    const urlRegEx = new RegExp(
      `^(?:(?:https?|ftp):\\/\\/)?` + // Protocol
        `(?:\\S+(?::\\S*)?@)?` + // Username and password
        `(?:www\\.)?` + // Subdomain
        `(?:[-\\w.]+?\\.[a-zA-Z]{2,})` + // Domain
        `(?:\\/[\\w.@?^=%&:/~+#-]*)?` + // Path
        `(?:\\?[\\S]*)?` + // Query string
        `(?:\\#[\\S]*)?$`, // Anchor or highlight
      "i"
    );
    return urlRegEx.test(url);
  };

  return (
    <>
      <Head>
        <title>QR Codegen</title>
        <meta name="description" content="QR code generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#3f8a84] to-[#1395a6]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4"
          >
            <input
              type="text"
              id="urlInput"
              placeholder="enter url..."
              value={url}
              onChange={handleChange}
              className={clsx("rounded p-2 text-lg", {
                "border-2 border-red-500 text-red-700": !isValidURL,
              })}
            />
            <button
              type="submit"
              className="rounded bg-slate-700 p-2 text-white"
            >
              Generate QR Code
            </button>
          </form>
          {submittedUrl && <QRCodeImage url={submittedUrl} size={300} />}
        </div>
      </main>
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
