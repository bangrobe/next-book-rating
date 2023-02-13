import React from "react";
import BookItem from './BookItem';
type BooksProps = {
  books: []
};

const Books = ({books}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      { books.map((book: any)=> {
        return <BookItem key={book.id} book={book} />
      })}
    </div>
  );
};

export default Books;
