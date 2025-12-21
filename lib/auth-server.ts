import { headers } from "next/headers";
import { auth } from "./auth";

export async function getServerSession() {
	"use server";
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session;
}

export async function requireAuth() {
	const session = await getServerSession();
	if (!session) {
		throw new Error("Unauthorized");
	}
	return session;
}

export async function requireRole(allowedRoles: string[]) {
	const session = await requireAuth();
	const userRole = (session.user).role || "READER";

	if (!allowedRoles.includes(userRole)) {
		throw new Error("Forbidden");
	}
	return session;
}
