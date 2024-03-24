import supabase from "@/supabase"

let latexHeader = `%-------------------------------------------
%%%%%%%  Created Using coding75.com/resume  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%
`

const personalDetailCreator = (personalDetails, socialLinks) => {

    let template =
        `
        %-----------Personal Details-----------

    \\begin{center}
    {\\Huge \\scshape ${personalDetails?.fullName}} \\\\ \\vspace{1pt}
    ${personalDetails?.address} - ${personalDetails?.pincode} \\\\ \\vspace{1pt}
    \\small \\raisebox{-0.1\\height}\\faPhone\\ ${personalDetails?.contactNumber} ~ \\href{mailto:${personalDetails?.email}}{\\raisebox{-0.2\\height}\\faEnvelope\\  \\underline{${personalDetails?.email}}} ~ 
    \\href{${socialLinks?.linkedin}}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{Linkedin}}  ~
    \\href{${socialLinks?.github}}{\\raisebox{-0.2\\height}\\faGithub\ \\underline{Github}}
    \\vspace{-8pt}
    \\end{center}
    `
    return template
}

const educationCreator = (data) => {
    if (data == null || data.length == 0) {
        return ''
    }

    let info = ``
    data.map((val) => {
        info += `\\resumeSubheading 
{${formatter(val?.universityName)}}
{${formatter(val?.fromDate)} ${(val?.fromDate && val?.toDate) ? ` -- ` : ``} ${formatter(val?.toDate)}} 
{${formatter(val?.degreeName)} in ${formatter(val?.branch)} ${val?.score ? `(${formatter(val?.score)})` : ``}}
{${formatter(val?.location)}}` + `\n`
    })
    let template =
        `
\\section{Education}
\\resumeSubHeadingListStart
${info}
\\resumeSubHeadingListEnd
    `
    return template

}

const projectsCreator = (data) => {
    if (data == null || data.length == 0) {
        return ''
    }
    let projects = ``

    for (let i = 0; i < data.length; i++) {
        let point = ``

        data[i]['details'].map((val) => {
            if (val.trim().length > 0) {
                point += `\\resumeItem{${formatter(val)}}` + `\n`
            }
        })

        let project =
            `        
\\resumeProjectHeading 
{\\textbf{${formatter(data[i]?.projectName)}} $|$ \\emph{${formatter(data[i]?.techStack)}} $|$ {{\\href{${formatter(data[i]?.deployLink)}} {\\underline{Deloy}}}} {{\\href{${formatter(data[i]?.githubLink)}} {\\underline{Github}}}}}
{${formatter(data[i]?.fromDate)} ${(data[i]?.fromDate && data[i]?.toDate) ? ` -- ` : ``} ${formatter(data[i]?.toDate)}} 
${point.trim().length > 0 ?
                `
\\resumeItemListStart
${point}
\\resumeItemListEnd
`
                :
                ``
            }
       
        `

        projects += project + `\n`


    }


    let template =
        `
    \\section{Projects}
    \\resumeSubHeadingListStart
        ${projects}
    \\resumeSubHeadingListEnd
    `

    return template

}

const experienceCreator = (data) => {
    if (data == null || data.length == 0) {
        return ''
    }
    let experiences = ``

    for (let i = 0; i < data.length; i++) {
        let point = ``


        data[i]['details'].map((val) => {
            if (val.trim().length > 0) {
                point += `\\resumeItem{${formatter(val)}}` + `\n`
            }
        })

        let experience = `
        \\resumeSubheading 
{${formatter(data[i]?.companyName)}}
{${formatter(data[i]?.fromDate)} ${(data[i]?.fromDate && data[i]?.toDate) ? ` -- ` : ``} ${formatter(data[i]?.toDate)}} 
{${formatter(data[i]?.jobRole)}} 
{${formatter(data[i]?.location)}}
        ${point.trim().length > 0 ?
                `
            \\resumeItemListStart
            \\small{\\setlength\\itemsep{-4pt}}
                ${point}
            \\resumeItemListEnd
            `
                :
                ``
            }
        `
        if (i != data.length - 1)
            experiences += experience + `\\vspace{-6pt}` + `\n`
        else
            experiences += experience + `\n`


    }


    let template =
        `
    \\section{Experiences}
    \\resumeSubHeadingListStart
        ${experiences}
    \\resumeSubHeadingListEnd
    `

    return template

}

const skillsCreator = (data) => {

    if (data == null || data.length == 0) {
        return ''
    }
    let skills = ``
    if (data?.languages)
        skills += `\\textbf{Languages}{: ${formatter(data?.languages)}} \\\\` + `\n`
    if (data?.developerTools)
        skills += `\\textbf{Developer Tools}{: ${formatter(data?.developerTools)}} \\\\` + `\n`
    if (data?.relevantCoursework)
        skills += `\\textbf{Relevant Coursework}{: ${formatter(data?.relevantCoursework)}} \\\\` + `\n`
    if (data?.technologiesAndFrameworks)
        skills += `\\textbf{Technologies and Frameworks}{: ${formatter(data?.technologiesAndFrameworks)}} \\\\` + `\n`


    let template =
        `
        \\section{Technical Skills}
    \\begin{itemize}[leftmargin=0.15in, label={}]
        \\small{\\item{
            ${skills}
        }}
    \\end{itemize}
    `

    return template

}

