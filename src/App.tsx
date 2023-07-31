import { Outlet } from "react-router-dom";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useState } from "react";
import FloatingMenu from '@/component/floatingmenu/FloatingMenu';
import { getColorScheme, toggleColorScheme } from '@/redux';
import GlobalSearch from '@/component/floatingmenu/GlobalSearch';
import { Notifications } from "@mantine/notifications";

function App() {
  //主题颜色
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  //从主进程获取主题颜色
  getColorScheme()
    .then((color: ColorScheme) => {
      setColorScheme(color)
    })
  //切换主题颜色函数
  const toggleColor = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    toggleColorScheme()
  }

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColor}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: colorScheme }}>
        {/* //全局搜索 */}
        <GlobalSearch children={
          //内容
          <Outlet />
        } />
        <Notifications autoClose={3000} position="bottom-right" />
        {/* 悬浮菜单、主体切换 */}
        <FloatingMenu colorScheme={colorScheme} toggleColorScheme={toggleColor} />
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default App
