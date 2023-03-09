import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';

export const archiveRouter = createTRPCRouter({
	getChannel: publicProcedure.input(z.object({ channelId: z.string().nullish(), take: z.number().nullish(), skip: z.number().nullish() })).query(async ({ ctx, input }) => {
		const { channelId, take, skip } = input;
		if (!channelId) return { channel: null, error: 'Does not have ChannelID' };

		const takeAmount = take || 25;
		const skipAmount = skip || 0;

		try {
			const data = await ctx.prisma.channel.findUnique({
				where: {
					channelId: channelId,
				},
				include: {
					messages: {
						take: takeAmount,
						skip: skipAmount,
						include: {
							author: true,
						},
					},
				},
			});

			if (!data)
				return {
					channel: null,
					error: 'Channel does not exist',
				};

			return {
				channel: data,
				error: null,
			};
		} catch (err) {
			console.log(err);
			return { channel: null, error: 'Unexpected error' };
		}
	}),
});
