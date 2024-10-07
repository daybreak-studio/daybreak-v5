import * as Modal from "@/components/modal";

export default function Page() {
  return (
    <div className="grid grid-cols-3 gap-24 p-32">
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />{" "}
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />{" "}
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <Modal.Root
        transition={{
          ease: [0.19, 1, 0.22, 1],
          duration: 1,
        }}
      >
        <Modal.Trigger
          path="downtofile"
          className="relative isolate flex h-72 w-72 overflow-hidden bg-white"
          style={{ borderRadius: "32px" }}
        >
          <Modal.Item
            id="Images"
            className="h-full w-full bg-[#FFBEE8] p-4"
            style={{ borderRadius: "32px" }}
          />
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Background />
          <Modal.Content
            className="relative isolate flex w-[1016px] items-center bg-white p-8"
            style={{
              borderRadius: "40px",
            }}
          >
            <Modal.Item
              id="Images"
              className="h-[597px] w-[597px] bg-[#FFBEE8]"
              style={{ borderRadius: "24px" }}
            />
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
    </div>
  );
}
