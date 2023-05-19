import React, { useState } from "react";
import { Modal, Tabs, Textarea, FileInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { PasswordValidate } from "../lib/validate";
import { doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { db, storage } from "../firebase";

function OptionsModal({ opened, close }) {
  const { data: session } = useSession();
  const [isCredentials, setIsCredentials] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [additionalError, setAdditionalError] = useState(null);
  const [userBio, setUserBio] = useState("");

  const CheckProvider = () => {
    if (session?.user.provider == "credentials") {
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
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentpassword: values.currentpassword,
        newpassword: values.newpassword,
        cpassword: values.cpassword,
        email: session?.user.email,
      }),
    };

    await fetch("/api/changepassword", options)
      .then((res) => res.json())
      .then((data) => ({ body: data }))
      .then((obj) => setAdditionalError(obj.body));

    if (options && additionalError == null) {
      console.log("Password was successfully changed");
    }
  }

  const changeBio = () => {
    updateDoc(doc(db, "Users", session?.user.uid), {
      bio: userBio,
    });
  };

  const ChangePicture = async (e) => {
    if (e.size / 1000 ** 2 > 25) {
      return alert(
        "Your chosen file is too large, make sure it's less than 25 MB"
      );
    }

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
        await updateDoc(doc(db, "Users", session?.user.uid), {
          profileImg: downloadURL,
        });
      }
    );

    alert("Your profile has been updated!");
  };

  // const handleChangeBio = (e) => {
  //   if (e.which === 13) {
  //     changeBio();
  //   }
  // };

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
              <button
                onClick={UploadProfile}
                class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
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
              {(additionalError?.error ||
                formik.errors.email ||
                formik.errors.password ||
                formik.errors.firstname ||
                formik.errors.cpassword ||
                formik.errors.lastname ||
                formik.errors.username) && (
                <div
                  className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-2"
                  role="alert"
                >
                  <p class="font-bold">Warning</p>
                  <p>{additionalError?.error}</p>
                  <p>{formik.errors.firstname}</p>
                  <p>{formik.errors.lastname}</p>
                  <p>{formik.errors.username}</p>
                  <p>{formik.errors.email}</p>
                  <p>{formik.errors.password}</p>
                  <p>{formik.errors.cpassword}</p>
                </div>
                )}
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
