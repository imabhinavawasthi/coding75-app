import supabase from "@/supabase";

export async function fetchProblem({problem}) {
    try {
        
        let { data: dsaproblem, error } = await supabase
            .from('dsaproblems')
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
