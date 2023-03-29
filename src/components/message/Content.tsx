import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import styles from '../../pages/archive/archive.module.css';

interface IDProps {
	id: string;
}

const UserMention = ({ id }: IDProps) => {
	const userData = api.archive.getUser.useQuery({ userId: id });
	const [displayName, setDisplayName] = useState(id);

	useEffect(() => {
		if (userData.isFetched) {
			const user = userData.data?.user;
			if (user) {
				setDisplayName(`@${user.username ?? id}`);
			} else {
				setDisplayName('@Unknown User');
			}
		}
	}, [userData]);

	return <span className={styles.mention}>{displayName}</span>;
};

interface MessageProps {
	text: string;
}

const Message: React.FC<MessageProps> = ({ text }) => {
	const userMentionRegex = /<@(\S+)>/g;
	const userMentionMatches = [...text.matchAll(userMentionRegex)];
	const emojiRegex = /<:([a-zA-Z0-9_]+):(\d+)>/g;

	let currentIndex = 0;
	const renderedText = userMentionMatches.map((match, index) => {
		const matchIndex = match.index || 0;
		const matchText = match[0];
		const matchId = match[1];

		const textBeforeMatch = text.slice(currentIndex, matchIndex);
		currentIndex = matchIndex + matchText.length;

		return (
			<React.Fragment key={index}>
				<span>{textBeforeMatch}</span>
				<UserMention id={matchText} />
			</React.Fragment>
		);
	});

	const textAfterLastMatch = text.slice(currentIndex);
	renderedText.push(<span key={userMentionMatches.length}>{textAfterLastMatch}</span>);

	return <div className={styles.content}>{renderedText}</div>;
};

export default Message;
