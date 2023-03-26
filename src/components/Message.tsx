import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { Channel, DiscordAccount, Message } from '@prisma/client';
import Content from './message/Content';

import styles from '../pages/archive/archive.module.css';
import Image from 'next/image';

interface MessageProps {
	msg: Message & {
		author: DiscordAccount;
	};
}

function convertTimestamp(time: Date): string {
	const formattedDate = time.getDate() + '/' + time.getMonth() + 1 + '/' + time.getFullYear();
	const formattedTime = time.getHours() + ':' + time.getMinutes();

	return formattedDate + ' ' + formattedTime;
}

const Message: React.FC<MessageProps> = ({ msg }) => {
	const [date, setDate] = useState(convertTimestamp(msg.createdAt));
	const [avatar, setAvatar] = useState(msg.author.avatarUrl ?? 'https://cdn.discordapp.com/avatars/181373580716539904/41ed47c71315e75fca9dfcb172ba0bf5.png');

	return (
		<div key={msg.messageId} className={styles.messageRoot}>
			<div className={styles.avatarsection}>
				<Image className={styles.avatar} src={avatar} width={40} height={40} alt="" />
			</div>
			<div className={styles.contentsection}>
				<div className={styles.usernamebracket}>
					<span className={styles.username}>{msg.author.username}</span>
					<span className={styles.timestamp}>{date}</span>
				</div>
				<Content text={msg.rawContent ?? ''} />
			</div>
		</div>
	);
};

export default Message;
