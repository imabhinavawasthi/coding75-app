import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../_lib/supabase-server';
import { getAuthUser } from '../../_lib/auth';
import { cleanCodingHandle } from '@/lib/profile-constants';

interface CodingSnapshot {
    synced_at: string; // ISO string
    main_rating: number;
    total_solved: number;
    leetcode: {
        handle: string;
        rating: number;
        solved: number;
        easySolved?: number;
        mediumSolved?: number;
        hardSolved?: number;
        ranking?: number | null;
        badge?: string | null;
    };
    codeforces: {
        handle: string;
        rating: number;
        maxRating?: number;
        rank?: string;
        solved: number;
    };
    codechef: {
        handle: string;
        rating: number;
        stars?: string;
        solved: number;
    };
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const MAX_HISTORY_SNAPSHOTS = 52; // 1 year of weekly snapshots

async function fetchLeetCodeStats(handle: string) {
    if (!handle) return { handle: "", rating: 0, solved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
    try {
        const query = `
            query getUserProfile($username: String!) {
              matchedUser(username: $username) {
                submitStatsGlobal {
                  acSubmissionNum {
                    difficulty
                    count
                  }
                }
                profile {
                  ranking
                }
              }
              userContestRanking(username: $username) {
                rating
                badge {
                  name
                }
              }
            }
        `;

        const res = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                "Referer": "https://leetcode.com"
            },
            body: JSON.stringify({ query, variables: { username: handle } }),
            next: { revalidate: 300 }
        });

        if (res.ok) {
            const json = await res.json();
            if (json.data?.matchedUser) {
                const acList = json.data.matchedUser.submitStatsGlobal?.acSubmissionNum || [];
                const all = acList.find((i: any) => i.difficulty === "All")?.count || 0;
                const easy = acList.find((i: any) => i.difficulty === "Easy")?.count || 0;
                const medium = acList.find((i: any) => i.difficulty === "Medium")?.count || 0;
                const hard = acList.find((i: any) => i.difficulty === "Hard")?.count || 0;
                const contest = json.data.userContestRanking;
                const rating = contest?.rating ? Math.round(contest.rating) : 0;
                const badge = contest?.badge?.name || null;
                const ranking = json.data.matchedUser.profile?.ranking || null;

                return { handle, rating, solved: all, easySolved: easy, mediumSolved: medium, hardSolved: hard, badge, ranking };
            }
        }

