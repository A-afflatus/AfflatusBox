import { Progress, ScrollArea, Space, Table} from '@mantine/core';
import { useState } from 'react';
import { createStyles, getStylesRef } from '@mantine/core';
import {
    IconFileReport,
    IconFileCheck,
} from '@tabler/icons-react';
const useStylesNavbar = createStyles((theme) => ({
    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,

            [`& .${getStylesRef('icon')}`]: {
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            },
        },
    },

    linkIcon: {
        ref: getStylesRef('icon'),
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            [`& .${getStylesRef('icon')}`]: {
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
            },
        },
    },
}));
const useStylesFileTable = createStyles((theme) => ({
    header: {
      position: 'sticky',
      top: 0,
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      transition: 'box-shadow 150ms ease',
      zIndex: 1,
  
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        // borderBottom: `${rem(1)} solid ${
        //   theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
        // }`,
      },
    },
  
    scrolled: {
      boxShadow: theme.shadows.sm,
    },
  }));


export function NavbarSimple() {
    const { classes, cx } = useStylesNavbar();
    const [active, setActive] = useState<'downloading' | 'ok'>('downloading');

    return (
        <div style={{ width: "20%" }}>
            <a
                className={cx(classes.link, { [classes.linkActive]: 'downloading' === active })}
                onClick={(event) => {
                    event.preventDefault();
                    setActive('downloading');
                }}
            >
                <IconFileReport size='1rem' className={classes.linkIcon} stroke={1.5} />
                <span>下载中</span>
            </a>
            <a
                className={cx(classes.link, { [classes.linkActive]: 'ok' === active })}
                onClick={(event) => {
                    event.preventDefault();
                    setActive('ok');
                }}
            >
                <IconFileCheck size='1rem' className={classes.linkIcon} stroke={1.5} />
                <span>已完成</span>
            </a>
        </div>
    );
}

type FileItem = {
    name: string;
    size: number;
    progress: number;
    finishTime: string;
}

type FileTableProps = {
    files: FileItem[];
}

export function FileTable({ files }: FileTableProps) {
    const { classes, cx } = useStylesFileTable();
    const [scrolled, setScrolled] = useState(false);
    return (
        <ScrollArea h='100%' w='100%' onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table verticalSpacing="xs" striped highlightOnHover style={{whiteSpace: 'nowrap'}} >
                <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                    <tr>
                        <th>名称</th>
                        <th>大小</th>
                        <th style={{minWidth:'100px'}}>进度</th>
                        <th>下载时间</th>
                        <th>完成时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => (
                        <tr key={file.name}>
                            <td>{file.name}</td>
                            <td>{file.size+"kb"}</td>
                            <td><Progress value={75} label="75%" size="xl" radius="xl" striped={false} animate={false}/></td>
                            <td>{file.finishTime}</td>
                            <td>{file.finishTime}</td>
                            <td>暂停/继续｜取消/删除</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </ScrollArea>
    );
}
export default function DownloadPage() {

    const files: FileItem[] = [
        {
            name: 'test1',
            size: 100,
            progress: 0.5,
            finishTime: '2021-10-10 10:10:10'
        },
        {
            name: 'test2',
            size: 100,
            progress: 0.5,
            finishTime: '2021-10-10 10:10:10'
        },
        {
            name: 'test2',
            size: 100,
            progress: 0.5,
            finishTime: '2021-10-10 10:10:10'
        },
        {
            name: 'test2',
            size: 100,
            progress: 0.5,
            finishTime: '2021-10-10 10:10:10'
        },
        {
            name: 'test2',
            size: 100,
            progress: 0.5,
            finishTime: '2021-10-10 10:10:10'
        },
        {
            name: 'test2',
            size: 100,
            progress: 0.5,
            finishTime: '2021-10-10 10:10:10'
        },
        {
            name: 'test2',
            size: 100,
            progress: 0.5,
            finishTime: '2021-10-10 10:10:10'
        },
        {
            name: 'test2',
            size: 100,
            progress: 0.5,
            finishTime: '2021-10-10 10:10:10'
        },
        {
            name: 'test2',
            size: 100,
            progress: 0.5,
            finishTime: '2021-10-10 10:10:10'
        },
        {
            name: 'test2',
            size: 100,
            progress: 0.5,
            finishTime: '2021-10-10 10:10:10'
        },
        {
            name: 'test2',
            size: 100,
            progress: 0.5,
            finishTime: '2021-10-10 10:10:10'
        }
    ]


    return (
        <>
            <div style={{ display: 'flex', height: '70vh' }}>
                <NavbarSimple />
                <Space w="md" />
                <FileTable files={files} />
            </div>
        </>
    )
}
