import React, { useState } from "react";
import { Modal, Tabs, Textarea, FileInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { PasswordValidate } from "../lib/validate";
import {
  addDoc,
  deleteDoc,
  getDocs,
  setDoc,
  doc,
  query,
  collection,
  onSnapshot,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { db, storage } from "../firebase";
import connectMongo from "../database/conn";
import Users from "../model/Schema";
import { hash } from "bcryptjs";

function OptionsModal({ opened, close }) {
  const { data: session } = useSession();
  const [isCredentials, setIsCredentials] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  let userBio = "";

  const CheckProvider = () => {
    if (session.user.provider == "credentials") {
      setIsCredentials(true);
    }
  };

  const formik = useFormik({
    initialValues: {
      currentpassword: "",
      newpassword: "",
      cpassword: "",
    },
    validate: PasswordValidate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit,
  });

  async function onSubmit(values) {
    // const user = await Users.findOne(session.user.email);
    // if (!user) {
    //   console.log("user cant be found");
    // }
    // if (user) {
    //   console.log(user);
    // }
  }

  const BioChange = (e) => {
    userBio = e.target.value;
  };

  const changeBio = () => {
    updateDoc(doc(db, "Users", session.user.uid), {
      bio: userBio,
    });
  };

  const ChangePicture = async (e) => {
    const reader = new FileReader();
    if (e) {
      reader.readAsDataURL(e);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };

    console.log(selectedFile);

  };

  const UploadProfile = async () => {
    const imageRef = ref(storage, `Users/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "Users", session.user.uid), {
          profileImg: downloadURL,
        });
      }
    );
  }

  const handleChangeBio = (e) => {
    if (e.which === 13) {
      changeBio();
    }
  };

  return (
    <Modal opened={opened} onClose={close} withCloseButton={false} size="lg">
      <Tabs color="green" orientation="vertical" defaultValue="gallery">
        <Tabs.List>
          <Tabs.Tab value="bio">Bio</Tabs.Tab>
          <Tabs.Tab value="pfp">Change Profile Picture</Tabs.Tab>
          <Tabs.Tab value="password" onClick={CheckProvider}>
            Change Password
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pfp" pl="xs">
          {isCredentials ? (
            <>
              <p className="text-gray-500 mb-2">Update your profile picture</p>
              <FileInput
                placeholder="Upload your pfp"
                accept="image/png,image/jpeg, image/jpg"
                onChange={ChangePicture}
              />
              <button onClick={UploadProfile} class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Change Picture
              </button>
            </>
          ) : (
            <>
              <h3 className="text-gray-500 text-center flex items-center mt-7">
                Only users with credentials are allowed to change profile
                pictures.
              </h3>
            </>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="password" pl="xs">
          {isCredentials ? (
            <>
              <form
                className="flex flex-col gap-1"
                onSubmit={formik.handleSubmit}
              >
                <input
                  type="password"
                  name="password"
                  placeholder="Current Password"
                  {...formik.getFieldProps("currentpassword")}
                />
                <input
                  type="password"
                  name="confirmpassword"
                  placeholder="New Password"
                  {...formik.getFieldProps("newpassword")}
                />
                <input
                  type="password"
                  name="cpassword"
                  placeholder="Confirm Password"
                  {...formik.getFieldProps("cpassword")}
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-800 rounded"
                >
                  Change Password
                </button>
              </form>
            </>
          ) : (
            <>
              <h3 className="text-gray-500 text-center flex items-center mt-7">
                You don't need to change the password, since you're using Google
                provider.
              </h3>
            </>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="bio" pl="xs">
          <p className="text-gray-500 mb-2">Enter your Bio here</p>
          <Textarea
            placeholder="Your Bio"
            onChange={BioChange}
            onKeyPress={handleChangeBio}
          />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}

export default OptionsModal;
