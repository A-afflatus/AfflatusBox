import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { IconCategory, IconHome, IconSearch, IconSettings,IconBrandGithub, IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { HOME, SETTING, APPS } from '@/routers/constant';
import {toLink} from '@/routers';
import { quitApp } from '@/redux';
type GlobalSearchProps = {
    children: JSX.Element
}
export default function GlobalSearch({ children }: GlobalSearchProps) {
    const navigate = useNavigate()
    const actions: SpotlightAction[] = [
        {
            title: '主页',
            description: '返回主页(go to home)',
            onTrigger: () => toLink({route:HOME,navigate}),
            icon: <IconHome size="1.2rem" />,
        },
        {
            title: '设置',
            description: '前往系统设置页面(to setting)',
            onTrigger: () =>toLink({route:SETTING,navigate}),
            icon: <IconSettings size="1.2rem" />,
        },
        {
            title: '功能菜单',
            description: '前往功能菜单,选择需要使用的功能(to menu)',
            onTrigger: () =>toLink({route:APPS,navigate}),
            icon: <IconCategory size="1.2rem" />,
        },
        {
            title: 'GitHub',
            description: '前往GitHub查看项目源码(to github))',
            onTrigger: () => toLink('https://github.com/A-afflatus'),
            icon: <IconBrandGithub size="1.2rem" />,
        },
        {
            title: '退出盒子',
            description: '退出程序(exit the box)',    
            onTrigger: () => quitApp(),
            icon: <IconLogout size="1.2rem" />,
        },
    ];
    return (
        <SpotlightProvider
            actions={actions}
            limit={5}
            searchIcon={<IconSearch size="1.2rem" />}
            searchPlaceholder="搜索..."
            shortcut="mod + k"
            nothingFoundMessage="什么也没找到..."
        >
            {children}
        </SpotlightProvider>

    )
}
