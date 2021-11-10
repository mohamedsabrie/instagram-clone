import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { CameraIcon, XIcon } from "@heroicons/react/outline";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { useSession } from "next-auth/react";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";

export default function Modal() {
  const [open, setOpen] = useRecoilState(modalState);
  const cancelButtonRef = useRef(null);
  const filePickerRef = useRef(null);
  const captionRef = useRef("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleUploadPost = async () => {
    if (loading) return;
    setLoading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      username: session?.user?.username,
      profileImage: session?.user?.image,
      caption: captionRef.current.value,
      timestamp: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);
    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
    );
    
    setLoading(false);
    setSelectedFile(null);
    setOpen(false);
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

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5  sm:p-6 sm:pb-4">
                <div className="flex flex-col items-center justify-center">
                  {selectedFile ? (
                    <div className="relative">
                      <div
                        onClick={() => setSelectedFile(null)}
                        className="absolute top-3 right-3 rounded-full bg-red-500 text-white cursor-pointer transition transform  duration-200 hover:scale-110 ease-out "
                      >
                        <XIcon className="h-9 p-2 font-bold" />
                      </div>
                      <img
                        className="w-full object-contain"
                        src={selectedFile}
                        alt=""
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => filePickerRef.current.click()}
                      className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 cursor-pointer"
                    >
                      <CameraIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div className="mt-3 text-center  ">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Upload a photo
                    </Dialog.Title>
                    <div>
                      <input
                        type="file"
                        hidden
                        ref={filePickerRef}
                        onChange={addImageToPost}
                      />
                    </div>
                  </div>
                    <div className="mt-2 w-full">
                      <input
                        className=" border-none focus:outline-none w-full text-center"
                        type="text"
                        ref={captionRef}
                        placeholder="Please enter a caption"
                      />
                    </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4  flex flex-col xs:flex-row space-x-0 space-y-5 xs:space-y-0 xs:space-x-6 justify-center ">
                <button
                  type="button"
                  className="   rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 w-full xs:w-28 "
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedFile}
                  className={` rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 hover:bg-red-500 focus:ring-red-500   text-sm font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed  disabled:hover:bg-gray-300  w-full xs:w-28`}
                  onClick={handleUploadPost}
                >
                  {loading ? "Loading ..." : "Upload Post"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
