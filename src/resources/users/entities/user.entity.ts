import { InferModel } from 'drizzle-orm';
import users from '../../../drizzle/schema/users';

export type User = InferModel<typeof users>;
