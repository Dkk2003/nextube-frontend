import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { authanticatedRoute } from "@/utils/authguard";
import VideoAPI from "@/axios/video";
import LikeAPI from "@/axios/like";
import CommentAPI from "@/axios/comment";
import { SubscriptionAPI } from "@/axios/subscriptions";
import VideoDetailType from "@/types/VideoDetailType";
import CommentType from "@/types/CommentType";
import { errorToast, successToast } from "@/utils/constants";
import Spinner from "@/components/Spinner";
import { useUser } from "@/contexts/auth";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export const getServerSideProps: GetServerSideProps = authanticatedRoute;

const WatchPage = ({ initialSidebarState }: { initialSidebarState?: boolean }) => {
  const router = useRouter();
  const { videoId } = router.query as { videoId: string };
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<VideoDetailType | null>(null);
  const [liking, setLiking] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subLoading, setSubLoading] = useState<boolean>(false);

  const ownerId = useMemo(() => (video?.owner as string) || "", [video]);

  useEffect(() => {
    if (!videoId) return;
    setLoading(true);
    VideoAPI.getVideoById(videoId)
      .then((res) => setVideo(res.data as unknown as VideoDetailType))
      .catch(() => errorToast("Failed to load video"))
      .finally(() => setLoading(false));

    CommentAPI.getVideoComments(videoId, 1, 20)
      .then((res) => setComments((res.data as CommentType[]) || []))
      .catch(() => {})
      .finally(() => {});
  }, [videoId]);

  useEffect(() => {
    const initSubStatus = async () => {
      if (!ownerId || !user?._id) return;
      try {
        const res = await SubscriptionAPI.getSubscriber(ownerId);
        const list = (res.data as any[]) || [];
        setIsSubscribed(list.some((s: any) => s._id === user._id));
      } catch {}
    };
    initSubStatus();
  }, [ownerId, user?._id]);

  const handleLike = async () => {
    if (!videoId) return;
    setLiking(true);
    LikeAPI.toggleVideoLike(videoId)
      .then(() => successToast("Toggled like"))
      .catch(() => errorToast("Failed to toggle like"))
      .finally(() => setLiking(false));
  };

  const handleToggleSubscribe = async () => {
    if (!ownerId) return;
    setSubLoading(true);
    const prev = isSubscribed;
    setIsSubscribed(!prev);
    SubscriptionAPI.toggleSubscription(ownerId)
      .then(() => successToast(prev ? "Unsubscribed" : "Subscribed"))
      .catch(() => {
        setIsSubscribed(prev);
        errorToast("Subscription action failed");
      })
      .finally(() => setSubLoading(false));
  };

  const handleAddComment = async () => {
    const value = commentInput.trim();
    if (!value || !videoId) return;
    setCommentLoading(true);
    CommentAPI.addComment(videoId, value)
      .then((res) => {
        setComments((prev) => [res.data as CommentType, ...prev]);
        setCommentInput("");
      })
      .catch(() => errorToast("Failed to add comment"))
      .finally(() => setCommentLoading(false));
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const startEdit = (c: CommentType) => {
    setEditingId(c._id);
    setEditingText(c.content);
  };

  const saveEdit = async (commentId: string) => {
    if (!videoId) return;
    const text = editingText.trim();
    if (!text) return;
    try {
      const res = await CommentAPI.updateComment(videoId, commentId, text);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? ({ ...c, content: text } as CommentType) : c))
      );
      setEditingId(null);
      setEditingText("");
      successToast("Comment updated");
    } catch {
      errorToast("Update failed");
    }
  };

  const removeComment = async (commentId: string) => {
    if (!videoId) return;
    try {
      await CommentAPI.deleteComment(videoId, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      successToast("Comment deleted");
    } catch {
      errorToast("Delete failed");
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      await LikeAPI.toggleCommentLike(commentId);
      successToast("Toggled comment like");
    } catch {
      errorToast("Failed to like comment");
    }
  };

  return (
    <Main
      initialSidebar={Boolean(initialSidebarState)}
      meta={<Meta title="Watch - Nextube" description="Watch - Nextube" />}
    >
      {loading ? (
        <div className="w-full h-[50vh] flex items-center justify-center"><Spinner /></div>
      ) : video ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black/20">
              <ReactPlayer url={video.videoFile} width="100%" height="100%" controls playing={false} />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold">{video.title}</h1>
            <p className="text-sm text-gray-300">{video.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleLike}
                disabled={liking}
                className={`px-4 py-1.5 rounded-md bg-logoRed ${liking && "opacity-60 cursor-not-allowed"}`}
              >
                {liking ? "..." : "Like / Unlike"}
              </button>
              <button
                onClick={handleToggleSubscribe}
                disabled={subLoading}
                className={`px-4 py-1.5 rounded-md bg-white/10 ${subLoading && "opacity-60 cursor-not-allowed"}`}
              >
                {subLoading ? "..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Comments</h2>
              <div className="flex gap-2 mb-4">
                <input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a comment"
                  className="flex-1 bg-transparent border border-dark-50 rounded-md px-3 py-2 outline-none"
                />
                <button
                  onClick={handleAddComment}
                  disabled={commentLoading}
                  className="px-4 py-2 rounded-md bg-logoRed"
                >
                  {commentLoading ? "Posting..." : "Post"}
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {comments.map((c) => (
                  <div key={c._id} className="p-3 rounded-md bg-black/20">
                    <div className="text-sm text-gray-400">
                      {new Date(c.createdAt || "").toLocaleString()}
                    </div>
                    {editingId === c._id ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 bg-transparent border border-dark-50 rounded-md px-3 py-2 outline-none"
                        />
                        <button className="px-3 py-1 bg-logoRed rounded" onClick={() => saveEdit(c._id)}>
                          Save
                        </button>
                        <button
                          className="px-3 py-1 bg-white/10 rounded"
                          onClick={() => {
                            setEditingId(null);
                            setEditingText("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="mt-1">{c.content}</div>
                    )}
                    <div className="flex gap-3 mt-2 text-sm">
                      <button className="opacity-80 hover:opacity-100" onClick={() => likeComment(c._id)}>
                        Like
                      </button>
                      {user?._id && c.owner === user._id && editingId !== c._id && (
                        <>
                          <button className="opacity-80 hover:opacity-100" onClick={() => startEdit(c)}>
                            Edit
                          </button>
                          <button className="opacity-80 hover:opacity-100" onClick={() => removeComment(c._id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">{/* Related or sidebar in future */}</div>
        </div>
      ) : (
        <div>Video not found</div>
      )}
    </Main>
  );
};

export default WatchPage;
