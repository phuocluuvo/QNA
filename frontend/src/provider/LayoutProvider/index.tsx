import React, { useMemo, useState } from "react";

const TemplateDafaultValue = {
  showLeftMenu: false,
  setShowLeftMenu: (showLeftMenu: boolean) => {},
};

export const LayoutContext = React.createContext(TemplateDafaultValue);

export const useTemplateContextValue = (navigation: {
  navigate: (arg0: string) => void;
}) => {
  const [_showLeftMenu, _setShowLeftMenu] = useState(false);

  const setShowLeftMenu = (showLeftMenu: boolean) => {
    _setShowLeftMenu(showLeftMenu);
  };

  return useMemo(
    () => ({
      showLeftMenu: _showLeftMenu,
      setShowLeftMenu,
    }),
    [_showLeftMenu]
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
