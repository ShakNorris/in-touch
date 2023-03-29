import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import Story from "./Story";
import { useSession } from "next-auth/react";

function Stories() {
  const [users, setUsers] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const users = [...Array(20)].map((_, i) => ({
      // userId: faker.datatype.uuid(),
      userId: i,
      username: faker.internet.userName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      password: faker.internet.password(),
      registeredAt: faker.date.past(),
      birthday: faker.date.birthdate(),
    }));
    setUsers(users);
  }, []);

  return (
    <div
      className="flex space-x-2 p-6 bg-white mt-8 border border-gray-200
    overflow-x-scroll scrollbar-thin scrollbar-thumb-white scrollbar-hide"
    >
      {session && (
        <Story img={session.user.image} username={session.user.username} />
      )}
      {users.map((profile) => (
        <Story
          key={profile.userId}
          img={profile.avatar}
          username={profile.username}
        />
      ))}
    </div>
  );
}

export default Stories;
