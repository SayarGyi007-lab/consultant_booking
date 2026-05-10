import { useChatWidget } from "../../../hooks/useChat";
import ChatButton from "../ChatButton";
import ChatBox from "../../../components/user/ChatBox";

export default function ChatWidget() {
  const { open, toggle, close } = useChatWidget();

  return (
    <>
      {open && <ChatBox onClose={close} />}
      <ChatButton onClick={toggle} />
    </>
  );
}