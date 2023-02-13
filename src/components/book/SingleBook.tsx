import React, { useContext, useState } from "react";
import Image from "next/image";
import "react-quill/dist/quill.bubble.css";
import dynamic from "next/dynamic";
import axios from "axios";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { AuthContext } from "@/context/authContext";
import { BookItemProps } from "@/types/Book";
import Link from "next/link";
import Cookies from "js-cookie";
import Confirm from "../dialog/ConfirmDialog";
import { successNotification, errorNotification } from "@/utils/toasts";
import { useRouter } from "next/router";
type Props = {};

const SingleBook = ({ book }: { book: BookItemProps }) => {
  const { user } = useContext(AuthContext);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    const authToken = Cookies.get("authToken");
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_STRAPI_API}/api/books/${book.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      successNotification("Delete OK!");
      router.push("/");
    } catch (error: any) {
      errorNotification(error.response.data.error.message);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mb-4">
      <div className="flex justify-center">
        <Image
          className="object-cover"
          src={
            book.attributes.cover?.data
              ? book.attributes.cover?.data.attributes.url
              : ""
          }
          width={400}
          height={400}
          alt={""}
        />
      </div>
      <div>
        <div className="flex gap-4 justify-between">
          <h2>Book Info</h2>
          <div>
            {(book.attributes.creator === user?.username || user?.isAdmin) && (
              <div className="flex gap-2">
                <Link href={`/edit?book=${book.id}`}>
                  <button
                    type="button"
                    className="p-1 rounded bg-green-500 text-white w-14"
                  >
                    Edit
                  </button>
                </Link>
                <button
                  type="button"
                  className="p-1 rounded bg-red-500 text-white w-14"
                  onClick={() => setConfirmOpen(true)}
                >
                  Delete
                </button>
                <Confirm
                  title="Delete post?"
                  open={confirmOpen}
                  onClose={() => setConfirmOpen(false)}
                  onConfirm={handleDelete}
                >
                  Are you sure you want to delete this post?
                </Confirm>
              </div>
            )}
          </div>
        </div>

        <div>
          <ReactQuill value={book.attributes.info} readOnly theme="bubble" />
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
