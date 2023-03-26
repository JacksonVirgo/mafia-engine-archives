import styles from './archive.module.css';
import { type NextPage } from 'next';
import Head from 'next/head';
import { api } from '~/utils/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Channel, DiscordAccount, Message } from '@prisma/client';
import TextMessage from '~/components/message/Content';
import MessageComp from '~/components/Message';

type MessageData = (Message & {
	author: DiscordAccount;
})[];

const ChannelArchive: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const pageData = api.archive.getChannel.useQuery({ channelId: id ? (id as string) : '', take: 500, skip: 0 });
	const [channel, setChannel] = useState<Channel>();
	const [messages, setMessages] = useState<MessageData>([]);

	useEffect(() => {
		if (pageData.isFetched) {
			const channel = pageData.data?.channel;
			if (channel) {
				setChannel(channel);
				setMessages(channel.messages);
			}
		}
	}, [pageData]);
	return (
		<>
			<Head>
				<title>Discord Mafia Archives</title>
				<meta name="description" content="Archive of a specific channel (this is the same with all pages for now, will change)" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<div className={styles.channelStats}>
					<div>CHANNEL NAME: {channel?.name ? `#${channel.name}` : 'LOADING'}</div>
					<div>{id}</div>
				</div>
				{messages.map((v) => {
					return <MessageComp msg={v} />;
				})}
			</main>
		</>
	);
};

export default ChannelArchive;
