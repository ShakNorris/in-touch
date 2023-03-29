import React, { useState } from "react";
import { useFormik } from "formik";
import zxcvbn from "zxcvbn";
import { HoverCard, Text, Group, Image, Modal } from "@mantine/core";
import { RegisterValidation } from "../lib/validate";
import { useDisclosure } from "@mantine/hooks";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Register() {
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      cpassword: "",
    },
    validate: RegisterValidation,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit,
  });

  const [successfulLogin, { open, close }] = useDisclosure(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [cpasswordShown, setCPasswordShown] = useState(false);

  async function onSubmit(values) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    };

    await fetch("/api/auth/signup", options)
      .then((res) => res.json())
      .then((data) => {
        if (data) console.log(data);
      });

    if (options) {
      open;
    }
  }

  var strength = {
    0: "Bad",
    1: "Weak",
    2: "Decent",
    3: "Good",
    4: "Great",
  };

  const testPassword = zxcvbn(formik.values.password);

  return (
    <>
      {(formik.errors.email ||
        formik.errors.password ||
        formik.errors.firstname ||
        formik.errors.cpassword ||
        formik.errors.lastname ||
        formik.errors.username) && (
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
                <Text size="sm">{formik.errors.firstname}</Text>
                <Text size="sm">{formik.errors.lastname}</Text>
                <Text size="sm">{formik.errors.username}</Text>
                <Text size="sm">{formik.errors.email}</Text>
                <Text size="sm">{formik.errors.password}</Text>
                <Text size="sm">{formik.errors.cpassword}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
        </div>
      )}
      <form className="flex flex-col gap-1" onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          {...formik.getFieldProps("firstname")}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          {...formik.getFieldProps("lastname")}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          {...formik.getFieldProps("username")}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          {...formik.getFieldProps("email")}
        />
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
        <div className="flex relative">
          <input
            type={cpasswordShown ? "text" : "password"}
            name="confirmpassword"
            placeholder="Confirm Password"
            className="w-full pr-7"
            {...formik.getFieldProps("cpassword")}
          />
          <div
            className="absolute top-3 right-2 mb-2 z-10 cursor-pointer w-4 text-center"
            onClick={() => setCPasswordShown(!cpasswordShown)}
          >
            {cpasswordShown ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-800 rounded"
        >
          Register
        </button>
      </form>
      <div className="w-[375px] h-13 pr-10">
        {formik.values.password.length >= 1 && (
          <HoverCard width={280} shadow="md">
            <HoverCard.Target>
              <p className="bold">Strength: {strength[testPassword.score]}</p>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm">{testPassword.feedback.suggestions}</Text>
              {testPassword.score >= 2 && (
                <Text size="sm">Your password is strong!</Text>
              )}
            </HoverCard.Dropdown>
          </HoverCard>
        )}
      </div>

      <Modal
        centered
        opened={successfulLogin}
        onClose={close}
        withCloseButton={false}
      >
        You successfully Registered! Go to the Login Form and Sign In!
      </Modal>
    </>
  );
}

export default Register;