        // Fallback
        const fallbackRes = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(handle)}`);
        if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            return {
                handle,
                rating: 0,
                solved: data.totalSolved || 0,
                easySolved: data.easySolved || 0,
                mediumSolved: data.mediumSolved || 0,
                hardSolved: data.hardSolved || 0,
                ranking: data.ranking || null
            };
        }
    } catch (e) {
        console.error(`Error fetching LeetCode for ${handle}:`, e);
    }
    return { handle, rating: 0, solved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
}

async function fetchCodeforcesStats(handle: string) {
    if (!handle) return { handle: "", rating: 0, maxRating: 0, rank: "unrated", solved: 0 };
    try {
        const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`, {
            next: { revalidate: 300 }
        });
        const infoJson = await infoRes.json();
        if (infoJson.status !== "OK" || !infoJson.result?.[0]) {
            return { handle, rating: 0, maxRating: 0, rank: "unrated", solved: 0 };
        }

        const user = infoJson.result[0];
        let solved = 0;

        try {
            const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=5000`, {
                next: { revalidate: 300 }
            });
            const statusJson = await statusRes.json();
            if (statusJson.status === "OK" && Array.isArray(statusJson.result)) {
                const uniqueProblems = new Set<string>();
                for (const sub of statusJson.result) {
                    if (sub.verdict === "OK" && sub.problem) {
                        uniqueProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);
                    }
                }
                solved = uniqueProblems.size;
            }
        } catch {}

        return {
            handle,
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
            rank: user.rank || "unrated",
            solved
        };
    } catch (e) {
        console.error(`Error fetching Codeforces for ${handle}:`, e);
    }
    return { handle, rating: 0, maxRating: 0, rank: "unrated", solved: 0 };
}

async function fetchCodeChefStats(handle: string) {
    if (!handle) return { handle: "", rating: 0, stars: "1★", solved: 0 };
    try {
        let url = `https://www.codechef.com/users/${encodeURIComponent(handle)}`;
        let res = await fetch(url, {
            redirect: "manual",
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
            },
            next: { revalidate: 300 }
        });

        if (res.status === 301 || res.status === 302) {
            const loc = res.headers.get("location");
            if (loc) {
                const fixedLoc = loc.replace(/^http:\/\//i, "https://");
                res = await fetch(fixedLoc, {
                    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
                    next: { revalidate: 300 }
                });
            }
        }

        if (res.ok) {
            const html = await res.text();
            if (!html.includes("User not found")) {
                const ratingMatch = html.match(/class="rating-number">\s*(\d+)\s*<\/div>/);
                const starsMatch = html.match(/class="rating-star">([\s\S]*?)<\/div>/);
                let stars = "1★";
                if (starsMatch) {
                    const count = (starsMatch[1].match(/&#9733;/g) || []).length;
                    if (count > 0) stars = `${count}★`;
                }
                const solvedMatch = html.match(/Total Problems Solved:\s*<span>(\d+)<\/span>/i) ||
                    html.match(/<h5>Fully Solved \((\d+)\)<\/h5>/i) ||
                    html.match(/Total Problems Solved:\s*(\d+)/i);

                return {
                    handle,
                    rating: ratingMatch ? parseInt(ratingMatch[1], 10) : 0,
                    stars,
                    solved: solvedMatch ? parseInt(solvedMatch[1], 10) : 0
                };
            }
        }
    } catch (e) {
        console.error(`Error fetching CodeChef for ${handle}:`, e);
    }
    return { handle, rating: 0, stars: "1★", solved: 0 };
}

function calculateDeltas(latest: CodingSnapshot, history: CodingSnapshot[]) {
    if (!history || history.length === 0) {
        return {
            weeklyProblemsDelta: 0,
            weeklyRatingDelta: 0,
            monthlyProblemsDelta: 0,
            monthlyRatingDelta: 0,
            previousSnapshot: null
        };
    }

    const now = new Date(latest.synced_at).getTime();

    // Find closest snapshot around 7 days ago (or immediately previous entry)
    let oneWeekAgoSnap = history[0];
    let oneMonthAgoSnap = history[0];

    const targetWeekMs = 7 * 24 * 60 * 60 * 1000;
    const targetMonthMs = 30 * 24 * 60 * 60 * 1000;

    let closestWeekDiff = Infinity;
    let closestMonthDiff = Infinity;

    for (const snap of history) {
        const snapTime = new Date(snap.synced_at).getTime();
        const ageMs = now - snapTime;

        if (ageMs > 0) {
            const weekDiff = Math.abs(ageMs - targetWeekMs);
            if (weekDiff < closestWeekDiff) {
                closestWeekDiff = weekDiff;
                oneWeekAgoSnap = snap;
            }

            const monthDiff = Math.abs(ageMs - targetMonthMs);
            if (monthDiff < closestMonthDiff) {
                closestMonthDiff = monthDiff;
                oneMonthAgoSnap = snap;
            }
        }
    }

    return {
        weeklyProblemsDelta: latest.total_solved - (oneWeekAgoSnap?.total_solved || latest.total_solved),
        weeklyRatingDelta: latest.main_rating - (oneWeekAgoSnap?.main_rating || latest.main_rating),
        monthlyProblemsDelta: latest.total_solved - (oneMonthAgoSnap?.total_solved || latest.total_solved),
        monthlyRatingDelta: latest.main_rating - (oneMonthAgoSnap?.main_rating || latest.main_rating),
        leetcodeRatingDelta: (latest.leetcode?.rating || 0) - (oneWeekAgoSnap?.leetcode?.rating || latest.leetcode?.rating || 0),
        codeforcesRatingDelta: (latest.codeforces?.rating || 0) - (oneWeekAgoSnap?.codeforces?.rating || latest.codeforces?.rating || 0),
        codechefRatingDelta: (latest.codechef?.rating || 0) - (oneWeekAgoSnap?.codechef?.rating || latest.codechef?.rating || 0),
        previousSnapshot: oneWeekAgoSnap
    };
}

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const studentIdParam = searchParams.get('studentId') || searchParams.get('userId');
        const batchIdParam = searchParams.get('batchId');

        const supabase = getSupabaseServerClient();
        let targetProfile: any = null;

        if (studentIdParam) {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentIdParam);
            if (isUUID) {
                const { data } = await supabase
                    .from('users')
                    .select('id, user_email, metadata, social_links, college')
                    .eq('id', studentIdParam)
                    .maybeSingle();
                targetProfile = data;
            }
            if (!targetProfile) {
                const { data } = await supabase
                    .from('users')
                    .select('id, user_email, metadata, social_links, college')
                    .eq('user_email', decodeURIComponent(studentIdParam))
                    .maybeSingle();
                targetProfile = data;
            }

            if (!targetProfile) {
                return NextResponse.json({ error: 'Student not found' }, { status: 404 });
            }

            // Authorization check when viewing another student
            if (targetProfile.user_email.toLowerCase() !== user.email.toLowerCase() && !user.isAdmin) {
                if (!batchIdParam) {
                    return NextResponse.json({ error: 'Batch context required to view student progress' }, { status: 400 });
                }
                const { data: batch } = await supabase
                    .from('batches')
                    .select('batch_id, enrolled_students')
                    .eq('batch_id', batchIdParam)
                    .maybeSingle();

                if (!batch) {
                    return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
                }

                const enrolled: string[] = Array.isArray(batch.enrolled_students) ? batch.enrolled_students : [];
                const isUserEnrolled = enrolled.some(e => e.trim().toLowerCase() === user.email.trim().toLowerCase());
                const isStudentEnrolled = enrolled.some(e => e.trim().toLowerCase() === targetProfile.user_email.trim().toLowerCase());

                if (!isUserEnrolled) {
                    return NextResponse.json({ error: 'Forbidden: You are not enrolled in this batch' }, { status: 403 });
                }
                if (!isStudentEnrolled) {
                    return NextResponse.json({ error: 'Student is not enrolled in this batch' }, { status: 404 });
                }
            }
        } else {
            const { data: userProfile, error } = await supabase
                .from('users')
                .select('id, user_email, metadata, social_links, college')
                .eq('user_email', user.email)
                .maybeSingle();

            if (error || !userProfile) {
                return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
            }
            targetProfile = userProfile;
        }

        const studentInfo = {
            id: targetProfile.id,
            email: targetProfile.user_email,
            name: targetProfile.metadata?.full_name || targetProfile.metadata?.name || targetProfile.user_email.split('@')[0],
            avatarUrl: targetProfile.metadata?.avatar_url || targetProfile.metadata?.picture || "",
            college: targetProfile.college || null,
            isCurrentUser: targetProfile.user_email.toLowerCase() === user.email.toLowerCase()
        };

        const codingStats = targetProfile.metadata?.coding_stats || null;
        const latest = codingStats?.latest as CodingSnapshot | undefined;
        const history: CodingSnapshot[] = codingStats?.history || [];
        const lastManualSync = codingStats?.last_manual_sync || null;

        const hasAllHandles = Boolean(
            targetProfile.social_links?.leetcode &&
            targetProfile.social_links?.codeforces &&
            targetProfile.social_links?.codechef
        );

        // Check if data is stale (> 7 days) and handles exist -> auto-sync
        const now = Date.now();
        const lastSyncedTime = latest?.synced_at ? new Date(latest.synced_at).getTime() : 0;
        const isOlderThanWeek = !latest || (now - lastSyncedTime > SEVEN_DAYS_MS);

        if (isOlderThanWeek && hasAllHandles) {
            // Auto sync
            return performSync(targetProfile.user_email, targetProfile, false, studentInfo);
        }

        // Return existing cached data
        if (latest) {
            const deltas = calculateDeltas(latest, history);
            const canManualSync = !lastManualSync || (now - new Date(lastManualSync).getTime() >= TWENTY_FOUR_HOURS_MS);
            const nextSyncAllowedAt = lastManualSync
                ? new Date(new Date(lastManualSync).getTime() + TWENTY_FOUR_HOURS_MS).toISOString()
                : new Date().toISOString();

            return NextResponse.json({
                student: studentInfo,
                hasAllHandles,
                latest,
                history,
                deltas,
                lastManualSync,
                canManualSync,
                nextSyncAllowedAt
            });
        }

        return NextResponse.json({
            student: studentInfo,
            hasAllHandles,
            latest: null,
            history: [],
            deltas: { weeklyProblemsDelta: 0, weeklyRatingDelta: 0, monthlyProblemsDelta: 0, monthlyRatingDelta: 0 },
            canManualSync: true
        });

    } catch (err: any) {
        console.error("Error in GET /api/coding-profiles/sync:", err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const isManual = Boolean(body.force);
        const studentIdParam = body.studentId || body.userId;
        const batchIdParam = body.batchId;

        const supabase = getSupabaseServerClient();
        let targetProfile: any = null;

        if (studentIdParam) {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentIdParam);
            if (isUUID) {
                const { data } = await supabase
                    .from('users')
                    .select('id, user_email, metadata, social_links, college')
                    .eq('id', studentIdParam)
                    .maybeSingle();
                targetProfile = data;
            }
            if (!targetProfile) {
                const { data } = await supabase
                    .from('users')
                    .select('id, user_email, metadata, social_links, college')
                    .eq('user_email', decodeURIComponent(studentIdParam))
                    .maybeSingle();
                targetProfile = data;
            }

            if (!targetProfile) {
                return NextResponse.json({ error: 'Student not found' }, { status: 404 });
            }

            // Authorization check
            if (targetProfile.user_email.toLowerCase() !== user.email.toLowerCase() && !user.isAdmin) {
                if (!batchIdParam) {
                    return NextResponse.json({ error: 'Batch context required' }, { status: 400 });
                }
                const { data: batch } = await supabase
                    .from('batches')
                    .select('batch_id, enrolled_students')
                    .eq('batch_id', batchIdParam)
                    .maybeSingle();

                if (!batch) {
                    return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
                }

                const enrolled: string[] = Array.isArray(batch.enrolled_students) ? batch.enrolled_students : [];
                const isUserEnrolled = enrolled.some(e => e.trim().toLowerCase() === user.email.trim().toLowerCase());
                const isStudentEnrolled = enrolled.some(e => e.trim().toLowerCase() === targetProfile.user_email.trim().toLowerCase());

                if (!isUserEnrolled || !isStudentEnrolled) {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }
            }
        } else {
            const { data: userProfile, error } = await supabase
                .from('users')
                .select('id, user_email, metadata, social_links, college')
                .eq('user_email', user.email)
                .maybeSingle();

            if (error || !userProfile) {
                return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
            }
            targetProfile = userProfile;
        }

        const studentInfo = {
            id: targetProfile.id,
            email: targetProfile.user_email,
            name: targetProfile.metadata?.full_name || targetProfile.metadata?.name || targetProfile.user_email.split('@')[0],
            avatarUrl: targetProfile.metadata?.avatar_url || targetProfile.metadata?.picture || "",
            college: targetProfile.college || null,
            isCurrentUser: targetProfile.user_email.toLowerCase() === user.email.toLowerCase()
        };

        const codingStats = targetProfile.metadata?.coding_stats || {};
        const lastManualSync = codingStats.last_manual_sync;
        const now = Date.now();

        // Enforce 24-hour rate-limit on manual sync
        if (isManual && lastManualSync) {
            const elapsed = now - new Date(lastManualSync).getTime();
            if (elapsed < TWENTY_FOUR_HOURS_MS) {
                const hoursLeft = Math.ceil((TWENTY_FOUR_HOURS_MS - elapsed) / (1000 * 60 * 60));
                return NextResponse.json({
                    error: `Manual sync is only permitted once every 24 hours. Please wait ${hoursLeft} more hour(s).`,
                    nextSyncAllowedAt: new Date(new Date(lastManualSync).getTime() + TWENTY_FOUR_HOURS_MS).toISOString()
                }, { status: 429 });
            }
        }

        return performSync(targetProfile.user_email, targetProfile, isManual, studentInfo);

    } catch (err: any) {
        console.error("Error in POST /api/coding-profiles/sync:", err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

async function performSync(userEmail: string, userProfile: any, isManual: boolean, studentInfo?: any) {
    const supabase = getSupabaseServerClient();
    const links = userProfile.social_links || {};

    const lcHandle = links.leetcode ? cleanCodingHandle("leetcode", links.leetcode) : "";
    const cfHandle = links.codeforces ? cleanCodingHandle("codeforces", links.codeforces) : "";
    const ccHandle = links.codechef ? cleanCodingHandle("codechef", links.codechef) : "";

    if (!lcHandle || !cfHandle || !ccHandle) {
        return NextResponse.json({
            error: "All three handles (LeetCode, Codeforces, CodeChef) must be connected before syncing."
        }, { status: 400 });
    }

    // Fetch live stats from all 3 platforms
    const [lcStats, cfStats, ccStats] = await Promise.all([
        fetchLeetCodeStats(lcHandle),
        fetchCodeforcesStats(cfHandle),
        fetchCodeChefStats(ccHandle)
    ]);

    const leetcodeRating = lcStats.rating || 0;
    const codeforcesRating = cfStats.rating || 0;
    const codechefRating = ccStats.rating || 0;

    const leetcodeSolved = lcStats.solved || 0;
    const codeforcesSolved = cfStats.solved || 0;
    const codechefSolved = ccStats.solved || 0;

    const totalSolved = leetcodeSolved + codeforcesSolved + codechefSolved;
    const mainRating = leetcodeRating + codeforcesRating + codechefRating;

    const newSnapshot: CodingSnapshot = {
        synced_at: new Date().toISOString(),
        main_rating: mainRating,
        total_solved: totalSolved,
        leetcode: {
            handle: lcHandle,
            rating: leetcodeRating,
            solved: leetcodeSolved,
            easySolved: lcStats.easySolved || 0,
            mediumSolved: lcStats.mediumSolved || 0,
            hardSolved: lcStats.hardSolved || 0,
            ranking: lcStats.ranking,
            badge: lcStats.badge
        },
        codeforces: {
            handle: cfHandle,
            rating: codeforcesRating,
            maxRating: cfStats.maxRating || 0,
            rank: cfStats.rank || "unrated",
            solved: codeforcesSolved
        },
        codechef: {
            handle: ccHandle,
            rating: codechefRating,
            stars: ccStats.stars || "1★",
            solved: codechefSolved
        }
    };

    const existingCodingStats = userProfile.metadata?.coding_stats || {};
    const oldLatest = existingCodingStats.latest as CodingSnapshot | undefined;
    let history: CodingSnapshot[] = Array.isArray(existingCodingStats.history) ? existingCodingStats.history : [];

    // If an old snapshot exists, add it to history (avoid duplicates within same day)
    if (oldLatest && oldLatest.synced_at) {
        const oldTime = new Date(oldLatest.synced_at).toDateString();
        const newTime = new Date().toDateString();
        // If not synced on the exact same calendar day, archive old snapshot
        if (oldTime !== newTime) {
            history.unshift(oldLatest);
        }
    }

    // Keep up to 52 snapshots (1 year of weekly snapshots)
    if (history.length > MAX_HISTORY_SNAPSHOTS) {
        history = history.slice(0, MAX_HISTORY_SNAPSHOTS);
    }

    const updatedCodingStats = {
        latest: newSnapshot,
        history,
        last_manual_sync: isManual ? new Date().toISOString() : (existingCodingStats.last_manual_sync || null)
    };

    const updatedMetadata = {
        ...(userProfile.metadata || {}),
        coding_stats: updatedCodingStats
    };

    const { error: updateError } = await supabase
        .from('users')
        .update({ metadata: updatedMetadata })
        .eq('user_email', userEmail);

    if (updateError) {
        console.error("Error updating user coding stats in metadata:", updateError);
        return NextResponse.json({ error: "Failed to persist synced stats" }, { status: 500 });
    }

    const deltas = calculateDeltas(newSnapshot, history);

    return NextResponse.json({
        message: "Coding stats synced successfully! 🚀",
        student: studentInfo,
        hasAllHandles: true,
        latest: newSnapshot,
        history,
        deltas,
        lastManualSync: updatedCodingStats.last_manual_sync,
        canManualSync: false,
        nextSyncAllowedAt: new Date(Date.now() + TWENTY_FOUR_HOURS_MS).toISOString()
    });
}
