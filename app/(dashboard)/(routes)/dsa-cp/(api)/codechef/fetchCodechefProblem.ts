import supabase from "@/supabase";

export async function fetchCodechefProblem({problem}) {
    try {
        
        let { data: dsaproblem, error } = await supabase
            .from('codechef-contests')
            .select('*')
            .like("slug_url",problem)
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            return { dsaproblem };
        }

        return { dsaproblem, error };
    } catch (error) {
        console.error('An error occurred:', error);
        return { error };
    }
}
