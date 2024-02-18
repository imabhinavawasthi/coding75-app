export const metadata = {
    title: 'Fancy Testimonials Slider - Cruip Tutorials',
    description: 'Page description',
  }
  
  import Google from '../../(dashboard)/_components/img/google.svg.png'
import FancyTestimonialsSlider from './testimonials'
  
  export default function FancyTestimonialSliderPage() {  
  
    const testimonials = [
      {
        img: Google,
        quote: "The ability to capture responses is a game-changer. If a user gets tired of the sign up and leaves, that data is still persisted. Additionally, it's great to select between formats.",
        name: 'Abhinav Awasthi',
        role: 'SDE Intern at Google'
      },
      {
        img: Google,
        quote: "Having the power to capture user feedback is revolutionary. Even if a participant abandons the sign-up process midway, their valuable input remains intact.",
        name: 'Nick V',
        role: 'Malika Inc.'
      },
      {
        img: Google,
        quote: "The functionality to capture responses is a true game-changer. Even if a user becomes fatigued during sign-up and abandons the process, their information remains stored.",
        name: 'Amelia W',
        role: 'Panda AI'
      },
      {
        img: Google,
        quote: "The functionality to capture responses is a true game-changer. Even if a user becomes fatigued during sign-up and abandons the process, their information remains stored.",
        name: 'Amelia W',
        role: 'Panda AI'
      }
    ]
  
    return (
      <FancyTestimonialsSlider testimonials={testimonials} />
    )
  }