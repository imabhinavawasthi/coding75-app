import supabase from "@/supabase";

export async function fetchProblems() {


    try {

        let { data: dsaproblems, error } = await supabase
            .from('dsaproblems')
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
