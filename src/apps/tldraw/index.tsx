import { Tldraw, TldrawProps } from '@tldraw/tldraw'
import {useMantineColorScheme } from "@mantine/core";
export default function index() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const color = useMantineColorScheme();
    const tldrawProps:TldrawProps = {
        id: 'onlyone',
        darkMode: color.colorScheme === 'dark',
        // onMount: () => {},
        // onSaveProject: () => {},
        // onSaveProjectAs: () => {},
        // onOpenProject: () => {},
        // onOpenMedia: () => {},
    }

    return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw {...tldrawProps} />
		</div>
	)
}
