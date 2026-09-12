import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../_lib/supabase-server';
import { getAuthUser } from '../../../_lib/auth';
import { cleanCodingHandle } from '@/lib/profile-constants';

// In-memory cache for external coding stats (TTL: 5 minutes)
interface CachedStat {
    timestamp: number;
    data: any;
}
const statsCache: Map<string, CachedStat> = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCached<T>(key: string): T | null {
    const entry = statsCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        statsCache.delete(key);
        return null;
    }
    return entry.data as T;
}

function setCached(key: string, data: any) {
    statsCache.set(key, { timestamp: Date.now(), data });
}

async function fetchLeetCodeStats(handle: string) {
    if (!handle) return { rating: 0, solved: 0 };
    const cacheKey = `lc:${handle.toLowerCase()}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return cached;

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
              }
              userContestRanking(username: $username) {
                rating
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
                const contest = json.data.userContestRanking;
                const rating = contest?.rating ? Math.round(contest.rating) : 0;
                const result = { rating, solved: all };
                setCached(cacheKey, result);
                return result;
            }
        }

        // Fallback to alfa-leetcode-api
        const fallbackRes = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(handle)}`, {
            headers: { "User-Agent": "Mozilla/5.0" },
            next: { revalidate: 300 }
        });
        if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            const result = { rating: 0, solved: data.totalSolved || 0 };
            setCached(cacheKey, result);
            return result;
        }
    } catch (e) {
        console.error(`Error fetching LeetCode for ${handle}:`, e);
    }
    return { rating: 0, solved: 0 };
}

async function fetchCodeforcesStats(handle: string) {
    if (!handle) return { rating: 0, maxRating: 0, rank: "unrated", solved: 0 };
    const cacheKey = `cf:${handle.toLowerCase()}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return cached;

    try {
        const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`, {
            next: { revalidate: 300 }
        });
        const infoJson = await infoRes.json();
        if (infoJson.status !== "OK" || !infoJson.result?.[0]) {
            return { rating: 0, maxRating: 0, rank: "unrated", solved: 0 };
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

        const result = {
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
            rank: user.rank || "unrated",
            solved
        };
        setCached(cacheKey, result);
        return result;
    } catch (e) {
        console.error(`Error fetching Codeforces for ${handle}:`, e);
    }
    return { rating: 0, maxRating: 0, rank: "unrated", solved: 0 };
}

