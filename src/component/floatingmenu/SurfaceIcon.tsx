import { ActionIcon, ColorScheme, MantineTheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
export type FloatingMenuProps = {
    colorScheme: ColorScheme;
    toggleColorScheme: (value?: ColorScheme) => void;
}
//主题样式
const themeStyle = (theme:MantineTheme) => ({
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
})


export default function FloatingMenu({colorScheme,toggleColorScheme}:FloatingMenuProps){
    return <ActionIcon
          onClick={() => toggleColorScheme()}
          size="lg"
          sx={themeStyle}
        >
          {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
        </ActionIcon>
}