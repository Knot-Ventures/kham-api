/* eslint-disable prettier/prettier */
import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Prisma, User as PrismaUser } from '@prisma/client';
import axios from 'axios';
import { error } from 'console';
import * as crypto from 'crypto';
import { MulticastMessage } from 'firebase-admin/messaging';
import { ObjectId, UpdateResult } from 'mongodb';
import { Connection as MongoConnection } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ReportUserDto } from './dto/report-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Tag } from './entities/data/tag.data';
import { User } from './entities/user.entity';
import { safeObjectId } from '../../helpers/object-id';
import { Link } from './entities/data/link.data';
import { LinkCategory } from './entities/data/link-section.data';

const DEFAULT_CATEGORY_ID = 'default';
const DEFAULT_LABEL_ID = 'default';
@Injectable()
export class UsersService {
	@Inject()
	private prisma: PrismaService;
	@Inject()
	private firebase: FirebaseService;

	@InjectConnection()
	private connection: MongoConnection;

	reportUser({
		description,
		reportedUserId,
		reportingUserId,
		title,
		state,
	}: ReportUserDto) {
		return this.prisma.userFlagReport.create({
			data: {
				description,
				reportedUser: { connect: { id: reportedUserId } },
				reportingUser: { connect: { id: reportingUserId } },
				title,
				state,
			},
		});
	}
	//#region Basic CRUD
	async generateUsername(
		dto: Pick<CreateUserDto, 'fullName' | 'firebaseUID'>,
	): Promise<string> {
		const basename = dto.fullName
			.trim()
			.replace(/[^\w\d_\-\.]+/g, '-')
			.split(/\s/)
			.join('.')
			.toLowerCase();
		const nameMap = { [basename]: true };
		for (let i = 0; i < 25; i++) {
			const extLength = i < 10 ? 1 : Math.floor(i / 5);
			nameMap[
				`${basename}-${crypto
					.randomBytes(extLength * 3)
					.toString('base64url')
					.toLowerCase()}` // base64url with lower case might reduce the final count of the possible names
			] = true;
		}
		const nameArray = Object.keys(nameMap);
		const users = await this.prisma.user.findMany({
			where: {
				username: { in: nameArray },
			},
			select: { username: true },
		});
		for (const user of users) {
			delete nameMap[user.username];
		}

		const finalUsernames = Object.keys(nameMap);
		if (!finalUsernames.length) return dto.firebaseUID;
		return finalUsernames[0];
	}

	async create(
		dto: CreateUserDto,
		connect?: Pick<
			Prisma.UserCreateInput,
			| 'products'
			| 'enterprise'
			| 'enterpriseAccess'
			| 'eventOrganizer'
			| 'connectionsBlocked'
			| 'connectionsInitiated'
			| 'connectionsReceived'
		>,
	): Promise<PrismaUser> {
		const {
			firebaseUID,
			fullName,
			birthday,
			email,
			phone,
			address,
			bio,
			businessDetails,
			userType,
			createdById,
			createdAt,
			id: _id,
			createdByCollection,
		} = dto;
		const username = await this.generateUsername(dto);

		const id = safeObjectId(_id) ? _id : undefined;
		return this.prisma.user.create({
			data: {
				...(connect ?? {}),

				firebaseUID,
				fullName,
				username,
				birthday,
				primaryEmail: email,
				primaryPhone: phone,
				userType,
				linksCategories: {
					'my-links': {
						index: 0,
						labels: { [DEFAULT_LABEL_ID]: 'My Links' },
						enabled: true,
						links: [],
					},
					// [DEFAULT_CATEGORY_ID]: {
					// 	index: 1,
					// 	labels: { [DEFAULT_LABEL_ID]: 'Links' },
					// 	enabled: true,
					// 	links: [],
					// },
				},
				address,
				bio,
				businessDetails,
				createdAt,
				createdById,
				id,
				createdByCollection,
			},
		});
	}

	async findAll(): Promise<PrismaUser[]> {
		return this.prisma.user.findMany();
		// return (await this.connection
		// 	.collection('users.ts')
		// 	.find({ _id: new ObjectId('6305898b48794f7979819a25') })
		// 	.toArray()) as any;
	}

