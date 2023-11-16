import { ActionIcon, Checkbox, Group, Table, TextInput,Button } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useState } from 'react';


const elements = [
    { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
];
export default function index() {
    const [disabled, setDisabled] = useState(true);
    const rows = elements.map((element) => (
        <tr key={element.name}>
            <td><Checkbox size={'xs'} disabled={disabled}/></td>
            <td>
                <TextInput
                    style={{
                        margin: -5,
                    }}
                    disabled={disabled}
                    variant="unstyled"
                />
            </td>
            <td>
                <Group>
                    <TextInput
                        style={{
                            margin: -5,
                            width: 'calc(100% - 35px)',
                        }}
                        disabled={disabled}
                        variant="unstyled"
                    />
                    <ActionIcon disabled={disabled}>
                        <IconX size="1.125rem" />
                    </ActionIcon>
                </Group>
            </td>
        </tr>
    ));

    return (
        <>
            <Table withColumnBorders withBorder>
                <thead>
                    <tr>
                        <th style={{ width: 30 }}><Checkbox size={'xs'} disabled={disabled}/></th>
                        <th>参数名</th>
                        <th>参数值</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
            <Button variant="default" size="xs" radius="xs" style={{width:'100%',marginTop:3}}>添加参数</Button>
        </>
    );
}