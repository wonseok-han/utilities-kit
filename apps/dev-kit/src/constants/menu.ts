export const SIDEBAR_MENU_ITEMS: MenuItemType[] = [
  {
    id: 'json-formatter',
    label: 'JSON Formatter',
    icon: 'json',
    path: '/json-formatter',
  },
  {
    id: 'base64-encoder',
    label: 'Base64 Encoder',
    icon: 'encode',
    path: '/base64-encoder',
  },
  {
    id: 'jwt-encoder',
    label: 'JWT Encoder',
    icon: 'jwt',
    path: '/jwt-encoder',
  },
  {
    id: 'regex-tester',
    label: 'Regex Tester',
    icon: 'regex',
    path: '/regex-tester',
  },
  {
    id: 'timestamp-converter',
    label: 'Timestamp Converter',
    icon: 'time',
    path: '/timestamp-converter',
  },
  {
    id: 'diff',
    label: 'Diff Comparator',
    icon: 'diff',
    path: '/diff',
  },
  {
    id: 'web-editor',
    label: 'Web Editor',
    icon: 'webEditor',
    path: '/web-editor',
  },
  {
    id: 'cve-viewer',
    label: 'CVE Viewer',
    icon: 'security',
    path: '/cve-viewer',
  },
];

// 경로별 메뉴 아이템을 빠르게 찾기 위한 맵
export const MENU_ITEMS_BY_PATH = new Map(
  SIDEBAR_MENU_ITEMS.map((item) => [item.path, item])
);

// 경로별 메뉴 아이템을 빠르게 찾기 위한 맵 (ID 기준)
export const MENU_ITEMS_BY_ID = new Map(
  SIDEBAR_MENU_ITEMS.map((item) => [item.id, item])
);
