import React from "react";
import { useFormik } from "formik";
import LoginValidation from "../lib/validate";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { HoverCard, Text, Group, Image } from "@mantine/core";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Authorize() {
  const [passwordShown, setPasswordShown] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: LoginValidation,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit,
  });

  async function onSubmit(values) {
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: "/",
    });
    if (res.ok) router.push(res.url);
  }

  return (
    <section>
      {(formik.errors.email || formik.errors.password) && (
        <div className="mb-5">
          <Group position="center">
            <HoverCard width={280} shadow="md">
              <HoverCard.Target>
                <Image
                  width={40}
                  src="https://static.vecteezy.com/system/resources/previews/012/042/292/original/warning-sign-icon-transparent-background-free-png.png"
                />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="sm">{formik.errors.email}</Text>
                <Text size="sm">{formik.errors.password}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
        </div>
      )}
      <form className="flex flex-col gap-2" onSubmit={formik.handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          {...formik.getFieldProps("email")}
        />{" "}
        {/*getFieldProps is a combination of onChange and value */}
        <div className="flex relative">
          <input
            type={passwordShown ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full pr-7"
            {...formik.getFieldProps("password")}
          />
          <div
            className="absolute top-3 right-2 mb-2 z-10 cursor-pointer w-4 text-center"
            onClick={() => setPasswordShown(!passwordShown)}
          >
            {passwordShown ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-800 rounded"
        >
          Login
        </button>
      </form>
    </section>
  );
}

export default Authorize;
