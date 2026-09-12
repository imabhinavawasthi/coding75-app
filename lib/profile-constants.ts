export const POPULAR_COLLEGES = [
    "Indian Institute of Technology (IIT) Bombay",
    "Indian Institute of Technology (IIT) Delhi",
    "Indian Institute of Technology (IIT) Madras",
    "Indian Institute of Technology (IIT) Kanpur",
    "Indian Institute of Technology (IIT) Kharagpur",
    "Indian Institute of Technology (IIT) Roorkee",
    "Indian Institute of Technology (IIT) Guwahati",
    "Indian Institute of Technology (IIT) BHU Varanasi",
    "Indian Institute of Technology (IIT) Hyderabad",
    "Indian Institute of Technology (IIT) Indore",
    "Indian Institute of Technology (IIT) Ropar",
    "Indian Institute of Technology (IIT) Mandi",
    "Indian Institute of Technology (IIT) Gandhinagar",
    "Indian Institute of Technology (IIT) Jodhpur",
    "Indian Institute of Technology (IIT) Patna",
    "Indian Institute of Technology (IIT) Bhubaneswar",
    "Indian Institute of Technology (IIT) Tirupati",
    "Indian Institute of Technology (IIT) Palakkad",
    "Indian Institute of Technology (IIT) Jammu",
    "Indian Institute of Technology (IIT) Dharwad",
    "Indian Institute of Technology (IIT) Bhilai",
    "Indian Institute of Technology (IIT) Goa",
    "Indian Institute of Information Technology (IIIT) Hyderabad",
    "Indian Institute of Information Technology (IIIT) Bangalore",
    "Indian Institute of Information Technology (IIIT) Delhi",
    "Indian Institute of Information Technology (IIIT) Allahabad",
    "Indian Institute of Information Technology (IIIT) Gwalior",
    "Indian Institute of Information Technology (IIIT) Jabalpur",
    "Indian Institute of Information Technology (IIIT) Kancheepuram",
    "Indian Institute of Information Technology (IIIT) Lucknow",
    "Indian Institute of Information Technology (IIIT) Pune",
    "Indian Institute of Information Technology (IIIT) Sri City",
    "Indian Institute of Information Technology (IIIT) Guwahati",
    "Birla Institute of Technology and Science (BITS) Pilani",
    "Birla Institute of Technology and Science (BITS) Goa",
    "Birla Institute of Technology and Science (BITS) Hyderabad",
    "National Institute of Technology (NIT) Tiruchirappalli (Trichy)",
    "National Institute of Technology (NIT) Karnataka, Surathkal",
    "National Institute of Technology (NIT) Warangal",
    "National Institute of Technology (NIT) Rourkela",
    "National Institute of Technology (NIT) Calicut",
    "National Institute of Technology (NIT) Kurukshetra",
    "National Institute of Technology (NIT) Durgapur",
    "National Institute of Technology (NIT) Silchar",
    "National Institute of Technology (NIT) Allahabad (MNNIT)",
    "National Institute of Technology (NIT) Jaipur (MNIT)",
    "National Institute of Technology (NIT) Nagpur (VNIT)",
    "National Institute of Technology (NIT) Bhopal (MANIT)",
    "National Institute of Technology (NIT) Jamshedpur",
    "National Institute of Technology (NIT) Jalandhar",
    "National Institute of Technology (NIT) Patna",
    "National Institute of Technology (NIT) Hamirpur",
    "National Institute of Technology (NIT) Raipur",
    "National Institute of Technology (NIT) Goa",
    "Delhi Technological University (DTU), Delhi",
    "Netaji Subhas University of Technology (NSUT), Delhi",
    "Indraprastha Institute of Information Technology (IIIT-Delhi)",
    "Punjab Engineering College (PEC), Chandigarh",
    "Thapar Institute of Engineering and Technology (TIET), Patiala",
    "Jadavpur University, Kolkata",
    "College of Engineering, Pune (COEP)",
    "Veermata Jijabai Technological Institute (VJTI), Mumbai",
    "Institute of Chemical Technology (ICT), Mumbai",
    "Anna University (CEG Campus), Chennai",
    "Vellore Institute of Technology (VIT), Vellore",
    "Vellore Institute of Technology (VIT), Chennai",
    "Manipal Institute of Technology (MIT), Manipal",
    "SRM Institute of Science and Technology, Chennai",
    "RV College of Engineering (RVCE), Bengaluru",
    "BMS College of Engineering (BMSCE), Bengaluru",
    "PES University, Bengaluru",
    "PW IOI (Pune)",
    "PW IOI (Noida)",
    "PW IOI (Lucknow)",
    "PW IOI (Bangalore)",
    "M. S. Ramaiah Institute of Technology, Bengaluru",
    "PSG College of Technology, Coimbatore",
    "Coimbatore Institute of Technology (CIT)",
    "Harcourt Butler Technical University (HBTU), Kanpur",
    "Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur",
    "University of Petroleum and Energy Studies (UPES), Dehradun",
    "Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar",
    "Siksha 'O' Anusandhan (SOA), Bhubaneswar",
    "Amrita Vishwa Vidyapeetham, Coimbatore",
    "SSN College of Engineering, Chennai",
    "Heritage Institute of Technology, Kolkata",
    "Institute of Engineering and Management (IEM), Kolkata",
    "International Institute of Information Technology (I²IT), Pune",
    "Symbiosis Institute of Technology (SIT), Pune",
    "MIT World Peace University (MIT-WPU), Pune",
    "Birla Institute of Technology (BIT), Mesra",
    "Other"
];

