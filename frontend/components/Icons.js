const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Icon({ size = 18, children, ...rest }) {
  return (
    <svg {...base} width={size} height={size} aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const IconGrid = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </Icon>
);

export const IconFile = (p) => (
  <Icon {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6" />
    <path d="M9 17h4" />
  </Icon>
);

export const IconSearch = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20.5 20.5-3.6-3.6" />
  </Icon>
);

export const IconSparkles = (p) => (
  <Icon {...p}>
    <path d="M12 3.2 13.9 8l4.8 1.9-4.8 1.9L12 16.6l-1.9-4.8L5.3 9.9l4.8-1.9L12 3.2z" />
    <path d="M18.8 14.6 19.7 17l2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9.9-2.4z" />
    <path d="M5.4 15.4 6.1 17l1.7.7-1.7.7-.7 1.6-.7-1.6L3 17.7l1.7-.7.7-1.6z" />
  </Icon>
);

export const IconChat = (p) => (
  <Icon {...p}>
    <path d="M20.5 11.6a8 8 0 0 1-8.4 8 8.7 8.7 0 0 1-3.7-.9L3.5 20.5l1.8-4.9a8 8 0 0 1-.8-3.7 8 8 0 0 1 8-8.4 8 8 0 0 1 8 8.1z" />
    <path d="M8.5 11.5h.01" />
    <path d="M12 11.5h.01" />
    <path d="M15.5 11.5h.01" />
  </Icon>
);

export const IconLogout = (p) => (
  <Icon {...p}>
    <path d="M9.5 21H5.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 16.5 4.5-4.5L16 7.5" />
    <path d="M20.5 12H9.5" />
  </Icon>
);

export const IconMenu = (p) => (
  <Icon {...p}>
    <path d="M3.5 6.5h17" />
    <path d="M3.5 12h17" />
    <path d="M3.5 17.5h17" />
  </Icon>
);

export const IconX = (p) => (
  <Icon {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
);

export const IconUpload = (p) => (
  <Icon {...p}>
    <path d="M20.5 15.5v3a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-3" />
    <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
    <path d="M12 4v11.5" />
  </Icon>
);

export const IconTrash = (p) => (
  <Icon {...p}>
    <path d="M3.5 6.5h17" />
    <path d="M8.5 6.5v-2a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v2" />
    <path d="M18.5 6.5 17.6 19.4a2 2 0 0 1-2 1.9H8.4a2 2 0 0 1-2-1.9L5.5 6.5" />
    <path d="M10 11v5.5" />
    <path d="M14 11v5.5" />
  </Icon>
);

export const IconSend = (p) => (
  <Icon {...p}>
    <path d="M21.5 2.5 10.8 13.2" />
    <path d="M21.5 2.5l-6.8 19-3.9-8.3-8.3-3.9 19-6.8z" />
  </Icon>
);

export const IconUser = (p) => (
  <Icon {...p}>
    <path d="M20 21v-1.8a4.2 4.2 0 0 0-4.2-4.2H8.2A4.2 4.2 0 0 0 4 19.2V21" />
    <circle cx="12" cy="7.5" r="4.2" />
  </Icon>
);

export const IconMail = (p) => (
  <Icon {...p}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3 7.5 8.1 5.3a1.5 1.5 0 0 0 1.8 0L21 7.5" />
  </Icon>
);

export const IconLock = (p) => (
  <Icon {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    <path d="M12 14.5v2" />
  </Icon>
);

export const IconArrowRight = (p) => (
  <Icon {...p}>
    <path d="M4.5 12h15" />
    <path d="m13.5 6 6 6-6 6" />
  </Icon>
);

export const IconCheck = (p) => (
  <Icon {...p}>
    <path d="m20 6.5-10.5 11L4 12" />
  </Icon>
);

export const IconAlert = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5" />
    <path d="M12 16.4h.01" />
  </Icon>
);

export const IconLayers = (p) => (
  <Icon {...p}>
    <path d="m12 2.5 9 4.8-9 4.8-9-4.8 9-4.8z" />
    <path d="m3 12.3 9 4.8 9-4.8" />
    <path d="m3 17 9 4.8 9-4.8" />
  </Icon>
);

export const IconZap = (p) => (
  <Icon {...p}>
    <path d="M13.2 2.5 4 13.8h6.6l-.8 7.7 9.2-11.3h-6.6l.8-7.7z" />
  </Icon>
);

export const IconClock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.3 2" />
  </Icon>
);

export const IconBot = (p) => (
  <Icon {...p}>
    <rect x="4" y="8" width="16" height="12" rx="3.5" />
    <path d="M12 8V4.8" />
    <path d="M12 4.8h.01" />
    <path d="M9 13.5h.01" />
    <path d="M15 13.5h.01" />
    <path d="M9.5 17h5" />
  </Icon>
);

export const IconPlus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
);

export const IconChevronRight = (p) => (
  <Icon {...p}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </Icon>
);

export const IconShield = (p) => (
  <Icon {...p}>
    <path d="M12 2.8 4.8 5.7v5.6c0 4.5 3 8.4 7.2 9.9 4.2-1.5 7.2-5.4 7.2-9.9V5.7L12 2.8z" />
    <path d="m9 12 2.2 2.2L15.2 10" />
  </Icon>
);

export const IconCompass = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.4 8.6-2 5.4-5.4 2 2-5.4 5.4-2z" />
  </Icon>
);

export const IconInbox = (p) => (
  <Icon {...p}>
    <path d="M21 12.5h-5l-1.6 2.6H9.6L8 12.5H3" />
    <path d="M6.3 4.9 3 12.5v4.9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.9l-3.3-7.6a2 2 0 0 0-1.8-1.2H8.1a2 2 0 0 0-1.8 1.2z" />
  </Icon>
);

export function LogoMark({ size = 24 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.6 3.6 7.1v9.8L12 21.4l8.4-4.5V7.1L12 2.6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M12 7.2 7.8 9.5v4.6L12 16.4l4.2-2.3V9.5L12 7.2z"
        fill="currentColor"
        opacity="0.95"
      />
    </svg>
  );
}
