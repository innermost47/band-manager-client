import React from "react";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1" style={{ paddingBottom: "80px" }}>
        {children}
      </main>
      <CookieConsent />
      <Footer />
    </div>
  );
};

export default Layout;
