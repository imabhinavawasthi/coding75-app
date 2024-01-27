// internshipsService.ts
import supabase from "@/supabase";

export async function fetchProjects(projectType=undefined, projectSlug=undefined, projectLevel=undefined) {
    
    if(projectType){
        try {
            let { data: projects, error } = projectLevel?await supabase
            .from("projects")
            .select('*')
            .eq('slug_url',projectType)
            .eq('project_level',projectLevel)
            :await supabase
            .from("projects")
            .select('*')
            .eq('slug_url',projectType)

    
            if (error) {
                console.error('Error fetching data:', error);
            }
    
            return { projects, error };
        } catch (error) {
            console.error('An error occurred:', error);
            return { undefined, error };
        }
    }
    else if(projectSlug){
        try {
            let { data: projects, error } = await supabase
                .from("projects")
                .select('*')
                .eq('slug_href',projectSlug)
    
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
}
