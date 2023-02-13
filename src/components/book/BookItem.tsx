import React from "react";
import Link from "next/link";
import { BookItemProps } from "@/types/Book";
import 'react-quill/dist/quill.bubble.css';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BookItem = ({ book }:{book: BookItemProps}) => {
  return (
    <article className="flex bg-white transition hover:shadow-xl">
      <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
        <time
          dateTime="2022-10-10"
          className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
        >
          <span>2022</span>
          <span className="w-px flex-1 bg-gray-900/10"></span>
          <span>Oct 10</span>
        </time>
      </div>

      <div className="hidden sm:block sm:basis-56">

        <img
          alt="Guitar"
          src={book.attributes.cover?.data ? book.attributes.cover?.data.attributes.url : '' }
          className="aspect-square h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="border-l border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
          <a href="#">
            <h3 className="font-bold uppercase text-gray-900">
              {book?.attributes.title}
            </h3>
          </a>

          <p className="mt-2 text-sm leading-relaxed text-gray-700 line-clamp-3">
            <ReactQuill value={ book.attributes.info.slice(0,100) } readOnly theme="bubble" />
            
          </p>
        </div>

        <div className="sm:flex sm:items-end sm:justify-end">
          <Link
            href={`/book/${book.id}`}
            className="block bg-yellow-300 px-5 py-3 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-yellow-400"
          >
            Read Blog
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BookItem;
