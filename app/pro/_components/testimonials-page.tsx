export const metadata = {
    title: 'Fancy Testimonials Slider - Cruip Tutorials',
    description: 'Page description',
  }
import FancyTestimonialsSlider from './testimonials'
  
  export default function FancyTestimonialSliderPage() {  
  
    const testimonials = [
      {
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/ServiceNow_logo.svg/2560px-ServiceNow_logo.svg.png",
        quote: "I have attended the live DSA sessions and they are very useful. The concepts are explained thoroughly and doubts are resolved well, which helped me to get prepared for my placements and interviews.",
        name: 'Aditya Chaudhary',
        role: 'Intern at Service Now'
      },
      {
        img: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        quote: "Live project building sessions helped me a lot to put some good projects in my resume, with good resume review and mock interviews sessions, I got selected in microsoft internship.",
        name: 'Jatin Pal',
        role: 'SWE Intern at Microsoft.'
      },
      {
        img: "https://www.paisabazaar.com/PBHP/assets/images/paisabazaar-logo.svg",
        quote: "I used to attend live classes of DSA and CS Fundamentals, which made my basics of DSA and CS very clear, and I got my first internship in my second year.",
        name: 'Aditya Pandey',
        role: 'Intern at paisabazaar.com'
      },
      {
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/OpenText_logo.svg/2560px-OpenText_logo.svg.png",
        quote: "Attending the DSA and C++ lectures has truly been a game-changer for me. The guidance and regular doubt-clearing sessions were invaluable, helping me breeze through coding challenges and interview rounds with confidence. ",
        name: 'Priyanshu Singh',
        role: 'Software Engineer Intern at OpenText'
      },
      {
        img: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png",
        quote: "I have attended the live DSA&CP sessions and they are very useful. All the concepts are explained thoroughly and doubts are resolved well. I was able to reach ACM ICPC Regionals and grab an SDE internship at GeeksForGeeks.",
        name: 'Ripan Roy',
        role: 'SDE Intern Offer from GFG'
      },
      {
        img: "https://imgee.s3.amazonaws.com/imgee/a0baca393d534736b152750c7bde97f1.png",
        quote: "I was struggling with DSA, but after joining regular DSA and CP classes, I started solving problems and worked on my problem solving skills, and I was able to clear coding round of Juspay..",
        name: 'Aman Verma',
        role: 'Intern at Juspay'
      }
    ]
  
    return (
      <FancyTestimonialsSlider testimonials={testimonials} />
    )
  }