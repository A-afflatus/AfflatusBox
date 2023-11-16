import { Input, Select, Button, Tabs, Grid, Group } from "@mantine/core";
import { IconAlignBoxLeftMiddle, IconHttpHead } from "@tabler/icons-react";
import Hearder from './modules/header';
import Body from './modules/body/body';

export default function index() {
    return (
        <div>
            <Grid>
                <Grid.Col span={11}>
                    <Group spacing={0}>
                        <Select
                            style={{
                                width: '90px',
                            }}
                            defaultValue={'get'}
                            data={[
                                { value: 'get', label: 'GET' },
                                { value: 'post', label: 'POST' },
                            ]}
                            disabled
                        />
                        <Input
                            disabled
                            style={{
                                width: 'calc(100% - 90px)',
                            }}
                            placeholder="/api/mockserver/test/getUserInfo"
                        />
                    </Group>
                </Grid.Col>
                <Grid.Col span={1}>
                    <Button>修改</Button>
                </Grid.Col>
            </Grid>
            <Tabs defaultValue="body">
                <Tabs.List>
                    <Tabs.Tab value="header" icon={<IconHttpHead size="0.8rem" />}>Header</Tabs.Tab>
                    <Tabs.Tab value="body" icon={<IconAlignBoxLeftMiddle size="0.8rem" />}>Body</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="header" pt="xs">
                    <Hearder />
                </Tabs.Panel>

                <Tabs.Panel value="body" pt="xs">
                    <Body />
                </Tabs.Panel>

            </Tabs>
        </div>
    )
}
