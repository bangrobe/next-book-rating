import React from "react";
import { Toaster } from "react-hot-toast";
import Header from "../header";
type LayoutProps = {
    children: React.ReactNode
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Toaster />
      <Header />
      <main className="container lg:max-w-screen-xl mx-auto px-4 py-4">{children}</main>
    </>
  );
};

export default Layout;
