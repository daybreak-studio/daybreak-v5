import * as Modal from "@/components/modal";

export default function WorksPage() {
  return (
    <div className="grid grid-cols-3 gap-24 p-32">
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />

      <Modal.Root id="a" path="/works">
        <Modal.Trigger
          className="relative isolate flex h-72 w-72 overflow-hidden bg-white"
          style={{ borderRadius: "32px" }}
        >
          <Modal.Item
            id="a"
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
              id="a"
              className="h-[597px] w-[597px] rounded-3xl bg-[#FFBEE8]"
            />
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root id="b" path="/works">
        <Modal.Trigger
          className="relative isolate flex h-72 w-72 overflow-hidden bg-white"
          style={{ borderRadius: "32px" }}
        >
          <Modal.Item
            id="b"
            className="h-full w-full rounded-[32px] bg-[#FFBEE8] p-4"
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
              id="b"
              className="h-[597px] w-[597px] rounded-3xl bg-[#FFBEE8]"
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
