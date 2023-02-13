import React from "react";
import axios from "axios";
import SingleBook from "@/components/book/SingleBook";
import { BookItemProps } from "@/types/Book";

interface BookProps {
    book: BookItemProps,
    error: any
}
const BookReview = ({ book, error}: {book: BookItemProps, error: any}) => {
  return (
    <>
    <SingleBook book={book} />
    <div>
      <h3>Reviews</h3>
    </div>
    </>
  )
};

export async function getServerSideProps(context: any) {
  try {
    const { id } = context.query;
    const { data: book } = await axios(
      `${process.env.NEXT_PUBLIC_STRAPI_API}/api/books/${id}?populate=cover`
    );
    console.log(book.data);
    return {
      props: {
        book: book.data,
        error: null,
      },
    };
  } catch (error: any) {
    if (error.response.status === 400) {
      return {
        props: {
          book: null,
          error: "Book not found",
        },
      };
    }
    return {
      props: {
        book: null,
        error: error.response.data.error.message,
      },
    };
  }
}

export default BookReview;
