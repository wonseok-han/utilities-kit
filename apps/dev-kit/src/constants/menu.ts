export const SIDEBAR_MENU_ITEMS: MenuItemType[] = [
  {
    id: 'json-formatter',
    label: 'JSON 포맷터',
    icon: 'json',
    path: '/json-formatter',
  },
  {
    id: 'base64-encoder',
    label: 'Base64 인코더',
    icon: 'encode',
    path: '/base64-encoder',
  },
  { id: 'jwt-encoder', label: 'JWT 인코더', icon: 'jwt', path: '/jwt-encoder' },
  {
    id: 'regex-tester',
    label: '정규식 테스터',
    icon: 'regex',
    path: '/regex-tester',
  },
  {
    id: 'timestamp-converter',
    label: 'Timestamp 변환',
    icon: 'time',
    path: '/timestamp-converter',
  },
  {
    id: 'diff',
    label: 'Diff 비교기',
    icon: 'diff',
    path: '/diff',
  },
  {
    id: 'web-editor',
    label: '웹 에디터',
    icon: 'webEditor',
    path: '/web-editor',
  },
  {
    id: 'cve-viewer',
    label: 'CVE 뷰어',
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