const achievementCreator = (data, name) => {
    if (data == null || data.length == 0) {
        return ''
    }
    let achievements = ``

    for (let i = 0; i < data?.['details'].length; i++) {
        let point = ``

        point += `\\resumeItem{${formatter(data?.['details']?.[i])}}` + `\n`
        if (i != data?.['details'].length - 1)
            point += `\\vspace{-10pt}` + `\n`

        let achievement = `
        ${point.trim().length > 0 ?
                `
            \\resumeItemListStart
            \\small{\\setlength\\itemsep{-4pt}}
                ${point}
            \\resumeItemListEnd
            `
                :
                ``
            }
        `

        achievements += achievement + `\n`


    }


    let template =
        `
    \\section{${name}}
    \\resumeSubHeadingListStart 
        ${achievements}
    \\resumeSubHeadingListEnd
    `

    return template

}

const formatter = (val) => {

    if (val == undefined || val == null) {
        return ''
    }

    let updatedStr = val.replace(/[^\x00-\x7F]/g, "");;
    let targetChars = ['/\\/', '%', '$', '#', '&', '^']

    // Iterate over each target character
    for (let i = 0; i < targetChars.length; i++) {
        const targetChar = targetChars[i];
        const replacementChar = `\\${targetChar}`

        // Check if the target character is present in the string
        if (updatedStr.includes(targetChar)) {
            // Replace all occurrences of the target character with the replacement character
            updatedStr = updatedStr.replace(new RegExp(targetChar, 'g'), replacementChar);
        }
    }

    return updatedStr;

}

async function loadPersonalDetails(user_email) {
    try {
        let { data, error } = await supabase
            .from('resume-details')
            .select("personal_details")
            .eq('user_email', user_email);

        if (error) {
            console.log(error);
        } else {
            if (data && data.length > 0) {
                return data[0]?.['personal_details']
            }

        }
    } catch (e) {
        console.log(e);
    }
}

async function loadSocialLinks(user_email) {
    try {
        let { data, error } = await supabase
            .from('resume-details')
            .select("social_links")
            .eq('user_email', user_email);

        if (error) {
            console.log(error);
        } else {
            if (data && data.length > 0) {
                return data[0]?.['social_links']
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function loadEducationDetails(user_email) {
    try {
        let { data, error } = await supabase
            .from('resume-details')
            .select("education")
            .eq('user_email', user_email);

        if (error) {
            console.log(error);
        } else {
            if (data && data.length > 0) {
                return data[0]?.['education']
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function loadProjectDetails(user_email) {
    try {
        let { data, error } = await supabase
            .from('resume-details')
            .select("projects")
            .eq('user_email', user_email);

        if (error) {
            console.log(error);
        } else {
            if (data && data.length > 0) {
                return data[0]?.['projects']
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function loadExperienceDetails(user_email) {
    try {
        let { data, error } = await supabase
            .from('resume-details')
            .select("experience")
            .eq('user_email', user_email);

        if (error) {
            console.log(error);
        } else {
            if (data && data.length > 0) {
                return data[0]?.['experience']
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function loadSkillDetails(user_email) {
    try {
        let { data, error } = await supabase
            .from('resume-details')
            .select("skills")
            .eq('user_email', user_email);

        if (error) {
            console.log(error);
        } else {
            if (data && data.length > 0) {
                return data[0]?.['skills']
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function loadAchievementDetails(user_email) {
    try {
        let { data, error } = await supabase
            .from('resume-details')
            .select("achievements")
            .eq('user_email', user_email);

        if (error) {
            console.log(error);
        } else {
            if (data && data.length > 0) {
                return data[0]?.['achievements']
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function loadECDetails(user_email) {
    try {
        let { data, error } = await supabase
            .from('resume-details')
            .select("extra_curricular")
            .eq('user_email', user_email);

        if (error) {
            console.log(error);
        } else {
            if (data && data.length > 0) {
                return data[0]?.['extra_curricular']
            }
        }
    } catch (e) {
        console.log(e);
    }
}

export async function createResume(user_email) {
    const personalDetailData = await loadPersonalDetails(user_email)
    const socialLinksData = await loadSocialLinks(user_email)
    const educationDetailsData = await loadEducationDetails(user_email)
    const projectDetailsData = await loadProjectDetails(user_email)
    const experienceDetailsData = await loadExperienceDetails(user_email)
    const skillDetailsData = await loadSkillDetails(user_email)
    const achievementDetailsData = await loadAchievementDetails(user_email)
    const ecDetailsData = await loadECDetails(user_email)

    const personalDetail = personalDetailCreator(personalDetailData, socialLinksData)
    const educationDetail = educationCreator(educationDetailsData)
    const projectDetail = projectsCreator(projectDetailsData)
    const experienceDetail = experienceCreator(experienceDetailsData)
    const skillDetail = skillsCreator(skillDetailsData)
    const achievementDetail = achievementCreator(achievementDetailsData, "Achievements")
    const ecDetail = achievementCreator(ecDetailsData, "Extra Curricular")

    let template =
        `
    ${latexHeader}
    \\begin{document}
    ${personalDetail}
    ${educationDetail}
    ${experienceDetail}
    ${projectDetail}
    ${skillDetail}
    ${achievementDetail}
    ${ecDetail}
    \\end{document}
    `
    return template
}