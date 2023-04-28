import React, { useState, useEffect } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";

function EditModal({
  opened,
  close,
  id,
  username,
  userImg,
  img,
  caption,
  timeStamp,
  fileType,
}) {
  const [newCaption, setNewCaption] = useState(caption);
  const theme = useMantineTheme();

  const Edit = async () => {
    return await updateDoc(doc(db, "Posts", id), {
      caption: newCaption,
    });
  };

  return (
    <Modal
      size="md"
      title="Edit Post"
      opened={opened}
      onClose={close}
      centered
      overlayProps={{
        opacity: 0.55,
        blur: 5,
        bg: 'dark'
      }}
    >
      <input
        className="w-full"
        placeholder={caption}
        type="text"
        onChange={(e) => setNewCaption(e.target.value)}
      />
      <button
        onClick={() => Edit()}
        class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Update
      </button>
    </Modal>
  );
}

export default EditModal;
