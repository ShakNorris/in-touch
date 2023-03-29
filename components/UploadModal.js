import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { BsCamera } from "react-icons/bs";
import { db, storage } from "../firebase";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { Modal } from "@mantine/core";

function UploadModal() {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const chooseFileRef = useRef(null);
  const captionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const UploadPost = async () => {
    if (loading) return;

    setLoading(true);

    // 1) create a post and add to firestore 'posts collection'
    // 2) Get post ID for the newly created post
    // 3) Upload the image to firebase storage with the post ID
    // 4) get a download URL from firebase storage and update the original post with img

    const docRef = await addDoc(collection(db, "Posts"), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    console.log("New doc added with ID", docRef.id);

    const imageRef = ref(storage, `Posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "Posts", docRef.id), {
          image: downloadURL,
        });
      }
    );

    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const dragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    e.stopPropagation();
  };

  const dragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const fileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log();

    const reader = new FileReader();
    if (e.dataTransfer.files[0]) {
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <>
      <Modal
        size="auto"
        opened={open}
        onClose={setOpen}
        centered
        withCloseButton={false}
      >
        <div className="w-[800px] inline-block align-bottom px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:align-middle sm:max-w-sm sm-w-full sm:p-6">
          <div
            onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={fileDrop}
          >
            <h2 className="font-bold text-lg text-center mb-3 mt-[-15px]">Create a new post</h2>
            {selectedFile ? (
              <img
                src={selectedFile}
                onClick={() => setSelectedFile(null)}
                alt="upload"
                className="w-full object-contain cursor-pointer"
              />
            ) : (
              <div
                className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 cursor-pointer"
                onClick={() => chooseFileRef.current.click()}
              >
                <BsCamera
                  className="h-6 w-6 text-blue-700"
                  aria-hidden="true"
                />
              </div>
            )}

            <div>
              <div className="mt-3 text-center sm:mt-5">
                <div>
                  <input
                    ref={chooseFileRef}
                    type="file"
                    hidden
                    onChange={addImageToPost}
                  ></input>
                </div>

                <div className="mt-2">
                  <input
                    className="border-none focus:ring-0 w-full text-center"
                    type="text"
                    placeholder="Please enter a caption"
                    ref={captionRef}
                  ></input>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                disabled={!selectedFile}
                onClick={UploadPost}
                type="button"
                className="inline-flex justify-center w-full rounded-md
                                border border-transparent shadow-sm px-4 py-2 bg-blue-400 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-600 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>

    // <Transition.Root show={open} as={Fragment}>
    //     <Dialog
    //     as='div'
    //     className='fixed z-10 inset-0 overflow-y-auto'
    //     onClose={setOpen}>
    //         <div className='flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
    //             <Transition.Child
    //             as={Fragment}
    //             enter='ease-out duration-300'
    //             enterFrom='opacity-0'
    //             enterTo='opacity-100'
    //             leave="ease-in duration-200"
    //             leaveFrom='opacity-100'
    //             leaveTo='opacity-0'>
    //                 <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
    //             </Transition.Child>

    //             <Transition.Child
    //             as={Fragment}
    //             enter='ease-out duration-300'
    //             enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
    //             enterTo='opacity-100 translate-y-0 sm:scale-100'
    //             leave="ease-in duration-200"
    //             leaveFrom='opacity-100 translate-y-0 sm:scale-100'
    //             leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
    //             >
    //                 <div className='w-[600px] inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm-w-full sm:p-6'>
    //                     <div onDragOver={dragOver}
    //                         onDragEnter={dragEnter}
    //                         onDragLeave={dragLeave}
    //                         onDrop={fileDrop}>

    //                         {selectedFile ? (
    //                             <img
    //                              src={selectedFile}
    //                              onClick={() => setSelectedFile(null)}
    //                              alt="upload"
    //                              className='w-full object-contain cursor-pointer'/>
    //                         ): (<div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 cursor-pointer'
    //                         onClick={() => chooseFileRef.current.click()}>
    //                             <CameraIcon className='h-6 w-6 text-blue-700'
    //                             aria-hidden='true'
    //                             />
    //                         </div>)
    //                         }

    //                         <div>
    //                             <div className="mt-3 text-center sm:mt-5">
    //                                 <Dialog.Title
    //                                 as="h3"
    //                                 className="text-lg leading-6 font-medium text-black">
    //                                     Upload a photo
    //                                 </Dialog.Title>

    //                                 <div>
    //                                     <input
    //                                     ref={chooseFileRef}
    //                                     type='file'
    //                                     hidden
    //                                     onChange={addImageToPost}>
    //                                     </input>
    //                                 </div>

    //                                 <div className='mt-2'>
    //                                     <input className='border-none focus:ring-0 w-full text-center' type="text" placeholder='Please enter a caption'
    //                                     ref={captionRef}>
    //                                     </input>
    //                                 </div>
    //                             </div>
    //                         </div>

    //                         <div className='mt-5 sm:mt-6'>
    //                             <button
    //                             disabled={!selectedFile}
    //                             onClick={UploadPost}
    //                             type='button'
    //                             className='inline-flex justify-center w-full rounded-md
    //                             border border-transparent shadow-sm px-4 py-2 bg-blue-400 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-600 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300'>
    //                                 {loading ? "Uploading..." : "Upload"}
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </Transition.Child>
    //         </div>
    //     </Dialog>
    // </Transition.Root>
  );
}

export default UploadModal;
