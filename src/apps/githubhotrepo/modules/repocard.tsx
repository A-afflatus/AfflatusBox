/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Text,
  Group,
  Badge,
  Button,
  createStyles,
  rem,
  Tooltip,
  Avatar,
} from '@mantine/core';
import { render } from '@/utils/markdownit';
import { openUrl } from '@/redux';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

interface BadgeCardProps {
  title: string;
  star: string;
  description: string;
  homeUrl: string;
  licebse?: string;
  ownerAvatar?: string;
  ownerLogin?: string;
  badges: {
    label: string;
  }[];
}

export function Repocard({ title, description, star, badges, homeUrl, licebse,ownerAvatar,ownerLogin }: BadgeCardProps) {
  const { classes, theme } = useStyles();
  const descriptionMd = render(description ?? "")

  const features = badges.map((badge) => (
    <Badge
      color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
      key={badge.label}
    >
      {badge.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section />
      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <div style={{ width: '200px' }}>
            <Tooltip label={title}>
              <Text fz="lg" fw={500} truncate='end'>
                {title}
              </Text>
            </Tooltip>
          </div>
          <div>
            <Badge size="sm" color="yellow">{star}</Badge>
            {licebse?<>&nbsp;<Badge size="sm" >{licebse}</Badge></>:null}
          </div>
        </Group>
        <div style={{
          height: '60px',
          fontSize: 15,
          overflow: 'hidden'
        }} dangerouslySetInnerHTML={{
          __html: descriptionMd
        }} />
      </Card.Section>

      <Card.Section className={classes.section} style={{
        height: '100px',
        fontSize: 15,
        overflow: 'hidden'
      }}>
        <Text mt="md" className={classes.label} c="dimmed">
          Topics
        </Text>
        <Group spacing={7} mt={5}>
          {features}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }} onClick={() => openUrl(homeUrl)}>
          Show details
        </Button>
        <Tooltip label={ownerLogin}>
        <Avatar component="a" src={ownerAvatar}/>
        </Tooltip>
      </Group>
    </Card>
  );
}

export default function Project({ info }: any) {
  let starStr = info.stargazers_count + "-Star";
  if (info.stargazers_count > 1000) {
    starStr = (info.stargazers_count / 1000).toFixed(1) + "k-Star";
  }
  const badges = info.topics.map((topic: any) => ({
    label: topic
  }))
  return (
    <Repocard
      title={info.full_name}
      star={starStr}
      description={info.description}
      homeUrl={info.html_url}
      licebse={info.license?.spdx_id}
      ownerAvatar={info.owner?.avatar_url}
      ownerLogin={info.owner?.login}
      badges={badges} />
  )
}