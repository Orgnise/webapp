import React from 'react'
import cx from 'classnames'
// LoadingSpinner component
export const LoadingSpinner = ({ className }) => {
  return (
    <svg
      className={cx('animate-spin -ml-1 mr-3 h-5 w-5', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
      ></path>
    </svg>
  )
}