export const BRANCHES_LIST = [
    "Computer Science and Engineering (CSE)",
    "Information Technology (IT)",
    "Artificial Intelligence and Machine Learning (AI/ML)",
    "Data Science and Engineering",
    "Electronics and Communication Engineering (ECE)",
    "Electrical and Electronics Engineering (EEE)",
    "Electrical Engineering (EE)",
    "Mechanical Engineering (ME)",
    "Civil Engineering (CE)",
    "Chemical Engineering",
    "Aerospace Engineering",
    "Mathematics and Computing",
    "Biotechnology / Biomedical Engineering",
    "Instrumentation and Control Engineering",
    "Metallurgical and Materials Engineering",
    "Production and Industrial Engineering",
    "Other"
];

export function getGraduationYears(): string[] {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 20;
    const endYear = currentYear + 6;
    const years: string[] = [];
    for (let y = endYear; y >= startYear; y--) {
        years.push(String(y));
    }
    return years;
}

export function cleanCodingHandle(platform: string, rawInput: string): string {
    if (!rawInput) return "";
    let trimmed = rawInput.trim();

    // Remove trailing slashes
    trimmed = trimmed.replace(/\/+$/, "");

    try {
        if (platform === "leetcode") {
            // Examples: https://leetcode.com/u/john_doe, https://leetcode.com/john_doe/
            const match = trimmed.match(/(?:leetcode\.com\/(?:u\/)?)([\w-]+)/i);
            return match ? match[1] : trimmed.replace(/[@]/g, "");
        }

        if (platform === "codeforces") {
            // Examples: https://codeforces.com/profile/tourist
            const match = trimmed.match(/(?:codeforces\.com\/profile\/)([\w.-]+)/i);
            return match ? match[1] : trimmed.replace(/[@]/g, "");
        }

        if (platform === "codechef") {
            // Examples: https://www.codechef.com/users/gennady
            const match = trimmed.match(/(?:codechef\.com\/users\/)([\w_]+)/i);
            return match ? match[1] : trimmed.replace(/[@]/g, "");
        }

        if (platform === "github") {
            // Examples: https://github.com/torvalds
            const match = trimmed.match(/(?:github\.com\/)([\w-]+)/i);
            return match ? match[1] : trimmed.replace(/[@]/g, "");
        }

        if (platform === "gfg" || platform === "geeksforgeeks") {
            // Examples: https://www.geeksforgeeks.org/user/username/
            const match = trimmed.match(/(?:geeksforgeeks\.org\/user\/)([\w_]+)/i);
            return match ? match[1] : trimmed.replace(/[@]/g, "");
        }

        if (platform === "hackerrank") {
            // Examples: https://www.hackerrank.com/profile/username
            const match = trimmed.match(/(?:hackerrank\.com\/profile\/)([\w_]+)/i);
            return match ? match[1] : trimmed.replace(/[@]/g, "");
        }

        if (platform === "linkedin") {
            // Keep full link or username
            return trimmed;
        }

        if (platform === "twitter" || platform === "x") {
            // Examples: https://twitter.com/user, https://x.com/user
            const match = trimmed.match(/(?:(?:twitter|x)\.com\/)([\w_]+)/i);
            return match ? match[1] : trimmed.replace(/[@]/g, "");
        }
    } catch {
        return trimmed;
    }

    return trimmed;
}

export function getPlatformProfileUrl(platform: string, handleOrUrl: string): string {
    if (!handleOrUrl) return "";
    const clean = handleOrUrl.trim();
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
        return clean;
    }

    switch (platform) {
        case "leetcode":
            return `https://leetcode.com/u/${clean}`;
        case "codeforces":
            return `https://codeforces.com/profile/${clean}`;
        case "codechef":
            return `https://www.codechef.com/users/${clean}`;
        case "github":
            return `https://github.com/${clean}`;
        case "gfg":
        case "geeksforgeeks":
            return `https://www.geeksforgeeks.org/user/${clean}`;
        case "hackerrank":
            return `https://www.hackerrank.com/profile/${clean}`;
        case "twitter":
        case "x":
            return `https://x.com/${clean}`;
        case "linkedin":
            return clean.startsWith("http") ? clean : `https://www.linkedin.com/in/${clean}`;
        default:
            return clean;
    }
}
