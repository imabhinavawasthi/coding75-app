import supabase from "@/supabase";

export async function fetchLeetcodePOTDProblems() {
    try {
        let { data: dsaproblems, error } = await supabase
            .from('leetcode-potd')
            .select('*')
            .order('date', { ascending: false })
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
