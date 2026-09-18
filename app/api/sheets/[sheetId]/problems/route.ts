import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../_lib/supabase-server';

export async function GET(
  req: Request,
  context: { params: Promise<{ sheetId: string }> }
) {
  const { sheetId } = await context.params;
  try {
    const supabase = getSupabaseServerClient();

    // Fetch the sheet
    const { data: sheetData, error: sheetError } = await supabase
      .from('dsa_sheets')
      .select('id, title, sheet_json')
      .eq('id', sheetId)
      .single();

    if (sheetError || !sheetData) {
      return NextResponse.json({ problems: [] }, { status: 200 });
    }

    // Collect all problem slugs from sheet_json
    const problemSlugs = new Set<string>();
    sheetData.sheet_json?.topics?.forEach((topic: any) => {
      topic.steps?.forEach((step: any) => {
        step.problems?.forEach((prob: any) => {
          if (prob.problem_id) problemSlugs.add(prob.problem_id);
        });
      });
    });

    if (problemSlugs.size === 0) {
      return NextResponse.json({ sheetTitle: sheetData.title, problems: [] });
    }

    // Fetch detailed problem info
    const { data: problemsData } = await supabase
      .from('practice_problems')
      .select('id, slug, title, difficulty, problem_url, platform')
      .in('slug', Array.from(problemSlugs));

    return NextResponse.json({
      sheetTitle: sheetData.title,
      problems: problemsData || [],
    });
  } catch (err: any) {
    console.error('Error in GET /api/sheets/[sheetId]/problems:', err);
    return NextResponse.json({ problems: [] }, { status: 200 });
  }
}
