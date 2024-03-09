import supabase from "@/supabase";

export async function fetchLeetcodeContest(contest_name:any) {
    try {
        let { data: dsaproblems, error } = await supabase
            .from('leetcode-contests')
            .select('*')
            .like('contest_name',contest_name)
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            return { dsaproblems };
        }
        return { dsaproblems, error };
    } catch (error) {
        console.error('An error occurred:', error);
        return { error };
    }
}
