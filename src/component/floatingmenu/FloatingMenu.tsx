/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, Modal, Text, Image, ColorScheme, MantineTheme, ActionIcon } from '@mantine/core';
import { IconSettings, IconSearch, IconUser, IconCategory, IconHome, IconBrandGithub, IconLogout, IconSun, IconMoonStars } from '@tabler/icons-react';
import { CSSProperties, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WELCOME, APPS, SETTING } from '@/routers/constant';
import { quitApp } from '@/redux';
import { useDisclosure } from '@mantine/hooks';
import AuthorWX from '@/assets/authorwx.jpg';
import { spotlight } from '@mantine/spotlight';
import { toLink } from '@/routers';

export type FloatingMenuProps = {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}
//主题样式
const themeStyle = (theme: MantineTheme) => ({
  backgroundColor:
    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
  color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
})

export default function FloatingMenu(props: FloatingMenuProps) {
  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      if (!isDragging) return;
      const diffX = event.clientX - startX;
      const diffY = event.clientY - startY;

      // 计算限制范围
      const minX = 75 - window.innerWidth;
      const maxX = 0;
      const minY = 75 - window.innerHeight;
      const maxY = 0;

      // 限制横向移动范围
      let newTranslateX = diffX;
      if (diffX < minX) {
        newTranslateX = minX;
      } else if (diffX > maxX) {
        newTranslateX = maxX;
      }

      // 限制纵向移动范围
      let newTranslateY = diffY;
      if (diffY < minY) {
        newTranslateY = minY;
      } else if (diffY > maxY) {
        newTranslateY = maxY;
      }
      setTranslateX(newTranslateX);
      setTranslateY(newTranslateY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, startY]);

  const handleMouseDown = (event: any) => {
    event.preventDefault();
    setIsDragging(true);
    setStartX(event.clientX - translateX);
    setStartY(event.clientY - translateY);
  };

  const handleDoubleClick = () => {
    setTranslateX(0);
    setTranslateY(0);
  };

  const floatingStyle: CSSProperties = {
    zIndex: 9999,
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    transform: `translate(${translateX}px, ${translateY}px)`,
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: 'transform 0s ease',
  };


  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} transitionProps={{ transition: 'rotate-left' }}>
        <Image maw={400} mx="auto" radius="md" src={AuthorWX} alt="作者微信二维码" caption="扫描二维码添加作者微信好友吧!" />
      </Modal>


      <div style={floatingStyle} onMouseDown={handleMouseDown} onDoubleClick={handleDoubleClick}>
        <Menu shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={400} >
          <Menu.Target >
            <ActionIcon
              onClick={() => props.toggleColorScheme()}
              size="lg"
              sx={themeStyle}
            >
              {props.colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>系统功能</Menu.Label>
            <Menu.Item icon={<IconSettings size={14} />} onClick={() => toLink({ route: SETTING, navigate })}>设置</Menu.Item>

            <Menu.Item
              icon={<IconSearch size={14} />}
              rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
              onClick={() => spotlight.open()}
            >
              搜索
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>其余功能</Menu.Label>
            <Menu.Item icon={<IconHome size={14} />} onClick={() => toLink({ route: WELCOME, navigate })}>首页</Menu.Item>
            <Menu.Item icon={<IconCategory size={14} />} onClick={() => toLink({ route: APPS, navigate })}>功能菜单</Menu.Item>
            <Menu.Item icon={<IconUser size={14} />} onClick={open}>联系作者</Menu.Item>
            <Menu.Item icon={<IconBrandGithub size={14} />} onClick={() => toLink('https://github.com/A-afflatus')}>GitHub</Menu.Item>
            <Menu.Item color="red" icon={<IconLogout size={14} />} onClick={quitApp}>退出应用</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  );
}