	findOne(id: string, include?: Prisma.UserInclude): Promise<PrismaUser> {
		return this.prisma.user.findUnique({
			where: { id },
			include,
		});
	}
	findOneByUsername(
		username: string,
		include?: Prisma.UserInclude,
	): Promise<PrismaUser> {
		return this.prisma.user.findUnique({
			where: { username },
			include,
		});
	}
	checkUsernameString(username: string): boolean {
		if (typeof username != 'string' || !username) return false;
		return new RegExp(/^[\w\d-_.]+$/).test(username);
	}

	async isUserNameAvailable(username: string): Promise<boolean> {
		if (!this.checkUsernameString(username)) return false;

		const user = await this.prisma.user.findUnique({
			where: { username: username.toLowerCase() },
			select: { username: true },
		});

		return !user;
	}

	static includeConnectionsReceived = {
		connectionsReceived: { include: { initiatedBy: true } },
	};

	static includeConnectionsInitiated = {
		connectionsInitiated: { include: { receivedBy: true } },
	};
	static includeAllConnections = {
		...UsersService.includeConnectionsInitiated,
		...UsersService.includeConnectionsReceived,
	};

	static includeAttendedEvents = {
		attendedEvents: true,
	};
	static includeProducts = {
		products: true,
	};

	static includeEnterprise = {
		enterprise: true,
	};
	static includeEnterpriseAccess = {
		enterpriseAccess: true,
	};
	static includeAll = {
		...UsersService.includeAllConnections,
		...UsersService.includeAttendedEvents,
		...UsersService.includeProducts,
		...UsersService.includeEnterprise,
		...UsersService.includeEnterpriseAccess,
	};

