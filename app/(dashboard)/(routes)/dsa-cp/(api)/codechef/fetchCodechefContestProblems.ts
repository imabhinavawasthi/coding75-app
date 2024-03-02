import supabase from "@/supabase";

export async function fetchCodechefContestProblems(contest_name:any) {
    try {
        let { data: dsaproblems, error } = await supabase
            .from('codechef-contests')
            .select('*')
            .like('contest',contest_name)
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
