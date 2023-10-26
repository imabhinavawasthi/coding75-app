// internshipsService.ts
import supabase from "@/supabase";

export async function fetchInternships(params) {
    
    if(params.url_slug){
        try {
            let { data: internships, error } = await supabase
                .from('internships')
                .select('*')
                .eq('url_slug',params.url_slug);
    
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
    else{
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
}
