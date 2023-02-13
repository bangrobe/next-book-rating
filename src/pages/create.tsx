import React, { useState } from "react";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import { BiImageAdd } from "react-icons/bi";
import { errorNotification, successNotification } from "@/utils/toasts";
import { author_formats, author_modules } from "../utils/editor";
import { isImage, validateSize } from "@/utils/fileValidations";
import { useRouter } from "next/router";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
type Props = {};

const Create = (props: Props) => {
  const router = useRouter();
  const [info, setInfo] = useState("");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [imageName, setImageName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createBook = async () => {
    const authToken = Cookies.get("authToken");
    if (info === "") {
      errorNotification("Please enter book info");
      return;
    }
    if (!title) {
      errorNotification("Please enter book title");
      return;
    }
    if (!image) {
      errorNotification("Please select book image");
      return;
    }
    setIsLoading(true);
    try {
      let content: any = {};
      const formData = new FormData();
      content["info"] = info;
      content["title"] = title;
      formData.append(`files.cover`, image);

      formData.append("data", JSON.stringify(content));
      // Display the key/value pairs
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API}/api/books`, formData, {
          headers: {
              Authorization: `Bearer ${authToken}`
          }
        })
        successNotification('Create book OK!')
        router.push('/')
    } catch (error: any) {
      errorNotification(error.response.data.error.message);
    }
    setIsLoading(false);
  };
  const handleImageSelect = (e: any) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const fileTypeResult = isImage(file.name);
    if (!fileTypeResult) {
      errorNotification("This is not an image");
      return;
    }
    const fileLarge = validateSize(file);
    if (fileLarge) {
      errorNotification("File size should 5MB or less");
      return;
    }
    setImageName(file.name);
    setImage(file);
  };
  return (
    <div>
      <div className="mx-5">
        <h1 className="text-3xl font-bold">Create a book for review</h1>
      </div>
      <div className="mx-5">
        <div className="flex flex-col my-5">
          <label htmlFor="title" className="font-bold">
            Enter Book Title
          </label>
          <input
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            className="my-3 border p-2"
            placeholder="Enter Book Title"
          />
        </div>
        <div className="my-5 border p-5 flex flex-col items-center justify-center">
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <span>Select Book Cover</span>
            <span className="text-red-300">(5MB Max)</span>
            <BiImageAdd className="text-5xl" />
            <input
              onChange={handleImageSelect}
              className="hidden"
              name="cover"
              type="file"
            />
            <span>{imageName}</span>
          </label>
        </div>
        <div className="my-20 md:my-10">
          <label className="font-bold">Enter Book Info</label>
          <ReactQuill
            id="editor"
            formats={author_formats}
            modules={author_modules}
            theme="snow"
            value={info}
            onChange={setInfo}
            className="w-full h-96 pb-10 my-3"
          />
        </div>
        <button
          type="button"
          onClick={createBook}
          className="border border-black p-2 rounded font-bold"
        >
          Create Book
        </button>
      </div>
    </div>
  );
};

export default Create;
