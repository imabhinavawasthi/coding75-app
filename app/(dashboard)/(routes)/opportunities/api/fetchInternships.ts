// internshipsService.ts
import supabase from "@/supabase";

export async function fetchInternships() {
    try {
        let { data: internships, error } = await supabase
            .from('internships')
            .select('*');

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            return { internships };
        }

        return { internships, error };
    } catch (error) {
        console.error('An error occurred:', error);
        return { error };
    }
}
