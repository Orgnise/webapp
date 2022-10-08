import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import cx from "classnames";
import { type } from "@testing-library/user-event/dist/type";

export default function ModalForm({ children, button, title, className }) {
  const [isShowing, setIsShowing] = useState(false);

  const wrapperRef = useRef(null);

  //   useTheme();

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsShowing(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    let html = document.querySelector("html");

    if (html) {
      if (isShowing && html) {
        html.style.overflowY = "hidden";

        // const focusableElements =
        //   'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        // const modal = document.querySelector("#modal"); // select the modal by it's id

        // const firstFocusableElement = modal.querySelectorAll(
        //   focusableElements
        // )[0]; // get first element to be focused inside modal

        // const focusableContent = modal.querySelectorAll(focusableElements);

        // const lastFocusableElement =
        //   focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

        document.addEventListener("keydown", function(e) {
          if (e.keyCode === 27) {
            setIsShowing(false);
          }

          let isTabPressed = e.key === "Tab" || e.keyCode === 9;

          if (!isTabPressed) {
            return;
          }

          //   if (e.shiftKey) {
          //     // if shift key pressed for shift + tab combination
          //     if (document.activeElement === firstFocusableElement) {
          //       lastFocusableElement.focus(); // add focus for the last focusable element
          //       e.preventDefault();
          //     }
          //   } else {
          //     // if tab key is pressed
          //     if (document.activeElement === lastFocusableElement) {
          //       // if focused has reached to last focusable element then focus first focusable element after pressing tab
          //       firstFocusableElement.focus(); // add focus for the first focusable element
          //       e.preventDefault();
          //     }
          //   }
        });

        // firstFocusableElement.focus();
      } else {
        html.style.overflowY = "visible";
      }
    }
  }, [isShowing]);

  return (
    <>
      {button ? (
        <div onClick={() => setIsShowing(true)}>{button}</div>
      ) : (
        <button
          onClick={() => setIsShowing(true)}
          className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-emerald-500 px-5 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
        >
          <span>Open Modal</span>
        </button>
      )}

      {isShowing && typeof document !== "undefined"
        ? ReactDOM.createPortal(
            <div
              className="fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm"
              aria-labelledby="header-4a content-4a"
              aria-modal="true"
              tabIndex="-1"
              role="dialog"
            >
              {/*    <!-- Modal --> */}
              <div
                ref={wrapperRef}
                className={cx(
                  "flex max-h-[90vh] max-w-7xl flex-col gap-4 overflow-hidden rounded bg-white p-6 text-slate-500 shadow-xl shadow-slate-700/10",
                  className
                )}
                id="modal"
                role="document"
              >
                {/*        <!-- Modal header --> */}
                <header id="header-4a" className="flex items-center">
                  <h3 className="flex-1 text-lg font-medium text-slate-700">
                    {title}
                  </h3>
                  <button
                    onClick={() => setIsShowing(false)}
                    className="inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-5 text-sm font-medium tracking-wide  text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent"
                    aria-label="close dialog"
                  >
                    <span className="relative only:-mx-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        role="graphics-symbol"
                        aria-labelledby="title-79 desc-79"
                      >
                        <title id="title-79">Icon title</title>
                        <desc id="desc-79">
                          A more detailed description of the icon
                        </desc>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  </button>
                </header>
                {/*        <!-- Modal content --> */}
                {children}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
