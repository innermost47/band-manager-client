import React from "react";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import { ToastProvider } from "./ToastContext";
import { NotificationProvider } from "./NotificationContext";

const Layout = ({ children }) => {
  return (
    <ToastProvider>
      <NotificationProvider>
        <div className="d-flex flex-column min-vh-100">
          <main className="flex-grow-1" style={{ paddingBottom: "80px" }}>
            {children}
          </main>
          <CookieConsent />
          <Footer />
        </div>
      </NotificationProvider>
    </ToastProvider>
  );
};

export default Layout;
