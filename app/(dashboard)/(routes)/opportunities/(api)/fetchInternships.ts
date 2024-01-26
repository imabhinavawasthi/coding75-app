// internshipsService.ts
import supabase from "@/supabase";

export async function fetchInternships(url_slug:any, batch:any) {
    if(batch){
        try {
            let { data: internships, error } = await supabase
                .from('internships')
                .select('*')
                .contains('batch_eligible',[parseInt(batch)])
    
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
    else if(url_slug){
        
        try {
            let { data: internships, error } = await supabase
                .from('internships')
                .select('*')
                .eq('url_slug',url_slug);
    
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
