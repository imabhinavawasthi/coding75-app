export const metadata = {
    title: 'Fancy Testimonials Slider - Cruip Tutorials',
    description: 'Page description',
  }
import FancyTestimonialsSlider from './testimonials'
  
  export default function FancyTestimonialSliderPage() {  
  
    const testimonials = [
      {
        img: "https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/google.svg.png",
        quote: "The ability to capture responses is a game-changer. If a user gets tired of the sign up and leaves, that data is still persisted. Additionally, it's great to select between formats.",
        name: 'Abhinav Awasthi',
        role: 'SDE Intern at Google'
      },
      {
        img: "https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/google.svg.png",
        quote: "Having the power to capture user feedback is revolutionary. Even if a participant abandons the sign-up process midway, their valuable input remains intact.",
        name: 'Nick V',
        role: 'Malika Inc.'
      },
      {
        img: "https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/google.svg.png",
        quote: "The functionality to capture responses is a true game-changer. Even if a user becomes fatigued during sign-up and abandons the process, their information remains stored.",
        name: 'Amelia W',
        role: 'Panda AI'
      },
      {
        img: "https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/google.svg.png",
        quote: "The functionality to capture responses is a true game-changer. Even if a user becomes fatigued during sign-up and abandons the process, their information remains stored.",
        name: 'Amelia W',
        role: 'Panda AI'
      }
    ]
  
    return (
      <FancyTestimonialsSlider testimonials={testimonials} />
    )
  }