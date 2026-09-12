import supabase from "@/supabase";

export async function fetchLeetcodePOTD({ problem }: { problem: string | number }) {
    try {
        if (!problem) return { dsaproblem: null };
        const decoded = decodeURIComponent(String(problem)).trim();
        const isNumeric = /^\d+$/.test(decoded);

        if (isNumeric) {
            const { data: byId } = await supabase
                .from('leetcode-potd')
                .select('*')
                .eq('id', Number(decoded));
            if (byId && byId.length > 0) {
                return { dsaproblem: byId };
            }
        }

        let { data: dsaproblem, error } = await supabase
            .from('leetcode-potd')
            .select('*')
            .ilike('slug_url', decoded);

        if (!error && (!dsaproblem || dsaproblem.length === 0)) {
            const res = await supabase
                .from('leetcode-potd')
                .select('*')
                .ilike('slug_url', `%${decoded}%`);
            if (res.data && res.data.length > 0) {
                dsaproblem = res.data;
            }
        }

        if (error) {
            console.error('Error fetching data:', error);
        }
        return { dsaproblem, error };
    } catch (error) {
        console.error('An error occurred:', error);
        return { error };
    }
}

