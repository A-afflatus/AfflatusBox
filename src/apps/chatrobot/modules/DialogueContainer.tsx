import { Container, Paper, createStyles } from "@mantine/core";
import { IconRobot, IconUser } from "@tabler/icons-react";
import { render } from '@/utils/markdownit';
import styles from './table.module.css';

const useStyles = createStyles((theme) => ({
    context: {
        backgroundColor: theme.colorScheme === 'dark' ? '#25262b' : '#ffffff',
    }
}));
type Props = {
    robot: boolean;
}

export default function DialogueContainer({ robot }: Props) {
    const { classes } = useStyles();
    //发送消息
    const a = ":satellite:\n```typescript\ninterface Person {\n  name: string;\n  age: number;\n  address?: string;\n}\n\nfunction sayHello(person: Person): void {\n  console.log(`Hello, my name is ${person.name} and I'm ${person.age} years old.`);\n  if (person.address) {\n    console.log(`I'm from ${person.address}.`);\n  }\n}\n\nconst john: Person = {\n  name: 'John',\n  age: 30\n};\n\nsayHello(john);\n```\n\n这段 TypeScript 代码定义了一个 `Person` 接口和一个打招呼的函数 `sayHello`，并创建了一个 `john` 对象来展示如何使用它们。\n"
    + "| 时间 | 活动 | 地点 |\n| ---- | ---- | ---- |\n| 周六上午 | 出发 | 家里 |\n| 周六中午 | 午餐 | 成都小吃街 |\n| 周六下午 | 参观博物馆 | 成都博物馆 |\n| 周六晚上 | 晚餐 | 火锅店 |\n| 周日上午 | 游玩景点 | 宽窄巷子 |\n| 周日中午 | 午餐 | 锦里小吃街 |\n| 周日下午 | 咖啡茶馆 | 水井巷 |\n| 周日晚上 | 回家 | 家里 |"
    return (
        <>
            <Container fluid={true}>
                <div >
                    {robot ? <IconRobot />
                        : <div style={{ height: 30 }}><IconUser style={{ position: 'absolute', right: 40 }} /></div>
                    }
                    <Paper shadow="xl" radius="lg" p="xl" withBorder className={classes.context}>
                        <div className={styles.tableContainer} style={{ fontSize: 15,}} dangerouslySetInnerHTML={{
                            __html: render(a)
                        }} />

                    </Paper>
                </div>

            </Container>
        </>
    )
}