	async getVCard(id: string) {
		try {
			const user: PrismaUser = await this.findOne(id);

			const formattedName = [
				// user.title != null && user.title,
				user.fullName,
			].join(' ');

			const emails = user?.emails
				?.filter((element) => element.enabled)
				.map((value, key) => `EMAIL;PREF=${key + 2}:${value.value}`);

			if (user?.primaryEmailEnabled && user?.primaryEmail) {
				emails.unshift(`EMAIL;PREF=1;TYPE=main:${user!.primaryEmail!}`);
			}

			const phones = user?.phones
				?.filter((element) => element.enabled)
				.map(
					(value, key) =>
						`TEL;TYPE=voice;PREF=${key + 2}:${value.value}`,
				);

			if (user?.primaryPhoneEnabled && user?.primaryPhone) {
				phones.unshift(`TEL;TYPE=voice;PREF=1:${user!.primaryPhone!}`);
			}

			const apps = Object.entries(user.links ?? {})
				.filter(
					([key, value]) =>
						value.enabled &&
						[
							'FACEBOOK',
							'TELEGRAM',
							'TWITTER',
							'INSTAGRAM',
							'TIKTOK',
							'SNAPCHAT',
							'AMAZON',
							'LINKEDIN',
							'YOUTUBE',
						].includes(value.type) &&
						value.value.length, //&& value.type != 'CUSTOM' && value.type != 'WHATSAPP'
				)
				.map(
					([key, value]) =>
						`URL;TYPE=${value?.labels?.default ?? value.type}:${
							value.value
						}`,
				);

			const names = (user!.fullName ?? '').split(' ');

			const familyNames = [
				names.length > 1 && names[names.length - 1],
			].join(',');
			const givenNames = [
				names.length !== 0 ? names[0] : user.fullName ?? '',
			].join(',');
			const additionalNames = [
				...(names.length > 2 ? names.splice(1, names.length) : []),
			].join(',');
			const honorificPrefixes = [
				/*user.title ?? ''*/
			].join(',');
			const honorificSuffixes = [].join(',');

			const profileImg = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(
				'knot-k6789.appspot.com',
			)}/o/${encodeURIComponent(
				`users/${user.id}/profile_1280x720`,
			)}?alt=media&token=${encodeURIComponent(
				'E)H@McQfTjWnZr4t7w!z%C*F-JaNdRgUkXp2s5v8x/A?D(G+KbPeShVmYq3t6w9z',
			)}`;

			let image = null;
			try {
				const res = await axios.get(profileImg, {
					responseType: 'arraybuffer',
				});
				const dataImage = res.data.toString('base64');
				image = `PHOTO;TYPE=WEBP;ENCODING=b:${dataImage}`;
			} catch (e) {
				console.log(error);
				image = `PHOTO;TYPE=WEBP;VALUE=URI:${profileImg}`;
			}

			const note = [];
			const bio = user.bio?.trim();
			if (bio) {
				note.push(`NOTE:${bio}`);
			}

			const lines = [
				'BEGIN:VCARD',
				'VERSION:3.0',
				image,
				`FN:${formattedName}`, //FORMATTED NAME
				`N:${familyNames};${givenNames};${additionalNames};${honorificPrefixes};${honorificSuffixes}`,
				...emails,
				...phones,
				...apps,
				...note,
				'END:VCARD',
			];
			return {
				vcard: lines.join('\n'),
				user,
				filename: `${user.fullName ?? ''}_knot.vcf`,
			};
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException(e);
		}
	}

	findOneIncludeAll(id: string): Promise<PrismaUser> {
		return this.prisma.user.findUnique({
			where: { id },
			include: UsersService.includeAll,
		});
	}

	async findOneIncludeAllByFirebaseUID(id: string): Promise<PrismaUser> {
		const t = await this.prisma.user.findUnique({
			where: { firebaseUID: id },
			include: UsersService.includeAll,
		});
		// console.log(t);
		return t;
	}
	findOneByFirebaseUID(
		id: string,
		include?: Prisma.UserInclude,
	): Promise<PrismaUser> {
		return this.prisma.user.findUnique({
			where: { firebaseUID: id },
			include,
		});
	}

	update(id: string, updateUserDto: UpdateUserDto): Promise<PrismaUser> {
		return this.prisma.user.update({
			where: { id },
			data: updateUserDto,
		});
	}

	async remove(uid: string) {
		const user = await this.prisma.user.delete({ where: { id: uid } });
		return await this.firebase.defaultApp
			.auth()
			.deleteUser(user.firebaseUID);
	}
	//#endregion

	//#region Events
	attendEvent(id: string, eventID: string) {
		return this.prisma.user.update({
			where: { id },
			data: {
				attendedEvents: {
					connect: {
						id: eventID,
					},
				},
			},
		});
	}
	//#endregion

	//#region Tag
	async deleteTag(id: string, tagName: string): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$unset: {
					[`tags.${tagName}`]: '',
				},
			},
		);
	}
	async createTag(id: string, tag: Tag): Promise<UpdateResult> {
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					[`tags.${tag.name}`]: tag,
				},
			},
		);
	}
	async updateTag(
		id: string,
		tagName: string,
		tag: Tag,
	): Promise<UpdateResult> {
		let update: any = {
			$set: {
				[`tags.${tag.name}`]: tag,
			},
		};
		if (tagName != tag.name)
			update = {
				...update,
				$unset: {
					[`tags.${tagName}`]: '',
				},
			};
		return await this.connection.collection('users').updateOne(
			{ _id: new ObjectId(id) },
			{
				...update,
			},
		);
	}
	//#endregion

	//#region Notification
	addFcmToken(uid: string, token: string): Promise<PrismaUser> {
		return this.prisma.user.update({
			where: { id: uid },
			data: {
				fcmTokens: {
					push: token,
				},
			},
		});
	}
	updateFcmTokens(uid: string, tokens: string[]): Promise<PrismaUser> {
		return this.prisma.user.update({
			where: { id: uid },
			data: {
				fcmTokens: tokens,
			},
		});
	}
	async notifyUser(
		user: PrismaUser,
		message: Omit<MulticastMessage, 'tokens'>,
	) {
		if (user.fcmTokens?.length > 0) {
			const tokens = Array.from(new Set(user.fcmTokens));
			try {
				const res = await this.firebase.defaultApp
					.messaging()
					.sendMulticast({
						tokens,
						...message,
					});

				if (res.failureCount) {
					const newTokens = [];
					res.responses.forEach((r, index) => {
						if (
							[
								'messaging/invalid-registration-token',
								'messaging/registration-token-not-registered',
							].includes(r.error?.code)
						) {
							return;
						}

						newTokens.push(tokens[index]);
					});
				}
			} catch (e) {}
		}
	}

	async testNotifyUser(uid: string) {
		if (process.env.NODE_ENV == 'production') {
			throw new BadRequestException();
		}
		const user = await this.prisma.user.findUnique({
			where: { id: uid },
		});
		// console.log({ fcmTokens: user.fcmTokens });
		if (user.fcmTokens?.length > 0) {
			const tokens = Array.from(new Set(user.fcmTokens));
			try {
				const res = await this.firebase.messaging.sendMulticast({
					tokens,
					data: {
						notificationType: 'ACTION',
						actionType: 'ACCEPT_CONNECTION',
						body: `accepted your connection request`,
						title: 'Connection Request Accepted',
						click_action: 'FLUTTER_NOTIFICATION_CLICK',
					},
					// notification: {
					// 	// body: `accepted your connection request`,
					// 	// title: 'Connection Request Accepted',
					// },
				});

				if (res.failureCount) {
					console.log({ failureCount: res.failureCount });
					const newTokens = [];
					// res.results.forEach((r, index) => {
					// 	if (
					// 		[
					// 			'messaging/invalid-registration-token',
					// 			'messaging/registration-token-not-registered',
					// 		].includes(r.error?.code)
					// 	) {
					// 		return;
					// 	}

					// 	newTokens.push(tokens[index]);
					// });
				}
			} catch (e) {}
		}
	}

	//#endregion

	//#region Migrations

	async migrateAllUsersToV2() {
		const users = await this.prisma.user.findMany({
			where: {
				OR: [
					{ documentVersion: 'v1' },
					{ documentVersion: { isSet: false } },
				],
			},
		});
		let count = 0;
		const errors = [0];
		for (const user of users) {
			try {
				await this.migrateUserToV2(user);
				count++;
			} catch (e) {
				errors.push(e);
			}
		}
		return { count, errors };
	}

	async migrateUserToV2ById(id: string) {
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (user.documentVersion == 'v2') return;
		return this.migrateUserToV2(user);
	}
	async migrateUserToV2(user: PrismaUser) {
		if (user.documentVersion == 'v2') return;
		const userV2 = await this.convertV1UserToV2(user);
		// console.log({ userV2 });
		return this.prisma.user.update({
			where: { id: user.id },
			data: {
				links: userV2.links,
				linksCategories: userV2.linksCategories,
				documentVersion: 'v2',
			},
		});
	}

	async convertV1UserToV2(user: PrismaUser): Promise<User> {
		const links: Record<string, Link> = {};
		const linksCategories: Record<string, LinkCategory> = {
			'my-links': {
				enabled: true,
				labels: { default: 'My Links', ar: 'روابطي' },
				index: 0,
				links: [],
			},
		};

		Object.entries(user.apps ?? {}).forEach(([key, value]) => {
			const app = new Link();
			app.value = value.value;
			app.enabled = value.enabled;
			app.type = key;
			app.labels = { default: key };
			links[key] = app;
			linksCategories[`my-links`].links.push(key);
		});

		Object.entries(user.customApps).forEach(
			([categoryKey, category], i) => {
				const newCategory = new LinkCategory();
				newCategory.enabled = category.enabled;
				newCategory.labels = category.labels;
				newCategory.index = i + 1;
				newCategory.links = [];
				Object.entries(category.apps ?? {}).forEach(
					([key, value]: any) => {
						const app = new Link();
						app.value = value.value;
						app.enabled = value.enabled;
						app.type = 'CUSTOM';
						app.labels = value.labels;
						app.icon = value.icon;
						links[key] = app;
						newCategory.links.push(key);
					},
				);
				linksCategories[categoryKey] = newCategory;
			},
		);

		return { ...user, links, linksCategories, documentVersion: 'v2' };
	}
	//TODO update Vcard
	//#endregion
}
