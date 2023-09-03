import { Grid, MultiSelect, Select, SimpleGrid, TextInput } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import Repocard from './modules/repocard';
import { LANGUAGES } from '@/utils/constant';
import { useForm } from "@mantine/form";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect } from "react";
export default function GithubHotRepo() {
    const [value, setValue] = useDebouncedState('', 500);
    const form = useForm({
        initialValues: {
            languages:[],
            date:'今日',
            sort:'Stars',
        },
    });
    useEffect(()=>{
        //todo 重新查
        
    },[form.values, value])
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
                        {...form.getInputProps('languages')}
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
                            data={['Stars', '发布时间']}
                            {...form.getInputProps('sort')}
                        />
                    </Grid.Col>

                    <Grid.Col span={3}>
                        <TextInput
                            placeholder="关键字"
                            withAsterisk
                            onChange={(event) => {
                                setValue(event.currentTarget.value)
                            }}
                        />
                    </Grid.Col>
                </Grid>
            </div>
            <div style={{ marginTop: '60px', marginLeft: '15px', width: 'calc(100% - 30px) ', }}>
                <SimpleGrid cols={3} mt="md">
                    {
                        [2131, 2, 3213, 445, 5765, 6876, 7, 89087, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((i) => (
                            <Repocard key={i} image={"https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"} title={"github项目"} country={"中国"} description={"Completely renovated for the season 2020, Arena Verudela Bech Apartments are fully equipped and modernly furnished 4-star self-service apartments located on the Adriatic coastline by one of the most beautiful beaches in Pula."}
                                badges={[{
                                    emoji: '☀️',
                                    label: 'SUNNNY WEATHER1'
                                }, {
                                    emoji: '☀️',
                                    label: 'SUNNNY WEATHER2'
                                }, {
                                    emoji: '☀️',
                                    label: 'SUNNNY WEATHER3'
                                },]} />)
                        )
                    }
                </SimpleGrid>
            </div>
        </>
    )
}
