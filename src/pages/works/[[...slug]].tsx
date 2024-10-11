import * as Modal from "@/components/modal";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div className="grid grid-cols-3 gap-24 p-32">
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <Modal.Root id="superpower" path="/works">
        <Modal.Trigger className="relative isolate flex h-72 w-72 rounded-[32px] bg-white">
          <Modal.Item
            id="superpower"
            className="h-full w-full rounded-[32px] bg-[#FFBEE8] p-4"
          />
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Background />
          <Modal.Content className="relative isolate flex w-[1016px] items-center rounded-[40px] bg-white p-8">
            <Modal.Item
              id="a"
              className="h-[597px] w-[597px] rounded-3xl bg-[#FFBEE8]"
            />
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <div className="h-72 w-72 bg-red-300" />
      <Modal.Root id="scroll" path="/works">
        <Modal.Trigger className="relative isolate flex h-72 w-72 rounded-[32px] bg-white">
          <Modal.Item
            id="scroll"
            className="h-full w-full rounded-[32px] bg-[#FFBEE8] p-4"
          />
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Background />
          <Modal.Content className="relative isolate flex w-[1016px] items-center rounded-[40px] bg-white p-8">
            <Modal.Item
              id="a"
              className="h-[597px] w-[597px] rounded-3xl bg-[#FFBEE8]"
            />
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>
    </div>
  );
}
