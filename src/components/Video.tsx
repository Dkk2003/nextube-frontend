import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function VideoComponent() {
  return (
    <div className="max-w-[400px] w-full flex-col gap-2.5">
      <div className="max-h-56 max-w-full rounded-lg overflow-hidden">
        <ReactPlayer
          height={225}
          width={"100%"}
          url={"https://www.youtube.com/embed/kbvHM2S2_bk?si=Tf5mV9eq4xWH1M2S"}
          style={{ borderRadius: "24px" }}
        />
      </div>
      <div></div>
    </div>
  );
}
