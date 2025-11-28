"use client";
import { useState } from "react";
import { PersonStandingIcon, LockIcon } from "lucide-react";
import axios from "axios";
import { redirect } from "next/navigation";

const Login = () => {
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [inValid, setInvalid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await axios.post(
        `/api/proxy`,
        {
          name: formData.name,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
			if (res.status !== 200) {
				setInvalid(true);
				return;
			}
    } catch (error) {
      setInvalid(true);
      return;
    }
    // console.log(res.status);
    return redirect("/admin");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div
          className={
            inValid ? "block text-red-800 absolute top-2 text-4xl" : "hidden"
          }
        >
          <h1>Invalid credentials </h1>
        </div>
        <form
          method="POST"
          onSubmit={handleSubmit}
          className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white p-5 shadow-2xl"
        >
          <h1 className="text-gray-900 text-3xl mt-10 font-medium">Login</h1>
          <div className="flex items-center mt-6 w-full text-black bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <PersonStandingIcon />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none outline-none ring-0"
              value={formData.name}
              onChange={handleChange}
              required={true}
            />
          </div>

          <div className="flex items-center mt-4 w-full text-black bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <LockIcon />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border-none outline-none ring-0"
              value={formData.password}
              onChange={handleChange}
              required={true}
            />
          </div>
          {/* <div className="mt-4 text-left text-indigo-500">
        <button className="text-sm" type="reset">
				Forget password?
        </button>
				</div> */}
          <button
            type="submit"
            className="mt-4 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity cursor-pointer"
          >
            Log in
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
