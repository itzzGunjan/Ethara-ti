• PROMPT 
• CONTEXT AND ROLE 
With your proficiency as a Frontend Developer, your objective is to design and implement a high-performing personal portfolio website. It should have immersive animations for creating scroll-based storytelling on the website while keeping responsiveness, accessibility, and production quality intact. You are supposed to showcase projects, skills, and your experience in an animated narrative style that ensures a smooth visual experience for visitors. Besides, your application is required to have a fully-functional and secure mechanism for contacting users to capture their information and notify the owner via an email.

• OBJECTIVE

Develop a fully-fledged full-stack portfolio website that:

Has scroll-based storytelling animations done with Framer Motion.
Ensures a modern responsive interface with smooth transitions.
Has a “Get in Touch” button which opens a contact form dialog box.
Safely logs user data.

• UI AND ANIMATION REQUIREMNTS

Sends out an email containing user’s details to the owner. Scroll-Based Storytelling
Design scroll-based animations using Framer Motion.
Make parallax animations, fades, and other staggering animations.
Make the animations of sections one by one to give the effect of story-telling.
Have smooth transitions between:
Hero Section
About Section
Skills Section
Projects Section
Contact Section
Ensure the animations are:
Performant (without causing layout thrashing)
Using GPU friendly properties such as transform and opacity
Does not cause lagging on scrolling

• LAYOUT REQUIREMENTS

Portfolio Layout Requirements
There should be:

A hero section with animation
An about section with animation
A skills section with animation
A projects section with hover effects and animations
A call-to-action section with a button to contact the user
It should be:

Responsive
Accessible with proper ARIA labels and semantic HTML
Optimized for better performance

• Contact System Requirements

• MODAL BEHAVIOUR 

Modal Pop-Up
Clicking on the “Get in Touch” button should:

• CONTACT FORM FIELDS

Pop up a modal
Open a modal form
• VALIDATIONS 
Make sure that the modal pop-up comes with smooth animations through Framer Motion

• BACKEND REQUIREMENTS 

Form Fields
Name (mandatory)
Email (mandatory & validation)
Phone number (mandatory & validation)
Message (optional)
Form validation is done:

Client side with proper error handling
Proper validation with client-side validation
Backend requirements

Develop a server route that accepts form data
Log the submissions into server logs and optionally MongoDB or PostgreSQL database
Send an email to the portfolio owner containing

Name
Email
Phone number
Message
Timestamp
Email service can be sent through:
Using nodemailer package or any other transactional email provider services
Keep secrets safe by keeping credentials inside environment variables
Prevent spams from bots using CAPTCHAs

• Data Processing Requirements

Sanitize all inputs to prevent:
XSS attacks
Injection attacks
Validate email format properly.
Ensure API returns structured JSON responses:
Success message
• ERROR HANDLING AND DOCUMENTATION 
Handle frontend form errors gracefully.
Handle backend validation errors.
Provide structured error responses.
Log backend failures appropriately.
• Document:
Folder structure
Setup instructions
Environment variable configuration
Deployment steps
Performance and Scalability
Optimize bundle size.
Lazy-load heavy components.
Ensure animations do not degrade performance.
Support high traffic without API bottlenecks.
Use proper debouncing for user interactions.
Ensure accessibility and SEO optimization.
Technology Stack
Use the following:

Frontend:
React (or Next.js)
Framer Motion
Tailwind CSS (or equivalent styling solution)
Backend:
Node.js + Express (or Next.js API routes)
Nodemailer (or equivalent email service)
dotenv for environment configuration
Optional:
MongoDB or PostgreSQL for storing submissions