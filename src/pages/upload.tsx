import { GetServerSideProps } from "next";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { authanticatedRoute } from "@/utils/authguard";
import { useState } from "react";
import VideoAPI from "@/axios/video";
import { errorToast, successToast } from "@/utils/constants";
import Spinner from "@/components/Spinner";

export const getServerSideProps: GetServerSideProps = authanticatedRoute;

const UploadPage = ({ initialSidebarState }: { initialSidebarState?: boolean }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!title.trim() || !description.trim() || !videoFile || !thumbnailFile) {
      errorToast("All fields are required");
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("videoFile", videoFile);
    form.append("thumbnailFile", thumbnailFile);
    VideoAPI.publishVideo(form)
      .then((res) => {
        if (res.statusCode === 200) successToast("Video uploaded successfully");
      })
      .catch((err) => {
        errorToast("Upload failed");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Main
      initialSidebar={Boolean(initialSidebarState)}
      meta={<Meta title="Upload - Nextube" description="Upload - Nextube" />}
    >
      <div className="max-w-2xl w-full mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Upload Video</h1>
        <input
          className="bg-transparent border border-dark-50 rounded-md px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="bg-transparent border border-dark-50 rounded-md px-3 py-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Video File</label>
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Thumbnail File</label>
          <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
        </div>
        <button
          onClick={onSubmit}
          disabled={loading}
          className={`bg-logoRed px-4 py-2 rounded-md ${loading && "opacity-60 cursor-not-allowed"}`}
        >
          {loading ? <Spinner /> : "Upload"}
        </button>
      </div>
    </Main>
  );
};

export default UploadPage;