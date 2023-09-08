/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, MultiSelect, Select, SimpleGrid, Skeleton, TextInput } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import Project from './modules/repocard';
import { LANGUAGES } from '@/utils/constant';
import { useForm } from "@mantine/form";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Octokit } from "octokit";
import dayjs from "dayjs";
const octokit = new Octokit({})

export default function GithubHotRepo() {
    const [searchText, setSearchText] = useDebouncedState('', 500);
    const [languages, setLanguages] = useDebouncedState<string[]>([], 1000);
    const [loading, setLoading] = useState(true)

    const [projects, setProjects] = useState<any[]>([])
    const form = useForm({
        initialValues: {
            date: '全部时间',
            sort: 'Stars',
        },
    });
    useEffect(() => {
        setLoading(true)
        const language = languages.join(" ").trim()
        const created = (() => {
            switch (form.values.date) {
                case '今日':
                    return 'created:' + dayjs().format('YYYY-MM-DD')
                case '本周':
                    return 'created:' + dayjs().startOf('week').format('YYYY-MM-DD') + '..' + dayjs().endOf('week').format('YYYY-MM-DD')
                case '本月':
                    return 'created:' + dayjs().startOf('month').format('YYYY-MM-DD') + '..' + dayjs().endOf('month').format('YYYY-MM-DD')
                case '全部时间':
                    return ''
                default:
                    return 'created:' + dayjs().format('YYYY-MM-DD')
            }
        })()
        const q = (() => {
            const params = []
            if (searchText.trim() !== "") params.push(searchText.trim())
            if (language !== "") params.push("language:" + language.toLowerCase())
            if (created !== "") params.push(created)
            params.push('stars:>1')
            return params.join(" ")
        })()
        //获取github配置
        octokit.request('GET /search/repositories', {
            q,
            order: "desc",
            sort: (form.values.sort === '需要帮助的问题' ? 'help-wanted-issues' : form.values.sort.toLowerCase()) as any,
            page: 1,
            per_page: 30,
        }).then((res) => {
            setProjects(res.data.items)
        }).catch((err) => {
            console.log("查询失败", err)
            setProjects([])
            alert(err)
        }).finally(() => {
            setLoading(false)
        })

    }, [form.values, languages, searchText])
    return (
        <>
            <div style={{
                left: '15px',
                top: '15px',
                zIndex: 1,
                width: 'calc(100% - 30px) ',
                position: 'fixed',
            }}>
                <Grid columns={12}>
                    <Grid.Col span={5}>
                        <MultiSelect
                            placeholder="编程语言"
                            maxSelectedValues={3}
                            data={LANGUAGES}
                            searchable
                            rightSection={<IconChevronDown size="1rem" />}
                            onChange={(event) => {
                                setLanguages(event)
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Select
                            placeholder="时间"
                            rightSection={<IconChevronDown size="1rem" />}
                            rightSectionWidth={30}
                            styles={{ rightSection: { pointerEvents: 'none' } }}
                            data={['今日', '本周', '本月', '全部时间']}
                            {...form.getInputProps('date')}
                        />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Select
                            placeholder="排序"
                            rightSection={<IconChevronDown size="1rem" />}
                            rightSectionWidth={30}
                            styles={{ rightSection: { pointerEvents: 'none' } }}
                            data={["Stars", "Forks", "需要帮助的问题", "Updated"]}
                            {...form.getInputProps('sort')}
                        />
                    </Grid.Col>

                    <Grid.Col span={3}>
                        <TextInput
                            placeholder="关键字"
                            withAsterisk
                            onChange={(event) => {
                                setSearchText(event.currentTarget.value)
                            }}
                        />
                    </Grid.Col>
                </Grid>
            </div>
            <Skeleton visible={loading}>
                <div style={{ marginTop: '60px', marginLeft: '15px', width: 'calc(100% - 30px) ', }}>
                    <SimpleGrid cols={3} mt="md">
                        {
                            projects.map((project) => (<Project key={project.id} info={project} />))
                        }
                    </SimpleGrid>
                </div>
            </Skeleton>

        </>
    )
}
