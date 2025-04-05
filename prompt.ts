// accessible-transcript-prompt.js

const prompt: { task: string, input: string, output: string } = {
    task: `Imagine you are describing the webpage to a blind user.  You are their eyes, guiding them through the page's content and functionality in a clear, conversational, and engaging way.  Don't just list HTML elements; explain the page as if you were talking to someone sitting next to you.  Use natural language, descriptive phrases, and a friendly tone.`,
    input: "Provide the complete HTML source code of the webpage.", // This remains the same
    output: `A human-like transcript following these guidelines:
  
  1. **Start with a welcoming introduction:** Briefly introduce the page and its purpose (e.g., "Welcome to the Santa Clara University School of Engineering website! This page provides information about...").
  
  2. **Natural Flow:** Describe the page content in a logical order, as if you were visually scanning it.  Use transitions and connecting phrases (e.g., "Next, you'll find...", "Moving down the page...",  "Over on the right side...").
  
  3. **Engaging Language:** Use descriptive language to paint a picture of the page's visual elements.  Instead of saying "An image with alt text 'New School of Engineering Logo'," say something like "The updated School of Engineering logo is displayed here. It's a modern design featuring...".
  
  4. **Actionable Descriptions:** For interactive elements, explain *what they do*, not just *what they are*. Example: Instead of "A button with the text 'Giving'," say "There's a button here that takes you to the Giving page where you can support the School of Engineering."
  
  5. **Contextualize:** Relate visual elements to the surrounding content.  Example: "Under the headline 'About the School,' you'll see a photo of the Dean.  She looks very approachable...".
  
  6. **Conciseness:** Be descriptive but avoid unnecessary detail.  Focus on the most important information and what would be most helpful to a blind user.
  
  7. **Personality:** Inject some personality and warmth into your description.  Make it sound like a helpful conversation, not a technical readout.
  
  **Example of a good visual description:** "There's a large banner image at the top of the page.  It shows students collaborating on a project in a brightly lit lab, with lots of high-tech equipment around them. This image really conveys the energy and innovation of the School."
  
  **Example of how to describe a navigation menu:** "The main navigation bar has links to About, Academics, Research, and so on.  If you click on 'Academics,' you'll find a dropdown menu with options for undergraduate and graduate programs. It's easy to navigate and explore the different areas of the site."
  
  
  By following these guidelines, the output transcript will be a truly accessible and engaging experience for a blind user, bringing the webpage to life through your words.`,
};
export default prompt;