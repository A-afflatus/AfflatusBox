import { Menu, Modal, Text, Image } from '@mantine/core';
import SurfaceIcon, { FloatingMenuProps } from './SurfaceIcon';
import { IconSettings, IconSearch, IconUser, IconCategory, IconHome, IconBrandGithub, IconLogout } from '@tabler/icons-react';
import { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { WELCOME, APPS, SETTING } from '@/routers/constant';
import { quitApp } from '@/redux';
import { useDisclosure } from '@mantine/hooks';
import AuthorWX from '@/assets/authorwx.jpg';
import { spotlight } from '@mantine/spotlight';
import {toLink} from '@/routers';

//浮窗样式
const floatingStyle: CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px'
}
export default function FloatingMenu(props: FloatingMenuProps) {
  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false);


  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} transitionProps={{ transition: 'rotate-left' }}>
        <Image maw={400} mx="auto" radius="md" src={AuthorWX} alt="作者微信二维码" caption="扫描二维码添加作者微信好友吧!" />
      </Modal>


      <div style={floatingStyle}>
        <Menu shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={400} >
          <Menu.Target >
            <div>
              <SurfaceIcon {...props}></SurfaceIcon>
            </div>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>系统功能</Menu.Label>
            <Menu.Item icon={<IconSettings size={14} />} onClick={() => toLink({route:SETTING,navigate})}>设置</Menu.Item>

            <Menu.Item
              icon={<IconSearch size={14} />}
              rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
              onClick={() => spotlight.open()}
            >
              搜索
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>其余功能</Menu.Label>
            <Menu.Item icon={<IconHome size={14} />} onClick={() => toLink({route:WELCOME,navigate})}>首页</Menu.Item>
            <Menu.Item icon={<IconCategory size={14} />} onClick={() => toLink({route:APPS,navigate})}>功能菜单</Menu.Item>
            <Menu.Item icon={<IconUser size={14} />} onClick={open}>联系作者</Menu.Item>
            <Menu.Item icon={<IconBrandGithub size={14} />} onClick={() => toLink('https://github.com/A-afflatus')}>GitHub</Menu.Item>
            <Menu.Item color="red" icon={<IconLogout size={14} />} onClick={quitApp}>退出应用</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  );
}