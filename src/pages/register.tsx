import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Cookies from "js-cookie";
type Props = {};

const Register = (props: Props) => {
  const router = useRouter();
  const [regDetails, setRegDetails] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [regError, setRegError] = useState("");
  const [regErrorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleFormInput = (e: any) => {
    setRegError("");
    setRegDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email: string) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegex)) {
      return true;
    }
    return false;
  };

  const handleSignupSubmit = async (e:any) => {
    e.preventDefault();
    if ( regDetails.username === '' || regDetails.username.length < 5) {
        setErrorMessages((prev)=> ({...prev, username: 'Please enter a username with 5 chars long'}));
        return;
    }

    if (!(validateEmail(regDetails.email))) {
        setErrorMessages((prev)=> ({...prev, email: 'Please enter correct email address'}));
        return;
    }
    if (regDetails.password === '') {
        setErrorMessages((prev)=> ({...prev, password: 'Please enter password'}));
        return;
    }

    setLoading(true);
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API}/api/auth/local/register`, regDetails);
        const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000); // 1hr
        Cookies.set('authToken', data.jwt, { expires: expirationTime });
        Cookies.set('user', data.user.username, { expires: expirationTime });
        router.push('/')
    } catch(error: any) {
        setRegError(error.response.data.error.message);
        errorNotification(error.response.data.error.message);
    }
    setLoading(false)
  }
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="shadow-md md:shadow-none w-full border md:w-96">
        <div className="flex items-center justify-between mb-3">
          <p className=" text-lg font-bold text-white dark:text-white bg-black w-full p-5">
            Signup to Book Ratings App
          </p>
        </div>
        <div className="p-5">
          <form onSubmit={handleSignupSubmit} method="POST">
            {regError && (
              <p className="text-red-400 text-lg text-center border border-red-400 my-2 p-1">
                {regError}
              </p>
            )}
            <div>
              <label htmlFor="username" className="text-gray-400">
                Username
              </label>
              <input
                onChange={handleFormInput}
                type="text"
                className="text-gray-400 w-full border border-gray-400 p-1 my-3 rounded"
                name="username"
              />
              {regErrorMessages.username && (
                <p className="text-red-400">{regErrorMessages.username}</p>
              )}
            </div>
            <div>
              <label htmlFor="identifier" className="text-gray-400">
                Email
              </label>
              <input
                onChange={handleFormInput}
                type="text"
                className="text-gray-400 w-full border border-gray-400 p-1 my-3 rounded"
                name="email"
              />
              {regErrorMessages.email && (
                <p className="text-red-400">{regErrorMessages.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="text-gray-400">
                Password
              </label>
              <input
                onChange={handleFormInput}
                type="password"
                className="text-gray-400 w-full border border-gray-400 p-1 my-3 rounded"
                name="password"
              />
              {regErrorMessages.password && (
                <p className="text-red-400">{regErrorMessages.password}</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-black text-white p-2 my-3 rounded shadow"
            >
              {loading ? "registering user..." : "Signup"}
            </button>
          </form>
          <p className="text-black">
            Have an account?
            <Link href="/login">
              <span className="underline text-black cursor-pointer border border-dashed border-black p-1">
                Login
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
