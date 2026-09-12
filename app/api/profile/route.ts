import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../_lib/supabase-server';
import { getAuthUser } from '../_lib/auth';
import { cleanCodingHandle } from '@/lib/profile-constants';

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        const supabase = getSupabaseServerClient();

        // Fetch existing profile from users table
        let { data: profile, error } = await supabase
            .from('users')
            .select('id, user_email, college, graduation_year, branch, social_links, metadata, created_at')
            .eq('user_email', user.email)
            .maybeSingle();

        if (error) {
            console.error('Error fetching user profile from users table:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const isNewUser = !profile;
        const isOnboarded = Boolean(
            !isNewUser && (
                profile?.metadata?.onboarded === true ||
                (profile?.college && profile?.branch && profile?.graduation_year)
            )
        );

        // If no record exists yet in users table, insert default row
        if (!profile) {
            const { data: newProfile, error: insertError } = await supabase
                .from('users')
                .insert({
                    user_email: user.email,
                    college: null,
                    graduation_year: null,
                    branch: null,
                    social_links: {},
                    metadata: {
                        onboarded: false,
                        full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
                        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || ''
                    }
                })
                .select('id, user_email, college, graduation_year, branch, social_links, metadata, created_at')
                .single();

            if (insertError) {
                console.error('Error creating user profile row:', insertError);
            } else {
                profile = newProfile;
            }
        }

        const userDetails = {
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
            isAdmin: user.isAdmin
        };

        return NextResponse.json({
            user: userDetails,
            isNewUser,
            isOnboarded,
            profile: {
                id: profile?.id || '',
                user_email: user.email,
                college: profile?.college || '',
                graduation_year: profile?.graduation_year || '',
                branch: profile?.branch || '',
                social_links: profile?.social_links || {},
                created_at: profile?.created_at || new Date().toISOString()
            }
        }, { status: 200 });

    } catch (err: any) {
        console.error('Error in GET /api/profile:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        const body = await req.json();
        const { college, graduation_year, branch, social_links, onboarded } = body;

        const supabase = getSupabaseServerClient();

        // Clean coding handles if provided
        const cleanedSocialLinks: Record<string, string> = {};
        if (social_links && typeof social_links === 'object') {
            for (const [key, value] of Object.entries(social_links)) {
                if (typeof value === 'string') {
                    cleanedSocialLinks[key] = cleanCodingHandle(key, value);
                }
            }
        }

        // Fetch existing metadata to preserve coding_stats or name
        const { data: existingUser } = await supabase
            .from('users')
            .select('metadata')
            .eq('user_email', user.email)
            .maybeSingle();

        const existingMetadata = existingUser?.metadata || {};
        const shouldMarkOnboarded = Boolean(
            onboarded !== undefined ? onboarded : (college && graduation_year && branch)
        );

        if (shouldMarkOnboarded) {
            existingMetadata.onboarded = true;
        }

        const updatePayload: any = {
            metadata: existingMetadata
        };
        if (college !== undefined) updatePayload.college = typeof college === 'string' ? college.trim() : null;
        if (graduation_year !== undefined) updatePayload.graduation_year = typeof graduation_year === 'string' ? graduation_year.trim() : null;
        if (branch !== undefined) updatePayload.branch = typeof branch === 'string' ? branch.trim() : null;
        if (social_links !== undefined) updatePayload.social_links = cleanedSocialLinks;

        // Upsert into users table
        const { data: updatedProfile, error: updateError } = await supabase
            .from('users')
            .upsert({
                user_email: user.email,
                ...updatePayload
            }, { onConflict: 'user_email' })
            .select('id, user_email, college, graduation_year, branch, social_links, metadata, created_at')
            .single();

        if (updateError) {
            console.error('Error updating user profile:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            isOnboarded: true,
            profile: updatedProfile
        }, { status: 200 });

    } catch (err: any) {
        console.error('Error in PUT /api/profile:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    return PUT(req);
}
