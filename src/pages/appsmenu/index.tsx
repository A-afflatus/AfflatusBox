import {
    SimpleGrid,
} from '@mantine/core';
import AppCard,{AppData} from './appcard';
import {CHATBOT, GITHUBHOTREPO, S3CLIENT} from '@/routers/constant';
import {
    IconBrandAws,
    IconCameraRotate,
    IconReceipt,
    IconReceiptTax,
    IconBrandGithub,
    IconReport,
    IconCashBanknote,
    IconCoin,
    IconMessageChatbot,
} from '@tabler/icons-react';

const appList:AppData[] = [
    { title: 'S3客户端', icon: IconBrandAws, color: 'yellow',route:{link:S3CLIENT,type:'router'} },
    { title: '聊天机器人', icon: IconMessageChatbot, color: 'blue',route:{link:CHATBOT,type:'router'} },
    { title: 'Github热门项目', icon: IconBrandGithub, color: 'red',route:{link:GITHUBHOTREPO,type:'router'} },
    { title: '图片转换(尽情期待)', icon: IconCameraRotate, color: 'indigo' },
    { title: '占个位置4', icon: IconReceipt, color: 'teal' },
    { title: '占个位置5', icon: IconReceiptTax, color: 'cyan' },
    { title: '占个位置6', icon: IconReport, color: 'pink' },
    { title: '占个位置7', icon: IconCoin, color: 'red' },
    { title: '占个位置8', icon: IconCashBanknote, color: 'orange' },
];

export default function ActionsGrid() {
    return (
        <>
            <SimpleGrid cols={1} mt="md">
                <AppCard cardName='暂不分类工具' appList={appList}/>
            </SimpleGrid>
        </>
    );
}