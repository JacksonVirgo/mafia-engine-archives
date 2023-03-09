import styles from './archive.module.css';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '~/utils/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Channel, DiscordAccount, Message } from '@prisma/client';

type MessageData = (Message & {
	author: DiscordAccount;
})[];

const ChannelArchive: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const pageData = api.archive.getChannel.useQuery({ channelId: id ? (id as string) : '', take: 25, skip: 0 });
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
				</div>
				{messages.map((v) => {
					return (
						<div key={v.messageId} className={styles.messageRoot}>
							<div>USER ID - {v.author.discordId}</div>
							<div className={styles.messageContent}>{v.cleanContent}</div>
						</div>
					);
				})}
			</main>
		</>
	);
};

export default ChannelArchive;
