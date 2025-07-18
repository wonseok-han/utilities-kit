import { MENU_ITEMS_BY_PATH, MENU_ITEMS_BY_ID } from '@constants/menu';

export const getMenuItemByPath = (path: string) => MENU_ITEMS_BY_PATH.get(path);
export const getMenuItemById = (id: string) => MENU_ITEMS_BY_ID.get(id);

// 현재 경로에 해당하는 메뉴 아이템 정보를 반환하는 함수
export const getCurrentPageInfo = (pathname: string) => {
  const menuItem = getMenuItemByPath(pathname);

  if (menuItem) {
    return {
      title: menuItem.label,
      activeMenuItem: menuItem.id,
      icon: menuItem.icon,
      path: menuItem.path,
    };
  }

  // 기본값 (대시보드)
  return {
    title: 'Dashboard',
    activeMenuItem: 'dashboard',
    icon: 'dashboard',
    path: '/',
  };
};
