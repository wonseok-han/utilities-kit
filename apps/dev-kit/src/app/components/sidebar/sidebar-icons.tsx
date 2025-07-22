import type { ReactNode } from 'react';

export const getSidebarIcon = (iconType: string): ReactNode => {
  const icons = {
    dashboard: (
      <path
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2zM3 7l9 6 9-6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    json: (
      <path
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    encode: (
      <path
        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    jwt: (
      <path
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    time: (
      <path
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
    regex: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.75 3v5.25m4.5-5.25v5.25m-7.5 0h10.5M4.5 8.25h15m-1.5 0v7.636a2.25 2.25 0 01-.659 1.591l-2.25 2.25a2.25 2.25 0 01-1.591.659h-2.5a2.25 2.25 0 01-1.591-.659l-2.25-2.25A2.25 2.25 0 015 15.886V8.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    diff: (
      <path
        d="M5 13l4 4L19 7M5 7h6M13 17h6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    ),
  };
  return icons[iconType as keyof typeof icons] || icons.dashboard;
};
