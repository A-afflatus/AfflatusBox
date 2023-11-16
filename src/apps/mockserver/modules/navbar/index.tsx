import React, { useState } from 'react';
import { ConfigProvider, Tree, theme } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { IconFolder, IconHttpGet, IconHttpPost, IconSearch, IconServer } from '@tabler/icons-react';
import { Navbar, ScrollArea, Input, Tooltip, ActionIcon } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';


const App: React.FC = () => {
    const themeColor = useColorScheme()
    const defaultData: DataNode[] = [{
        key: '0-0',
        title: '独立服务器',
        icon: <IconServer color='#10D396' />,
        children: [
            {
                key: '0-0-0-0',
                icon: <IconHttpPost color='#1990FF' />,
                title: '/api/mockserver/test/getUserInfo',
            },
            {
                key: '0-0-0-1',
                icon: <IconHttpGet color='#40CA9D' />,
                title: 'leaf',
            },
            {
                key: '0-0-0-2',
                icon: <IconHttpPost />,
                title: 'leaf',
            },
        ]
    },
    {
        key: '0-1',
        title: '独立服务器1',
        icon: <IconServer color='#4FC1FF' />,
    }
    ];
    return (
        <Navbar p="xs" width={{ base: '30vh' }} style={{ borderRight: '1px solid #EEEEEE' }}>
            <Navbar.Section>
                <Input
                    placeholder="搜索接口"
                    rightSection={
                        <Tooltip label="点击搜索" position="right" withArrow>
                            <ActionIcon variant="transparent">
                                <IconSearch size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                            </ActionIcon>
                        </Tooltip>
                    }
                />
            </Navbar.Section>
            <Navbar.Section grow style={{ whiteSpace: 'nowrap', marginTop: 5 }} component={ScrollArea} >
                <ConfigProvider
                    theme={{
                        algorithm: themeColor === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    }}
                >
                    <Tree
                        style={{ marginLeft: -8 }}
                        showIcon={true}
                        treeData={defaultData}
                    />

                </ConfigProvider>
            </Navbar.Section>
        </Navbar>
    );
};

export default App;