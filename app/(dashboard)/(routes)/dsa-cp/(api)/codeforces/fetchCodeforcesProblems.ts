import supabase from "@/supabase";

export async function fetchCodeforcesProblems() {
    try {
        let { data: dsaproblems, error } = await supabase
            .from('codeforces-contests')
            .select('*')
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
