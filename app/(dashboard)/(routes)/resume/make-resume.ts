import supabase from "@/supabase"

let latexHeader =`%-------------------------------------------
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
    {\\Huge \\scshape Abhinav Awasthi} \\\\ \\vspace{1pt}
    Kanpur, India - 208021 \\\\ \\vspace{1pt}
    \\small \\raisebox{-0.1\\height}\\faPhone\\ 9935859460 ~ \\href{mailto:awasthiabhinav744@gmail.com}{\\raisebox{-0.2\\height}\\faEnvelope\\  \\underline{awasthiabhinav744@gmail.com}} ~ 
    \\href{https://linkedin.com/in/abhinavawasthi01/}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{/abhinavawasthi01}}  ~
    \\href{https://github.com/imabhinavawasthi}{\\raisebox{-0.2\\height}\\faGithub\ \\underline{/imabhinavawasthi}}
    \\vspace{-8pt}
    \\end{center}
    `
    return template
}


// {cllgName:'',course:'',location:'',year:''}
const educationCreator = (data) => {
    if (data == null || data.length == 0) {
        return ''
    }

    let info = ``
    data.map((val) => {
        info += `\\resumeSubheading {${formatter(val?.cllgName)}}{${formatter(val?.location)}} {${formatter(val?.course)}}{${formatter(val?.year)}}` + `\n`
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

[{ projectName: '', tech: '', link: '', points: [''] }]

const projectsSection = (data) => {
    if (data == null || data.length == 0) {
        return ''
    }
    let projects = ``

    for (let i = 0; i < data.length; i++) {
        let point = ``

        data[i]['points'].map((val) => {
            if (val.trim().length > 0) {
                point += `\\resumeItem{${formatter(val)}}` + `\n`
            }
        })

        let project = `
        \\resumeProjectHeading {\\textbf{${formatter(data[i]?.projectName)}} $|$ \\emph{${formatter(data[i]?.tech)}}}{\\href{${formatter(data[i]?.link)}}{\\underline{link}}}
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
// {company:'',role:'',location:'',date:'',points:['']}
const experienceCreator = (data) => {
    if (data == null || data.length == 0) {
        return ''
    }
    let experiences = ``

    for (let i = 0; i < data.length; i++) {
        let point = ``


        data[i]['points'].map((val) => {
            if (val.trim().length > 0) {
                point += `\\resumeItem{${formatter(val)}}` + `\n`
            }
        })

        let experience = `
        \\resumeSubheading {${formatter(data[i]?.company)} | ${formatter(data[i]?.role)}}{${formatter(data[i]?.date)}}{${formatter(data[i]?.location)}}{}
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


// {name:'',points:['']}
const achievementCreator = (data) => {
    if (data == null || data.length == 0) {
        return ''
    }
    let achievements = ``

    for (let i = 0; i < data.length; i++) {
        let point = ``

        data[i]['points'].map((val) => {
            if (val.trim().length > 0) {
                point += `\\resumeItem{${formatter(val)}}` + `\n`
            }
        })

        let achievement = `
        \\resumeProjectHeading {\\textbf{${formatter(data[i]?.name)}}}{}
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

        achievements += achievement + `\n`


    }


    let template =
        `
    \\section{Achievement}
    \\resumeSubHeadingListStart
        ${achievements}
    \\resumeSubHeadingListEnd
    `

    return template

}

// {skillName:'',skillValue:''}
const skillsCreator = (data) => {

    if (data == null || data.length == 0) {
        return ''
    }
    let skills = ``

    data.map((val) => {
        skills += `\\textbf{${formatter(val?.skillName)}}{: ${formatter(val?.skillValue)}} \\\\` + `\n`
    })


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
            alert(error);
        } else {
            if (data && data.length > 0) {
                return data[0]?.['personal_details']
            }

        }
    } catch (e) {
        alert(e);
    }
}

async function loadSocialLinks(user_email) {
    try {
        let { data, error } = await supabase
            .from('resume-details')
            .select("social_links")
            .eq('user_email', user_email);

        if (error) {
            alert(error);
        } else {
            if (data && data.length > 0) {
                return data[0]?.['social_links']
            }
        }
    } catch (e) {
        alert(e);
    }
}

export async function createResume(user_email) {
    const personalDetailData = await loadPersonalDetails(user_email)
    const socialLinksData = await loadSocialLinks(user_email)

    const personalDetail = personalDetailCreator(personalDetailData, socialLinksData)

    let template =
        `
    ${latexHeader}
    \\begin{document}
    ${personalDetail}
    \\end{document}
    `
    return template
}