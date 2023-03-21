import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';

interface UserMentionProps {
	userId: string;
}
const UserMention = ({ userId }: UserMentionProps) => {
	const userData = api.archive.getUser.useQuery({ userId });
	const [displayName, setDisplayName] = useState(userId);

	useEffect(() => {
		if (userData.isFetched) {
			console.log('IS FETCHEDW');
			console.log(userData.data);
			const user = userData.data?.user;
			if (user) {
				console.log(user.username);
				setDisplayName(`@${user.username ?? userId}`);
			} else {
				setDisplayName('@Unknown User');
			}
		}
	}, [userData]);

	return <span style={{ backgroundColor: 'cyan' }}>{displayName}</span>;
};

interface MessageProps {
	text: string;
}

const Message: React.FC<MessageProps> = ({ text }) => {
	const regex = /<@(\S+)>/g;
	const matches = [...text.matchAll(regex)];

	let currentIndex = 0;
	const renderedText = matches.map((match, index) => {
		const matchIndex = match.index || 0;
		const matchText = match[0];
		const matchId = match[1];

		const textBeforeMatch = text.slice(currentIndex, matchIndex);
		currentIndex = matchIndex + matchText.length;

		return (
			<React.Fragment key={index}>
				<span>{textBeforeMatch}</span>
				<UserMention userId={matchText} />
			</React.Fragment>
		);
	});

	const textAfterLastMatch = text.slice(currentIndex);
	renderedText.push(<span key={matches.length}>{textAfterLastMatch}</span>);

	return <div>{renderedText}</div>;
};

export default Message;
