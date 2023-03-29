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

function formatDate(date: Date) {
	const day = addLeadingZero(date.getDate());
	const month = addLeadingZero(date.getMonth() + 1);
	const year = date.getFullYear();
	const hours = addLeadingZero(date.getHours());
	const minutes = addLeadingZero(date.getMinutes());
	return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function addLeadingZero(value: number) {
	return value.toString().padStart(2, '0');
}

const Message: React.FC<MessageProps> = ({ msg }) => {
	const [date, setDate] = useState(formatDate(msg.createdAt));
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
