import {FileUploader} from "@/components/FileUploader";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">File Upload Demo</h1>
      <FileUploader />
    </div>
  </main>
  );
}
