import { NextResponse } from 'next/server';

interface PlatformStatsResult {
    handle: string;
    rating: number;
    solved: number;
    [key: string]: any;
}

async function fetchLeetCodeStats(handle: string): Promise<PlatformStatsResult> {
    try {
        const query = `
            query getUserProfile($username: String!) {
              matchedUser(username: $username) {
                username
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
                globalRanking
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
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
                const ranking = contest?.globalRanking || json.data.matchedUser.profile?.ranking || null;

                return {
                    handle,
                    rating,
                    solved: all,
                    easySolved: easy,
                    mediumSolved: medium,
                    hardSolved: hard,
                    badge,
                    ranking,
                    status: "success"
                };
            }
        }

        // Fallback to alfa-leetcode-api
        const fallbackRes = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(handle)}`, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            return {
                handle,
                rating: 0,
                solved: data.totalSolved || 0,
                easySolved: data.easySolved || 0,
                mediumSolved: data.mediumSolved || 0,
                hardSolved: data.hardSolved || 0,
                ranking: data.ranking || null,
                status: "success"
            };
        }

        return { handle, rating: 0, solved: 0, status: "not_found", error: "User not found on LeetCode" };
    } catch (err: any) {
        console.error("Error fetching LeetCode stats:", err);
        return { handle, rating: 0, solved: 0, status: "error", error: err.message || "Failed to fetch LeetCode stats" };
    }
}

async function fetchCodeforcesStats(handle: string): Promise<PlatformStatsResult> {
    try {
        const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`, {
            next: { revalidate: 300 }
        });
        const infoJson = await infoRes.json();

        if (infoJson.status !== "OK" || !infoJson.result?.[0]) {
            return { handle, rating: 0, solved: 0, status: "not_found", error: "User not found on Codeforces" };
        }

        const user = infoJson.result[0];

        // Fetch submissions to calculate unique solved problems
        let solvedCount = 0;
        try {
            const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`, {
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
                solvedCount = uniqueProblems.size;
            }
        } catch (e) {
            console.error("Could not fetch Codeforces problem submissions:", e);
        }

        return {
            handle,
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
            rank: user.rank || "unrated",
            maxRank: user.maxRank || "unrated",
            solved: solvedCount,
            status: "success"
        };
    } catch (err: any) {
        console.error("Error fetching Codeforces stats:", err);
        return { handle, rating: 0, solved: 0, status: "error", error: err.message || "Failed to fetch Codeforces stats" };
    }
}

async function fetchCodeChefStats(handle: string): Promise<PlatformStatsResult> {
    try {
        let url = `https://www.codechef.com/users/${encodeURIComponent(handle)}`;
        let res = await fetch(url, {
            redirect: "manual",
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            next: { revalidate: 300 }
        });

        if (res.status === 301 || res.status === 302) {
            const loc = res.headers.get("location");
            if (loc) {
                const fixedLoc = loc.replace(/^http:\/\//i, "https://");
                res = await fetch(fixedLoc, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    },
                    next: { revalidate: 300 }
                });
            }
        }

        if (!res.ok) {
            return { handle, rating: 0, solved: 0, status: "not_found", error: `CodeChef user returned status ${res.status}` };
        }

        const html = await res.text();

        // Check if page indicates user not found
        if (html.includes("User not found") || html.includes("404 Not Found")) {
            return { handle, rating: 0, solved: 0, status: "not_found", error: "User not found on CodeChef" };
        }

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

        const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;
        const solved = solvedMatch ? parseInt(solvedMatch[1], 10) : 0;

        return {
            handle,
            rating,
            stars,
            solved,
            status: "success"
        };
    } catch (err: any) {
        console.error("Error fetching CodeChef stats:", err);
        return { handle, rating: 0, solved: 0, status: "error", error: err.message || "Failed to fetch CodeChef stats" };
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const leetcode = searchParams.get('leetcode')?.trim();
        const codeforces = searchParams.get('codeforces')?.trim();
        const codechef = searchParams.get('codechef')?.trim();

        if (!leetcode && !codeforces && !codechef) {
            return NextResponse.json({
                error: 'Please provide at least one handle: leetcode, codeforces, or codechef'
            }, { status: 400 });
        }

        const [leetcodeRes, codeforcesRes, codechefRes] = await Promise.allSettled([
            leetcode ? fetchLeetCodeStats(leetcode) : Promise.resolve(null),
            codeforces ? fetchCodeforcesStats(codeforces) : Promise.resolve(null),
            codechef ? fetchCodeChefStats(codechef) : Promise.resolve(null),
        ]);

        const leetcodeData = leetcodeRes.status === 'fulfilled' ? leetcodeRes.value : null;
        const codeforcesData = codeforcesRes.status === 'fulfilled' ? codeforcesRes.value : null;
        const codechefData = codechefRes.status === 'fulfilled' ? codechefRes.value : null;

        const totalSolved = (leetcodeData?.solved || 0) + (codeforcesData?.solved || 0) + (codechefData?.solved || 0);

        return NextResponse.json({
            stats: {
                leetcode: leetcodeData,
                codeforces: codeforcesData,
                codechef: codechefData,
            },
            summary: {
                totalSolved,
                leetcodeSolved: leetcodeData?.solved || 0,
                codeforcesSolved: codeforcesData?.solved || 0,
                codechefSolved: codechefData?.solved || 0,
                leetcodeRating: leetcodeData?.rating || 0,
                codeforcesRating: codeforcesData?.rating || 0,
                codechefRating: codechefData?.rating || 0,
            }
        });
    } catch (err: any) {
        console.error("Error in GET /api/coding-profiles/stats:", err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
