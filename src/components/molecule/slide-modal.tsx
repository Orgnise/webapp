import React from "react";
import cx from "classnames";

interface SlideModalProps {
  children: React.ReactNode;
  active: boolean;
  setActive: (active: boolean) => void;
  width?: string;
  align?: "left" | "right";
}

export function SlideModal({
  children,
  active = false,
  setActive = () => {},
  width = "500px",
  align = "right",
}: SlideModalProps) {
  return (
    <>
      {typeof document !== "undefined" ? (
        <div
          className="relative "
          aria-labelledby="slide-over-title"
          role="dialog"
          aria-modal="true"
        >
          {/* <!-- Background backdrop, show/hide based on slide-over state--> */}
          <div
            className={cx(
              "BackgroundBackdrop fixed inset-0 bg-slate-600 bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-50  transition ease-in-out",
              {
                "opacity-0 translate-x-0 h-0 w-0": !active,
                "opacity-90 h-screen w-full": active,
              }
            )}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setActive(false);
            }}
            style={{ zIndex: 999 }}
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ zIndex: 999 }}
          >
            <div
              className={cx(
                "pointer-events-none fixed inset-y-0 right-0 flex max-w-full ",
                {
                  "right-0 pl-10": align === "right",
                  "left-0 pr-10": align === "left",
                }
              )}
            >
              {/* <!-- Slide-over panel, show/hide based on slide-over state.--> */}
              <div
                className={cx(
                  "pointer-events-auto relative w-screen  transform transition ease-in-out duration-500 sm:duration-700",
                  {
                    "translate-x-0": active,
                    "-translate-x-full": !active && align === "left",
                    "translate-x-full": !active && align === "right",
                  }
                )}
                style={{
                  width: width || "500px",
                  height: "100",
                  zIndex: 999,
                }}
              >
                <div className="flex h-full flex-col overflow-y-scroll theme-bg-surface shadow-xl">
                  <div className="flex-1">
                    <div className="h-full" aria-hidden="true">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
