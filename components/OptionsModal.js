import React, { useState } from "react";
import { Modal, Tabs, Textarea, FileInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { db, storage } from "../firebase";

function OptionsModal({ opened, close }) {
  const { data: session } = useSession();
  // const [selectedFile, setSelectedFile] = useState(null);
  const [userBio, setUserBio] = useState("");

  const changeBio = () => {
    updateDoc(doc(db, "Users", session?.user.uid), {
      bio: userBio,
    });
  };

  // const ChangePicture = async (e) => {
  //   if (e.size / 1000 ** 2 > 25) {
  //     return alert(
  //       "Your chosen file is too large, make sure it's less than 25 MB"
  //     );
  //   }

  //   const reader = new FileReader();
  //   if (e) {
  //     reader.readAsDataURL(e);
  //   }

  //   reader.onload = (readerEvent) => {
  //     setSelectedFile(readerEvent.target.result);
  //   };

  //   console.log(selectedFile);
  // };

  // const UploadProfile = async () => {
  //   const imageRef = ref(storage, `Users/image`);

  //   await uploadString(imageRef, selectedFile, "data_url").then(
  //     async (snapshot) => {
  //       const downloadURL = await getDownloadURL(imageRef);
  //       await updateDoc(doc(db, "Users", session?.user.uid), {
  //         profileImg: downloadURL,
  //       });
  //     }
  //   );

  //   alert("Your profile has been updated!");
  // };

  return (
    <Modal opened={opened} onClose={close} withCloseButton={false} size="lg">
      <Tabs color="green" orientation="vertical" defaultValue="gallery">
        <Tabs.List>
          <Tabs.Tab value="bio">Bio</Tabs.Tab>
          {/* <Tabs.Tab value="pfp">Change Profile Picture</Tabs.Tab> */}
        </Tabs.List>

        {/* <Tabs.Panel value="pfp" pl="xs">
          <p className="text-gray-500 mb-2">Update your profile picture</p>
          <FileInput
            placeholder="Upload your pfp"
            accept="image/png,image/jpeg, image/jpg"
            onChange={ChangePicture}
          />
          <button
            onClick={UploadProfile}
            class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Change Picture
          </button>
        </Tabs.Panel> */}

        <Tabs.Panel value="bio" pl="xs">
          <p className="text-gray-500 mb-2">Enter your Bio here</p>
          <Textarea
            placeholder="Your Bio"
            onChange={(e) => setUserBio(e.target.value)}
            maxLength={150}
          />
          <button
            onClick={changeBio}
            class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Change Bio
          </button>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}

export default OptionsModal;