async function fetchCodeChefStats(handle: string) {
    if (!handle) return { rating: 0, stars: "1★", solved: 0 };
    const cacheKey = `cc:${handle.toLowerCase()}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return cached;

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
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
                    },
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

                const result = {
                    rating: ratingMatch ? parseInt(ratingMatch[1], 10) : 0,
                    stars,
                    solved: solvedMatch ? parseInt(solvedMatch[1], 10) : 0
                };
                setCached(cacheKey, result);
                return result;
            }
        }
    } catch (e) {
        console.error(`Error fetching CodeChef for ${handle}:`, e);
    }
    return { rating: 0, stars: "1★", solved: 0 };
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ batchId: string }> }
) {
    try {
        const { batchId } = await params;
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        const supabase = getSupabaseServerClient();

        // 1. Fetch batch info
        const { data: batch, error: batchError } = await supabase
            .from('batches')
            .select('batch_id, batch_name, enrolled_students, attributes')
            .eq('batch_id', batchId)
            .maybeSingle();

        if (batchError || !batch) {
            return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        }

        // Check if user is enrolled or admin
        const enrolledStudents: string[] = Array.isArray(batch.enrolled_students) ? batch.enrolled_students : [];
        const isEnrolled = enrolledStudents.some(
            (email: string) => email.trim().toLowerCase() === user.email.trim().toLowerCase()
        );

        if (!isEnrolled && !user.isAdmin) {
            return NextResponse.json({ error: 'Forbidden. You are not enrolled in this batch.' }, { status: 403 });
        }

        // 2. Fetch profiles from users table for enrolled students
        const normalizedEmails = enrolledStudents.map(e => e.trim().toLowerCase());
        const { data: userProfiles, error: usersError } = await supabase
            .from('users')
            .select('id, user_email, metadata, college, graduation_year, branch, social_links')
            .in('user_email', normalizedEmails);

        if (usersError) {
            console.error('Error fetching user profiles for ranklist:', usersError);
        }

        const profileMap = new Map<string, any>();
        (userProfiles || []).forEach(p => {
            profileMap.set(p.user_email.toLowerCase(), p);
        });

        // 3. For each student, gather their handles and compute stats
        // Process in concurrent batches of 5 to maintain good performance
        const studentStatsPromises = normalizedEmails.map(async (email) => {
            const profile = profileMap.get(email);
            const socialLinks = profile?.social_links || {};

            const lcHandle = socialLinks.leetcode ? cleanCodingHandle("leetcode", socialLinks.leetcode) : "";
            const cfHandle = socialLinks.codeforces ? cleanCodingHandle("codeforces", socialLinks.codeforces) : "";
            const ccHandle = socialLinks.codechef ? cleanCodingHandle("codechef", socialLinks.codechef) : "";
            const hasAllHandles = Boolean(lcHandle && cfHandle && ccHandle);

            const codingStats = profile?.metadata?.coding_stats || null;
            let latest = codingStats?.latest;
            const history = codingStats?.history || [];

            // If no latest snapshot exists in metadata, but handles exist, fetch live and populate
            if (!latest && hasAllHandles) {
                const [lcStats, cfStats, ccStats] = await Promise.all([
                    lcHandle ? fetchLeetCodeStats(lcHandle) : Promise.resolve({ rating: 0, solved: 0 }),
                    cfHandle ? fetchCodeforcesStats(cfHandle) : Promise.resolve({ rating: 0, maxRating: 0, rank: "unrated", solved: 0 }),
                    ccHandle ? fetchCodeChefStats(ccHandle) : Promise.resolve({ rating: 0, stars: "1★", solved: 0 }),
                ]);

                const leetcodeRating = lcStats.rating || 0;
                const codeforcesRating = cfStats.rating || 0;
                const codechefRating = ccStats.rating || 0;
                const leetcodeSolved = lcStats.solved || 0;
                const codeforcesSolved = cfStats.solved || 0;
                const codechefSolved = ccStats.solved || 0;

                const totalSolved = leetcodeSolved + codeforcesSolved + codechefSolved;
                const mainRating = leetcodeRating + codeforcesRating + codechefRating;

                latest = {
                    synced_at: new Date().toISOString(),
                    main_rating: mainRating,
                    total_solved: totalSolved,
                    leetcode: { handle: lcHandle, rating: leetcodeRating, solved: leetcodeSolved },
                    codeforces: { handle: cfHandle, rating: codeforcesRating, maxRating: cfStats.maxRating || 0, rank: cfStats.rank || "unrated", solved: codeforcesSolved },
                    codechef: { handle: ccHandle, rating: codechefRating, stars: ccStats.stars || "1★", solved: codechefSolved },
                };

                // Asynchronously persist initial snapshot to users.metadata
                supabase.from('users').update({
                    metadata: {
                        ...(profile?.metadata || {}),
                        coding_stats: { latest, history: [] }
                    }
                }).eq('user_email', email).then();
            }

            const leetcodeRating = latest?.leetcode?.rating || 0;
            const codeforcesRating = latest?.codeforces?.rating || 0;
            const codechefRating = latest?.codechef?.rating || 0;
            const leetcodeSolved = latest?.leetcode?.solved || 0;
            const codeforcesSolved = latest?.codeforces?.solved || 0;
            const codechefSolved = latest?.codechef?.solved || 0;

            const totalSolved = latest?.total_solved || (leetcodeSolved + codeforcesSolved + codechefSolved);
            const mainRating = latest?.main_rating || (leetcodeRating + codeforcesRating + codechefRating);

            const ratingsList = [leetcodeRating, codeforcesRating, codechefRating].filter(r => r > 0);
            const avgRating = ratingsList.length > 0 ? Math.round(mainRating / ratingsList.length) : 0;

            // Compute Weekly Deltas
            const lastWeekSnap = history.length > 0 ? history[0] : null;
            const weeklyProblemsDelta = lastWeekSnap ? Math.max(0, totalSolved - (lastWeekSnap.total_solved || totalSolved)) : 0;
            const weeklyRatingDelta = lastWeekSnap ? (mainRating - (lastWeekSnap.main_rating || mainRating)) : 0;

            // Name / avatar fallback
            const name = profile?.metadata?.full_name || profile?.metadata?.name || email.split('@')[0];
            const avatarUrl = profile?.metadata?.avatar_url || profile?.metadata?.picture || "";

            return {
                id: profile?.id || email,
                studentId: profile?.id || email,
                email,
                name,
                avatarUrl,
                college: profile?.college || null,
                hasAllHandles,
                handles: {
                    leetcode: lcHandle,
                    codeforces: cfHandle,
                    codechef: ccHandle,
                },
                stats: {
                    leetcode: {
                        handle: lcHandle,
                        rating: leetcodeRating,
                        solved: leetcodeSolved,
                    },
                    codeforces: {
                        handle: cfHandle,
                        rating: codeforcesRating,
                        maxRating: latest?.codeforces?.maxRating || 0,
                        rank: latest?.codeforces?.rank || "unrated",
                        solved: codeforcesSolved,
                    },
                    codechef: {
                        handle: ccHandle,
                        rating: codechefRating,
                        stars: latest?.codechef?.stars || "1★",
                        solved: codechefSolved,
                    }
                },
                mainRating,
                averageRating: avgRating,
                totalSolved,
                weeklyProblemsDelta,
                weeklyRatingDelta,
                lastSyncedAt: latest?.synced_at || null,
            };
        });

        const students = await Promise.all(studentStatsPromises);

        // 4. Sort students: Primary by mainRating (desc), Secondary by totalSolved (desc)
        students.sort((a, b) => {
            if (b.mainRating !== a.mainRating) {
                return b.mainRating - a.mainRating;
            }
            if (b.totalSolved !== a.totalSolved) {
                return b.totalSolved - a.totalSolved;
            }
            return a.name.localeCompare(b.name);
        });

        // Assign rank numbers
        const rankedStudents = students.map((student, idx) => ({
            rank: idx + 1,
            ...student,
        }));

        return NextResponse.json({
            batch_id: batch.batch_id,
            batch_name: batch.batch_name,
            totalStudents: rankedStudents.length,
            ranklist: rankedStudents
        });

    } catch (err: any) {
        console.error('Error in GET /api/batches/[batchId]/ranklist:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
