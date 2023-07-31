import {
    createStyles,
    Card,
    Text,
    SimpleGrid,
    UnstyledButton,
    Anchor,
    Group,
    rem,
} from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import {toLink} from '@/routers';
import { useNavigate } from 'react-router-dom';

type RouteData = {
    link:string
    type:LinkType
}

export type AppData = {
    title: string;
    icon: (props: TablerIconsProps) => JSX.Element;
    color: string;
    route?: RouteData;
};

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: theme.radius.md,
        height: rem(90),
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease, transform 100ms ease',

        '&:hover': {
            boxShadow: theme.shadows.md,
            transform: 'scale(1.05)',
        },
    },
}));

type AppCardProps = {
    cardName: string;
    appList: AppData[];
}

export default function AppCard({ appList, cardName }: AppCardProps) {
    const { classes, theme } = useStyles();
    const navigate = useNavigate()
    //跳转工具
    const toToolRoute = (routeData?:RouteData)=>{
        if(routeData){
            if(routeData.type === 'router'){
                toLink({route:routeData.link,navigate})
                return 
            }
            toLink(routeData.link)
        }
    }
    //处理数据
    const items = appList.map((item) => (
        <UnstyledButton key={item.title} className={classes.item} onClick={() =>toToolRoute(item.route)}>
            <item.icon color={theme.colors[item.color][6]} size="2rem" />
            <Text size="xs" mt={7}>
                {item.title}
            </Text>
        </UnstyledButton>
    ));
    //跳转
       
    return (
        <Card withBorder radius="md" className={classes.card} padding='md'>
            <Group position="apart">
                <Text className={classes.title}>{cardName}</Text>
                <Anchor size="xs" color="dimmed" sx={{ lineHeight: 1 }}>
                    {items.length} 个工具
                </Anchor>
            </Group>
            <SimpleGrid cols={3} mt="md">
                {items}
            </SimpleGrid>
        </Card>
    )
}
