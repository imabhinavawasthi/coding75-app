import supabase from "@/supabase";

export async function fetchSheet() {
    try {

        let { data: dsaproblems, error } = await supabase
            .from('expert_sheet')
            .select('*')

        if (error) {
            console.error('Error fetching data:', error);
            return { dsaproblems:null, error:error };
        } else {
            return { dsaproblems:dsaproblems, error:null };
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return { dsaproblems:null, error:error };
    }
}
