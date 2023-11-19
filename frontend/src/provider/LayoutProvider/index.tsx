import React, { useMemo, useState } from "react";

const TemplateDafaultValue = {
  showLeftMenu: false,
  badgeNumber: 0,
  setShowLeftMenu: (showLeftMenu: boolean) => {},
  setBadgeNumber: (badgeNumber: number) => {},
};

export const LayoutContext = React.createContext(TemplateDafaultValue);

export const useTemplateContextValue = (navigation: {
  navigate: (arg0: string) => void;
}) => {
  const [_showLeftMenu, _setShowLeftMenu] = useState(false);
  const [_badgeNumber, _setBadgeNumber] = useState(0);
  const setShowLeftMenu = (showLeftMenu: boolean) => {
    _setShowLeftMenu(showLeftMenu);
  };

  const setBadgeNumber = (badgeNumber: number) => {
    _setBadgeNumber(badgeNumber);
  };

  return useMemo(
    () => ({
      showLeftMenu: _showLeftMenu,
      setShowLeftMenu,
      badgeNumber: _badgeNumber,
      setBadgeNumber,
    }),
    [_showLeftMenu, _badgeNumber]
  );
};

const LayoutProvider = (props: any) => {
  const { children, navigation, params } = props;
  const transferContextData = useTemplateContextValue(navigation);
  return (
    <LayoutContext.Provider value={transferContextData}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutProvider;
