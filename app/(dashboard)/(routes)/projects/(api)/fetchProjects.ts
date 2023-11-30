// internshipsService.ts
import supabase from "@/supabase";

export async function fetchProjects(params: any) {
    
    
    try {
        let { data: projects, error } = await supabase
            .from(params.projecttype)
            .select('*')

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            return { projects };
        }

        return { projects, error };
    } catch (error) {
        console.error('An error occurred:', error);
        return { error };
    }
}
