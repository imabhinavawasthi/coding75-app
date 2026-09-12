import { getSupabaseServerClient } from './supabase-server';

export interface AuthenticatedUser {
    id: string;
    email: string;
    isAdmin: boolean;
    user_metadata?: {
        full_name?: string;
        name?: string;
        avatar_url?: string;
        picture?: string;
        [key: string]: any;
    };
}

export async function getAuthUser(req: Request): Promise<AuthenticatedUser | null> {
    try {
        const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
        let token = '';

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }

        const supabase = getSupabaseServerClient();

        if (!token) {
            // Check if email or custom header is passed in dev or fallback header
            const headerEmail = req.headers.get('x-user-email');
            if (headerEmail) {
                const adminUsersRaw = process.env.NEXT_PUBLIC_CRACKDSA_AUTHORISED_USERS || '';
                const cleanAdminEmails = adminUsersRaw
                    .replace(/[\[\]'"]/g, '')
                    .split(',')
                    .map(e => e.trim().toLowerCase())
                    .filter(Boolean);
                const isAdmin = cleanAdminEmails.includes(headerEmail.trim().toLowerCase());
                return {
                    id: headerEmail,
                    email: headerEmail,
                    isAdmin,
                    user_metadata: {}
                };
            }
            return null;
        }

        let userEmail = '';
        let userId = '';
        let userMetadata: any = {};

        const { data, error } = await supabase.auth.getUser(token);

        if (!error && data?.user?.email) {
            userEmail = data.user.email;
            userId = data.user.id;
            userMetadata = data.user.user_metadata || {};
        } else {
            // Fallback: Decode JWT payload directly
            try {
                const parts = token.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
                    if (payload && payload.email) {
                        userEmail = payload.email;
                        userId = payload.sub || payload.email;
                        userMetadata = payload.user_metadata || {
                            full_name: payload.name || payload.full_name || '',
                            avatar_url: payload.avatar_url || payload.picture || ''
                        };
                    }
                }
            } catch (decodeErr) {
                console.error('Error decoding JWT payload:', decodeErr);
            }
        }

        if (!userEmail) {
            return null;
        }

        const adminUsersRaw = process.env.NEXT_PUBLIC_CRACKDSA_AUTHORISED_USERS || '';
        const cleanAdminEmails = adminUsersRaw
            .replace(/[\[\]'"`]/g, '')
            .split(',')
            .map(e => e.trim().toLowerCase())
            .filter(Boolean);

        const isAdmin = cleanAdminEmails.includes(userEmail.trim().toLowerCase()) ||
            adminUsersRaw.toLowerCase().includes(userEmail.trim().toLowerCase());

        return {
            id: userId,
            email: userEmail,
            isAdmin,
            user_metadata: userMetadata
        };
    } catch (err) {
        console.error('Error in getAuthUser:', err);
        return null;
    }
}
