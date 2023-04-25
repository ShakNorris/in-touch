import React, { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { searchModalState } from "../atoms/modalAtom";
import { BsCamera } from "react-icons/bs";
import { db, storage } from "../firebase";
import { useSession } from "next-auth/react";
import { getDocs } from "firebase/firestore";
import { AiOutlineSearch } from "react-icons/ai";
import { Modal, Input } from "@mantine/core";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";

function SearchModal() {
  const [open, setOpen] = useRecoilState(searchModalState);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const docs = querySnapshot.docs.map((doc) => doc.data());
      setUsers(docs);
    };

    getUsers();
  }, []);

  console.log(users);

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
          <Input
            icon={<AiOutlineSearch size="1rem" />}
            placeholder="Search"
            size="md"
            onChange={(e) => setSearch(e.target.value)}
          />

          {search ? (
            <div>
              {users
                .filter((u) => {
                  return (
                    u.username.toLowerCase().indexOf(search.toLowerCase()) > -1
                  );
                })
                .map((u) => (
                  <div
                    onClick={() => {
                      router.push(`/${u.username}`);
                      setOpen(false);
                    }}
                    key={u.id}
                    className="flex justify-between mt-3 cursor-pointer hover:bg-gray-100"
                  >
                    <img
                      className="ml-2 w-10 h-10 rounded-full"
                      src={u.profileImg}
                    />
                    <div className="flex-1 ml-4">
                      <h2 className="font-semibold text-sm">{u.username}</h2>
                      <h3 className="text-xs text-gray-400">{u.email}</h3>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      </Modal>
    </>
  );
}

export default SearchModal;
