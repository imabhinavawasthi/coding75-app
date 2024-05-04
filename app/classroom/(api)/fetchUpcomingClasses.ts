import supabase from "@/supabase";

export async function fetchUpcomingClasses(topicname:any) {
    console.log(topicname);
    if (topicname && topicname != "") {
        try {
            let { data: classes, error } = await supabase
                .from('live-classes')
                .select('*')
                .order("class_time_epoch")
                .gt("class_time_epoch", Math.floor(new Date().getTime() / 1000))
                .eq("class_topic", topicname)

            if (error) {
                console.error('Error fetching data:', error);
                return { classes: null, error: error };
            } else {
                return { classes: classes, error: null };
            }
        } catch (error) {
            console.error('An error occurred:', error);
            return { classes: null, error: error };
        }
    }
    else {
        try {
            let { data: classes, error } = await supabase
                .from('live-classes')
                .select('*')
                .order("class_time_epoch")
                .gt("class_time_epoch", Math.floor(new Date().getTime() / 1000))

            if (error) {
                console.error('Error fetching data:', error);
                return { classes: null, error: error };
            } else {
                return { classes: classes, error: null };
            }
        } catch (error) {
            console.error('An error occurred:', error);
            return { classes: null, error: error };
        }
    }
}
